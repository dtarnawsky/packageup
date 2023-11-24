
import { writeFileSync } from "fs";
import { ProjectResult } from "./analyze";
import { getGauge } from "./gauge";
import { write } from "./log";
import { gaugeCss, generalCss } from "./gauge-css";

export function outputHtml(project: ProjectResult) {
    let html = '';
    html += `<style>${generalCss()}`;
    for (const key of Object.keys(project.metrics)) {
        html += `${gaugeCss(key, project.metrics[key].score)}`;
    }
    html += `</style>`;
    html += `
    <div class="row">
       <h1>${project.project.name}</h1>
    </div>
    <div class="row">      
       <h2>Version ${project.project.version}</h2>
    </div>
    <div class="row">
       <p>Created ${now()}</p>
    </div>
    <div class="metrics row">
       ${metrics(project)}
    </div>
    
       ${notes(project)}
    
    `;

    writeFileSync('output.html', html, 'utf8');
    write(`${project.project.name} scored ${project.score}%`);
}

function notes(project: ProjectResult) {
    let html = ''
    for (const key of Object.keys(project.metrics)) {
        if (project.metrics[key].notes.length > 0) {
            html += `
        <div class="notes">
           <h3>${key}</h3>
        </div>
        <div class="notes"><ul>`;
            for (const note of project.metrics[key].notes) {
                html += `<li>${note}</li>`;
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

function now() {
    return new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], {timeStyle: 'short'});
}

