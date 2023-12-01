import { ProjectResult } from "./analyze";
import { countIssues, now, toTitleCase } from "./report";

export function outputMd(result: ProjectResult): string {
    const issues = countIssues(result);
    let md = '';
    let issuesNote = `are ${issues} issues`;
    if (issues == 0) {
        issuesNote = `are no issues`;
    }
    if (issues == 1) {
        issuesNote = `is 1 issue`;
    }

    md += `# Project Health ${gaugeMd('Overall', result.score, true)}\n`;    
    md += `This report was created using [PackageUp](https://packageup.io) on ${now()} for version ${result.project.version} of ${toTitleCase(result.project.name)}.\n\n`;

    md += `## Scores\n`;
    md += `Your project scored ${result.score}% overall based on these categories:\n\n`;

    md += '<div>';
    for (const key of Object.keys(result.metrics)) {
        md += `${gaugeMd(key, result.metrics[key].score)}\n`;
    }
    md += '</div>\n\n';    
    md += '## Issues\n';
    md += `There ${issuesNote} found listed below that could be addressed to improve your project.\n`;
    md += notes(result);
    return md;
}

function gaugeMd(name: string, score: number, large = false): string {
    return `<img src="https://img.shields.io/badge/${name}-${score}%25-${color(score)}.svg" alt="${name} scored ${score}%." ${large ? 'style="200px"' : ''} />`;
    //return `- **${name}** - ${score}%`;
}

function color(score: number): string {
   if (score <= 25) {
    return 'red';
   } else if (score <= 50) {
    return 'orange';
   } else if (score <= 75) {
    return 'yellow';
   } else return 'green';
}

function notes(result: ProjectResult) {
    let md = ''
    for (const key of Object.keys(result.metrics)) {
        const title = key == 'Other' ? `Other Dependencies` : key;
        if (result.metrics[key].majorNote) {
            md += `### ${title}\n`;
            md += `${result.metrics[key].majorNote}\n\n`;
        } else if (result.metrics[key].notes.length > 0) {
            md += `### ${title}\n`;
            for (const note of result.metrics[key].notes) {
                md += `- \`${note}\`\n`;
            }
            md += '\n';
        }
    }
    return md;
}