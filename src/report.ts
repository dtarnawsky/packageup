import { ProjectResult } from "./analyze";
import { verbose } from "./log";
import { outputHtml } from "./report-html";

export type ReportOutputType = 'email' | 'html' | 'json';

export interface ReportOptions {
    type: ReportOutputType;
    email?: string;
}

export async function report(project: ProjectResult, options: ReportOptions): Promise<string> {
    verbose('Project Notes:');
    if (options.type == 'json') return '';
    verbose(`${project.project.name} scored ${project.score}%`);
    for (const key of Object.keys(project.metrics)) {
        verbose(` - ${key} scored ${project.metrics[key].score}%`);
        for (const note of project.metrics[key].notes) {
            verbose(` - ${note}`);
        }
    }
    return outputHtml(project);
}