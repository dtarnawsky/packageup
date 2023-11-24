import { ProjectResult } from "./analyze";
import { write } from "./log";
import { outputHtml } from "./report-html";

export type ReportOutputType = 'email' | 'html' | 'json';

export interface ReportOptions {
    type: ReportOutputType;
    email?: string;
}

export async function report(project: ProjectResult, options: ReportOptions): Promise<void> {
    write('Project Notes:');
    if (options.type == 'json') return;

    write(`${project.project.name} scored ${project.score}%`);
    for (const key of Object.keys(project.metrics)) {
        console.log(` - ${key} scored ${project.metrics[key].score}%`);
        for (const note of project.metrics[key].notes) {
            console.log(` - ${note}`);
        }
    }
    outputHtml(project);
}