import { ProjectResult } from "./analyze";
import { verbose } from "./log";
import { outputHtml } from "./report-html";
import { outputMd } from "./report-md";
import { outputTxt } from "./report-txt";

export type ReportOutputType = 'email' | 'html' | 'json' | 'md' | 'txt';

export interface ReportOptions {
    type: ReportOutputType;
    email?: string;
}

export async function report(project: ProjectResult, options: ReportOptions): Promise<string> {
    verbose('Project Notes:');
    
    verbose(`${project.project.name} scored ${project.score}%`);
    for (const key of Object.keys(project.metrics)) {
        verbose(` - ${key} scored ${project.metrics[key].score}%`);
        for (const note of project.metrics[key].recommendations) {
            verbose(` - ${note}`);
        }
    }
    switch (options.type) {
        case 'html': return outputHtml(project);
        case 'md': return outputMd(project);
        case 'txt': return outputTxt(project);
        case 'json': throw new Error('Not implemented');
        default: throw new Error(`Unknown type ${options.type}`);
    }
}

export function color(score: number): string {
    if (score <= 25) {
        return 'red';
    } else if (score <= 50) {
        return 'orange';
    } else if (score <= 75) {
        return 'yellow';
    } else return 'green';
}

export function colorEmoji(score: number): string {
    if (score <= 25) {
        return '🔴';
    } else if (score <= 50) {
        return '🟠';
    } else if (score <= 75) {
        return '🟡';
    } else return '🟢';
}

export function colorSeverity(severity: string | undefined): string {
    switch (severity) {
        case 'critical': return '🔴';
        case 'high': return '🟠';
        case 'moderate': return '🟡';
        case 'low': return '⚪';
        default: return '-';
    }
}

export function countIssues(project: ProjectResult): number {
    let count = 0;
    for (const key of Object.keys(project.metrics)) {
        if (project.metrics[key].majorNote) {
            count++;
        } else {
            count += project.metrics[key].recommendations.length;
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