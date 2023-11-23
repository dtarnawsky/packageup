import { analyze } from "./analyze";
import { getArg } from "./args";
import { inspect } from "./inspect";
import { write } from "./log";
import { report } from "./report";

(async () => {
    const project = await inspect(getArg('path', '.'));
    if (project) {
        write(`Project "${project.name}" v${project.version} (${project.remoteUrl}) has ${Object.keys(project.dependencies).length} dependencies.`);
        const projectResults = await analyze(project);
        if (projectResults) {
            report(projectResults, { type: 'html' });
        }
    }
})();