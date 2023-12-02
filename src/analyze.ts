import { major, minor } from "semver";
import { DependencyInfo, ProjectInfo } from "./inspect";
import { RecommendationType, RuleSet } from "./analyze-ruleset";
import { verbose, writeError } from "./log";

export interface ProjectResult {
    project: ProjectInfo;
    filename: string | undefined; // Filename the results were written to
    score: number; // Overall project score
    metrics: Record<string, Metric>; // Score by group
}


export interface Metric {
    name: string;
    score: number;
    total: number;
    weight: number;
    count: number;
    recommendations: Recommendation[];
    majorNote: string | undefined;
}

export interface Recommendation {
    type: RecommendationType
    priority: PriorityType
    notes: string
    dependency?: string
}


export type PriorityType = 'Normal' | 'High';

export async function analyze(project: ProjectInfo, ruleSet: RuleSet): Promise<ProjectResult> {
    validate(ruleSet);
    const result: ProjectResult = { project, score: 0, metrics: {}, filename: undefined };
    let total = 0;
    let score = 0;
    let depScore = 0;
    if (!project.dependencies) {
        console.error(`The project has no dependencies.`);
        return result;
    }
    for (const key of Object.keys(project.dependencies)) {
        depScore = 100;
        const dep = project.dependencies[key];
        const metric = setMetric(key, dep, result.metrics, ruleSet);
        try {
            const majorDiff = major(dep.latest) - major(dep.current);
            if (majorDiff > 0) {
                let priority: PriorityType = 'Normal';
                let notes = `Update from v@current to v@latest`;
                const vars =
                [
                    `@current=${major(dep.current)}`,
                    `@latest=${major(dep.latest)}`,
                    `@dep=${key}`
                ];
                for (const rule of ruleSet.rules) {
                    if (rule.dependency == key) {
                        if (rule.type == 'Major') {
                            metric.majorNote = replace(rule.note, vars);
                        }
                        if (rule.type == 'Important') {
                            priority = 'High';
                            notes = rule.note;
                        }
                    }
                }                
                notes = replace(notes, vars);
                metric.recommendations.push(
                    {
                        dependency: key,
                        type: 'Major',
                        priority,
                        notes
                    }
                );
                switch (majorDiff) {
                    case 1: depScore = 50; break;
                    case 2: depScore = 20; break;
                    default: depScore = 0;
                }
            } else {
                const minorDiff = minor(dep.latest) - minor(dep.current);
                if (minorDiff > 0) {
                    depScore = 99;
                } else {
                    // Up to date enough
                    depScore = 100;
                }
            }
        } catch (err) {
            depScore = 100;
            if (`${err}`.includes('Invalid version')) {
                depScore = 0;
                metric.recommendations.push({
                    type: 'Error',
                    priority: 'Normal',
                    dependency: key,
                    notes: `${key} has an invalid version ${dep.latest} (current is ${dep.current})`

                });
            }
            console.error(`Failed with ${key}:` + err);
        }
        score += depScore * metric.weight;
        total += 100 * metric.weight;
        metric.count += depScore;
        metric.total += 100;
        metric.score = Math.trunc(metric.count * 100.0 / metric.total);
        if (metric.score < 0) metric.score = 0;
    }
    result.score = Math.trunc(score * 100.0 / total);
    return result;
}

function setMetric(dep: string, i: DependencyInfo, metrics: Record<string, Metric>, ruleSet: RuleSet): Metric {
    let name = 'Other';
    let weight = 1;
    for (const rule of ruleSet.metricRules) {
        if (rule.pluginTypes) {
            for (const pluginType of rule.pluginTypes) {
                if (i.pluginType == pluginType) {
                    name = rule.metricTypeName;
                }
            }
        }
        if (rule.dependencies) {
            for (const dependency of rule.dependencies) {
                if (dependency.endsWith('*')) {
                    if (dep.startsWith(dependency.replace('*', ''))) {
                        name = rule.metricTypeName;
                    }
                } else if (dep == dependency) {
                    name = rule.metricTypeName;
                }
            }
        }
    }
    for (const metric of ruleSet.metrics) {
        if (metric.name == name) {
            weight = metric.weight;
        }
    }
    verbose(`${dep} is ${name} with weight ${weight}`);
    if (!metrics[name]) {
        metrics[name] = { name, score: 0, total: 0, count: 0, recommendations: [], majorNote: undefined, weight };
    }
    return metrics[name];
}

function validate(ruleSet: RuleSet) {
    for (const rule of ruleSet.metricRules) {
        const metricTypeName = ruleSet.metrics.find((metric) => metric.name == rule.metricTypeName);
        if (!metricTypeName) {
            writeError(`Ruleset has a metricRule with name "${rule.metricTypeName}" that is not defined in metrics.`);
            process.exit(1);
        }
    }
}

function replace(note: string, keyValues: string[]): string {
    let result = note;
    for (const keyVal of keyValues) {
        const kv = keyVal.split('=');
        result = result.replace(kv[0], kv[1]);
    }
    return result;
}