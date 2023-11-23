import { ProjectResult } from "./analyze";
import { write } from "./log";

export type ReportOutputType = 'email' | 'html' | 'json';

export interface ReportOptions {
    type: ReportOutputType;
    email?: string;
}

export async function report(project: ProjectResult, options: ReportOptions): Promise<void> {
    write('Project Notes:');
    if (options.type == 'json') return;
    for (const note of project.notes) {
        console.log(` - ${note}`);
    }
    write(`${project.project.name} scored ${project.score}%`);
    for (const key of Object.keys(project.metrics)) {
        console.log(` - ${key} scored ${project.metrics[key].score}%`);
    }
}