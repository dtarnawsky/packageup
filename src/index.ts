import { getArg } from "./args";
import { inspect } from "./inspect";
import { write } from "./log";

// const greeting = getGreeting("John");
// console.log(greeting);

(async () => {
    const project = await inspect(getArg('path', '.'));
    if (project) {
        write(`Project "${project.name}" v${project.version} (${project.remoteUrl}) has ${Object.keys(project.dependencies).length} dependencies.`);
    }
})();