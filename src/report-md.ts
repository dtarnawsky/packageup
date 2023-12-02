import { Metric, ProjectResult } from "./analyze";
import { color, countIssues, now, toTitleCase } from "./report";

export function outputMd(result: ProjectResult): string {
    const issues = countIssues(result);
    let md = '';

    md += `# Project Health ${gaugeMd('Overall', result.score, true)}\n`;
    const url = result.project.remoteUrl ?? 'https://packageup.io';
    md += `This report was created using [PackageUp](https://packageup.io) on ${now()} for version ${result.project.version} of [${toTitleCase(result.project.name)}](${url}).\n\n`;

    md += `## Scores\n`;
    md += `Your project scored ${result.score}% overall based on these categories:\n\n`;

    for (const key of metricList(result.metrics)) {        
        md += `- :${color(result.metrics[key].score)}_circle: ${key} - ${result.metrics[key].score}%\n`;
    }
    if (issues) {
        md += '## Your Homework\n';
        md += `Improve your project by addressing these items:\n`;
        md += notes(result);
    }
    return md;
}

function metricList(metrics: Record<string, Metric>): string[] {
   const values = Object.keys(metrics);
   return values.sort((a: string,b: string) => metrics[a].score - metrics[b].score);
}

function gaugeMd(name: string, score: number, large = false): string {
    return `<img src="https://img.shields.io/badge/${name}-${score}%25-${color(score)}.svg" alt="${name} scored ${score}%." ${large ? 'style="200px"' : ''} />`;
    //return `- **${name}** - ${score}%`;
}

function notes(result: ProjectResult) {
    let md = ''
    for (const key of Object.keys(result.metrics)) {
        if (result.metrics[key].majorNote) {
            md += `1. :red_circle: ${result.metrics[key].majorNote}\n`;
        }
    }
    for (const key of Object.keys(result.metrics)) {
        if (!result.metrics[key].majorNote) {
            for (const note of result.metrics[key].recommendations) {
                md += `1. :orange_circle: \`${note.dependency}\` - ${note.notes}\n`;
            }
        }
    }
    return md;
}