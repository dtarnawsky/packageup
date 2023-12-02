import { Metric, ProjectResult, Recommendation } from "./analyze";
import { write } from "./log";
import { colorEmoji, countIssues, toTitleCase } from "./report";

export function outputTxt(result: ProjectResult): string {
    const issues = countIssues(result);


    write(`${colorEmoji(result.score)} ${toTitleCase(result.project.name)} v${result.project.version} scored ${result.score}% using packageup.io`);
    //const url = result.project.remoteUrl ?? 'https://packageup.io';

    write(' ');
    write(`This score was based on these categories:`);

    for (const key of metricList(result.metrics)) {
        write(`${colorEmoji(result.metrics[key].score)} ${key} - ${result.metrics[key].score}%`);
    }
    if (issues) {
        write(' ');
        write(`Improve your project by addressing these items:`);
        notes(result);
    }
    return '';
}

function metricList(metrics: Record<string, Metric>): string[] {
    const values = Object.keys(metrics);
    return values.sort((a: string, b: string) => metrics[a].score - metrics[b].score);
}

function byPriority(recommendations: Recommendation[]): Recommendation[] {    
    return recommendations.sort((a: Recommendation, b: Recommendation) => a.priority.localeCompare(b.priority));
}

function notes(result: ProjectResult) {
    for (const key of Object.keys(result.metrics)) {
        if (result.metrics[key].majorNote) {
            write(`- ${result.metrics[key].majorNote} ⭐`);
        }
    }
    for (const key of Object.keys(result.metrics)) {
        if (!result.metrics[key].majorNote) {
            for (const item of byPriority(result.metrics[key].recommendations)) {
                if (item.priority == 'High') {
                    write(`- ${item.notes} ⭐`);
                } else {
                    write(`- ${item.dependency} - ${item.notes}`);
                }
            }
        }
    }
}