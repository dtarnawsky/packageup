import { ProjectResult } from "./analyze";
import { verbose } from "./log";
import { outputHtml } from "./report-html";
import { outputMd } from "./report-md";

export type ReportOutputType = 'email' | 'html' | 'json' | 'md';

export interface ReportOptions {
    type: ReportOutputType;
    email?: string;
}

export async function report(project: ProjectResult, options: ReportOptions): Promise<string> {
    verbose('Project Notes:');
    
    verbose(`${project.project.name} scored ${project.score}%`);
    for (const key of Object.keys(project.metrics)) {
        verbose(` - ${key} scored ${project.metrics[key].score}%`);
        for (const note of project.metrics[key].notes) {
            verbose(` - ${note}`);
        }
    }
    switch (options.type) {
        case 'html': return outputHtml(project);
        case 'md': return outputMd(project);
        case 'json': throw new Error('Not implemented');
        default: throw new Error(`Unknown type ${options.type}`);
    }
}

export function countIssues(project: ProjectResult): number {
    let count = 0;
    for (const key of Object.keys(project.metrics)) {
        if (project.metrics[key].majorNote) {
            count++;
        } else {
            count += project.metrics[key].notes.length;
        }
    }
    return count;
}

export function now() {
    return `${new Date().toLocaleDateString()} at ${time()}`;
}

function time() {
    return new Date().toLocaleTimeString([], { timeStyle: 'short' }).toLowerCase().replace(' ', '');
}

export function toTitleCase(str: string): string {
    return str.replace(
      /\w\S*/g,
      function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }