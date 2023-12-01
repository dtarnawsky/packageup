
import { ProjectResult } from "./analyze";
import { getGauge } from "./gauge";
import { gaugeCss, generalCss } from "./gauge-css";
import { countIssues, now, toTitleCase } from "./report";

export function outputHtml(project: ProjectResult): string {
    const issues = countIssues(project);
    let issuesNote = `and has ${issues} issues:`;
    if (issues == 0) {
        issuesNote = `and has no issues.`;
    }
    if (issues == 1) {
        issuesNote = `and has 1 issue:`;
    }

    let html = '<html>';
    html += `<style>${generalCss()}`;
    for (const key of Object.keys(project.metrics)) {
        html += `${gaugeCss(key, project.metrics[key].score)}`;
    }
    html += `</style>`;
    html += `
    <body>
    <div class="page">
    <div class="row">
    <h1>${toTitleCase(project.project.name)}</h1>
    </div>
    <a href="${project.project.remoteUrl}" target="_blank"><div class="metrics row">
       ${metrics(project)}
    </div></a>
    <div class="notes">    
       ${toTitleCase(project.project.name)} scored ${project.score}% ${issuesNote}
    </div>
    ${notes(project)}
    <div class="notes topline">    
       Version ${project.project.version}. Created on ${now()} by PackageUp
    </div>
    </div>
    </body>
    </html>
    `;    
    return html;
}



function notes(project: ProjectResult) {
    let html = ''
    for (const key of Object.keys(project.metrics)) {
        const title = key == 'Other' ? `Other Dependencies` : key;
        if (project.metrics[key].majorNote) {
            html += `
        <div class="notes">
           <h3>${title}</h3>
        </div>
        <div class="notes">
        ${project.metrics[key].majorNote}<br/><br/>
        </div>
        `;
        } else if (project.metrics[key].notes.length > 0) {
            html += `
        <div class="notes">
        <h3>${title}</h3>
        </div>
        <div class="notes">
        <ul>`;
            for (const note of project.metrics[key].notes) {

                html += `<li><code>${note.dependency}</code> - ${note.notes}</li>`;
            }
            html += '</ul></div>';
        }
    }
    return html;
}

function metrics(project: ProjectResult) {
    let html = '';
    for (const key of Object.keys(project.metrics)) {
        html += getGauge(key, key, project.metrics[key].score);
    }
    return html;
}



