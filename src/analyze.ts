import { major, minor } from "semver";
import { ProjectInfo } from "./inspect";

export interface ProjectResult {
    project: ProjectInfo;
    notes: string[];
    score: number;
    metrics: Record<string, Metric>;
}

export interface Metric {
    name: string;
    score: number;
    total: number;
    count: number;
}

export async function analyze(project: ProjectInfo): Promise<ProjectResult> {
    const result: ProjectResult = { project, notes: [], score: 0, metrics: {} };
    let total = 0;
    let score = 0;
    let depScore = 0;
    for (const key of Object.keys(project.dependencies)) {
        depScore = 100;
        const dep = project.dependencies[key];
        const metric = setMetric(key, result.metrics);
        try {
            const majorDiff = major(dep.latest) - major(dep.current);
            if (majorDiff > 0) {
                result.notes.push(`${key} is behind ${majorDiff} version.`);
                switch (majorDiff) {
                    case 1: depScore = -50; break;
                    case 2: depScore = -100; break;
                    default: depScore = -200;
                }
            } else {
                const minorDiff = minor(dep.latest) - minor(dep.current);
                if (minorDiff > 0) {
                    result.notes.push(`${key} could be updated from ${dep.current} to ${dep.latest}.`);
                    depScore = 95;
                } else {
                    // Up to date enough
                    depScore = 100;
                }
            }
        } catch (err) {
            depScore = 100;
            if (`${err}`.includes('Invalid version')) {
                depScore = 0;
                result.notes.push(`${key} has an invalid version ${dep.latest} (current is ${dep.current})`);
            }
        }
        score += depScore;
        total += 100;
        metric.count += depScore;
        metric.total += 100;
        metric.score = Math.trunc(metric.count * 100.0 / metric.total);
        if (metric.score < 0) metric.score = 0;
    }
    result.score = Math.trunc(score * 100.0 / total);
    return result;
}

function setMetric(dep: string, metrics: Record<string, Metric>): Metric {
    let name = 'Other';
    if (dep.startsWith('cordova-plugin-')) name = 'Plugins';
    if (dep.startsWith('@capacitor/')) name = 'Plugins';
    if (dep.startsWith('capacitor-')) name = 'Plugins';
    if (dep.startsWith('@angular/')) name = 'Framework';

    switch (dep) {
        case '@angular/core': name = 'Framework'; break;
        case '@ionic/react':
        case '@ionic/vue':
        case '@ionic/angular': name = 'Ionic'; break;
        case '@capacitor/core':
        case '@capacitor/ios':
        case '@capacitor/android':
        case 'cordova':
        case 'cordova-android':
        case 'cordova-ios': name = 'Platform'; break;
    }

    if (!metrics[name]) {
        metrics[name] = { name, score: 0, total: 0, count: 0 };
    }
    return metrics[name];
}