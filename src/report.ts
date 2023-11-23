import { ProjectResult } from "./analyze";

export type ReportOutputType = 'email' | 'html' | 'json';

export interface ReportOptions {
    type: ReportOutputType;
    email?: string;
}

export async function report(project: ProjectResult, options: ReportOptions): Promise<void> {
    console.log(project.project.name);
    if (options.type == 'json') return;
    for (const note of project.notes) {
        console.log(note);
    }
}