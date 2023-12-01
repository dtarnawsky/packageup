import { writeFileSync } from "fs";
import { analyze } from "./analyze";
import { getArg } from "./args";
import { ProjectInfo, inspect } from "./inspect";
import { write } from "./log";
import { ReportOutputType, report } from "./report";
import { postProject } from "./post";

(async () => {
    const project = await inspect(getArg('path', '.'));
    if (project) {
        const type = getArg('type', 'md');
        switch (type) {
            case 'email': await postProject(project); break;
            case 'html': await reportAs(project, 'html', 'package-health.html'); break;
            case 'md': await reportAs(project, 'md', 'package-health.md'); break;
        }
        write(`Project "${project.name}" v${project.version} (${project.remoteUrl}) has ${Object.keys(project.dependencies).length} dependencies.`);
    }
})();

async function reportAs(project: ProjectInfo, type: ReportOutputType, filename: string) {
    const projectResults = await analyze(project);
    if (projectResults) {
        const data = await report(projectResults, { type });
        writeFileSync(filename, data, 'utf8');
    }
}