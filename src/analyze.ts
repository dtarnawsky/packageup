import { major, minor } from "semver";
import { ProjectInfo } from "./inspect";

export interface ProjectResult {
    project: ProjectInfo;
    notes: string[];
}

export async function analyze(project: ProjectInfo): Promise<ProjectResult> {
    const result: ProjectResult = { project, notes: []};
    for (const key of Object.keys(project.dependencies)) {
        const dep = project.dependencies[key];
        const majorDiff = major(dep.latest) - major(dep.current);
        if (majorDiff > 0) {
            result.notes.push(`${key} is behind ${majorDiff} version.`);
        } else {
            const minorDiff = minor(dep.latest) - minor(dep.current);
            if (minorDiff > 0) {
                result.notes.push(`${key} could be updated from ${dep.current} to ${dep.latest}.`);
            }
        }
    }
    return result;
}