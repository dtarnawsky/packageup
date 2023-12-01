import { major, minor } from "semver";
import { DependencyInfo, ProjectInfo } from "./inspect";

export interface ProjectResult {
    project: ProjectInfo;

    score: number;
    metrics: Record<string, Metric>;
}

export interface Metric {
    name: string;
    score: number;
    total: number;
    count: number;
    notes: string[];
    majorNote: string | undefined;
}

export async function analyze(project: ProjectInfo): Promise<ProjectResult> {
    const result: ProjectResult = { project, score: 0, metrics: {} };
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
        const metric = setMetric(key, dep, result.metrics);
        try {
            const majorDiff = major(dep.latest) - major(dep.current);
            if (majorDiff > 0) {
                //metric.notes.push(`<code>${key}</code> is behind ${majorDiff} version${majorDiff > 1 ? 's' : ''}.`);
                metric.notes.push(`${key} (v${major(dep.current)} > v${major(dep.latest)})`);
                const isFramework = metric.name == 'Framework';
                if (isFramework) {
                    if (key == '@angular/core') {
                        metric.majorNote = `Migrate Angular from v${major(dep.current)} to v${major(dep.latest)}.`;
                    }
                }
                if (key == '@capacitor/core') {
                    metric.majorNote = `Migrate Capacitor from v${major(dep.current)} to v${major(dep.latest)}.`;
                }
                switch (majorDiff) {
                    case 1: depScore = isFramework ? 75 : 50; break;
                    case 2: depScore = isFramework ? 50 : 20; break;
                    default: depScore = isFramework ? 25 : 0;
                }
            } else {
                const minorDiff = minor(dep.latest) - minor(dep.current);
                if (minorDiff > 0) {
                    //metric.notes.push(`<code>${key}</code> could be updated from ${dep.current} to ${dep.latest}.`);
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
                metric.notes.push(`${key} has an invalid version ${dep.latest} (current is ${dep.current})`);
            }
            console.error(`Failed with ${key}:` + err);
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

function setMetric(dep: string, i: DependencyInfo, metrics: Record<string, Metric>): Metric {
    let name = 'Other';
    if (i.pluginType == 'Capacitor') name = 'Plugins';
    if (i.pluginType == 'Cordova') name = 'Plugins';
    if (dep.startsWith('@angular/')) name = 'Framework';
    if (dep.startsWith('@angular-devkit/')) name = 'Framework';
    if (dep.startsWith('@angular-eslint/')) name = 'Framework';
    if (dep.startsWith('react-')) name = 'Framework';
    if (dep.startsWith('vue-')) name = 'Framework';
    if (dep.startsWith('@vue/')) name = 'Framework';
    if (dep.startsWith('@ionic/')) name = 'Ionic';
    if (dep.startsWith('@awesome-cordova-plugins/')) name = 'Plugins';
    if (dep.startsWith('@ionic-native/')) name = 'Plugins';
    // if (dep.startsWith('karma-')) name = 'Testing';
    // if (dep.startsWith('jasmine-')) name = 'Testing';

    switch (dep) {
        case 'react':
        case 'vue':
        case '@angular/core': name = 'Framework'; break;
        case '@ionic/react':
        case '@ionic/vue':
        case '@ionic/angular': name = 'Ionic'; break;
        // case 'cypress': name = 'Testing'; break;
        case '@capacitor/core':
        case '@capacitor/ios':
        case '@capacitor/android':
        case '@capacitor/cli':
        case 'cordova':
        case 'cordova-android':
        case 'cordova-ios': name = 'Platform'; break;
    }

    if (!metrics[name]) {
        metrics[name] = { name, score: 0, total: 0, count: 0, notes: [], majorNote: undefined };
    }
    return metrics[name];
}