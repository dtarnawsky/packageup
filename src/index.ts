#!/usr/bin/env node
import { writeFileSync } from "fs";
import { analyze } from "./analyze";
import { getArg } from "./args";
import { ProjectInfo, inspect } from "./inspect";
import { write } from "./log";
import { ReportOutputType, report } from "./report";
import { postProject } from "./post";
import { IonicRuleSet } from "./analyze-ionic-rules";
import { join } from "path"

(async () => {
    const path = getArg('path', '.');
    const project = await inspect(path);
    let message = '';
    if (project) {
        const type = getArg('type', 'txt');
        switch (type) {
            case 'email': await postProject(project); break;
            case 'html': message = await reportAs(project, 'html', join(path, 'package-health.html')); break;
            case 'md': message = await reportAs(project, 'md', join(path, 'package-health.md')); break;
            case 'txt': await reportAs(project, 'txt', join(path, 'package-health.txt')); break;
        }
        if (message !== '') {
            write(message);
        }
    }
})();

async function reportAs(project: ProjectInfo, type: ReportOutputType, filename: string): Promise<string> {
    const projectResults = await analyze(project, IonicRuleSet);
    if (projectResults) {
        const data = await report(projectResults, { type });
        if (type !== 'txt') {
            writeFileSync(filename, data, 'utf8');
            projectResults.filename = filename;
        }
    }
    return `Your project "${project.name}" v${project.version} scored ${projectResults.score}%. Results written to ${projectResults.filename}.`;
}