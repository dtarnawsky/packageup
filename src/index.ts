import { writeFileSync } from "fs";
import { analyze } from "./analyze";
import { getArg } from "./args";
import { inspect } from "./inspect";
import { write } from "./log";
import { report } from "./report";
import { postProject } from "./post";

(async () => {
    const project = await inspect(getArg('path', '.'));
    if (project) {
        const isHtmlOutput = (getArg('html', 'x') !== 'x');
        if (isHtmlOutput) {
            const projectResults = await analyze(project);
            if (projectResults) {
                const html = await report(projectResults, { type: 'html' });
                writeFileSync('output.html', html, 'utf8');
            }
        } else {
            await postProject(project);
        }
        write(`Project "${project.name}" v${project.version} (${project.remoteUrl}) has ${Object.keys(project.dependencies).length} dependencies.`);
    }
})();