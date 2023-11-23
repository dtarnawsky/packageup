import { hasArg } from "./args";
import { verbose, writeError } from "./log";
import { getAsJson, getAsString } from "./utilities";

export async function inspect(folder: string): Promise<ProjectInfo | undefined> {
    verbose(`Inspecting "${folder}"...`);
    const npmOutdated = await getAsJson(`npm outdated --json`, folder);
    if (!npmOutdated) {
        writeError(`Unable to inspect "${folder}". "npm outdated" failed.`);
        return undefined;
    }

    const npmList = await getAsJson(`npm list --json`, folder);
    if (!npmList) {
        writeError(`Unable to inspect "${folder}". "npm list" failed.`);
        return undefined;
    }

    const remoteUrl = cleanUrl(await getAsString(`git config --get remote.origin.url`, folder));


    verbose(`Found "${npmList.name}" v${npmList.version}`);
    const dependencies: Record<string, DependencyInfo> = {};
    for (const key of Object.keys(npmList.dependencies)) {
        const dep: ListDependency = npmList.dependencies[key];
        // dep.resolved contains the url to the package. Eg: https://registry.npmjs.org/zone.js/-/zone.js-0.14.2.tgz
        const packageInfo: DependencyInfo = { current: dep.version, latest: dep.version };
        dependencies[key] = packageInfo;
    }
    for (const key of Object.keys(npmOutdated)) {
        const lib: OutdatedDependency = npmOutdated[key];
        dependencies[key].latest = lib.latest;
    }
    if (hasArg('verbose')) {
        verbose(JSON.stringify(dependencies));
    }

    return {
        name: npmList.name,
        version: npmList.version,
        remoteUrl,
        dependencies
    };
}

function cleanUrl(url: string | undefined) {
    try {
        if (!url) {
            return undefined;
        }
        return new URL(url.replace('\n', '')).toString();
    } catch {
        return undefined;
    }
}

export interface ProjectInfo {
    name: string;
    version: string;
    remoteUrl: string | undefined;
    dependencies: Record<string, DependencyInfo>;
}
interface DependencyInfo {
    current: string; // eg 2.6.2
    latest: string; // eg 3.0.0
}

// This is for npm outdated --json
interface OutdatedDependency {
    current: string;
    wanted: string;
    latest: string;
    dependent: string;
    location: string;
}

// Output of npm list --json dependencies
interface ListDependency {
    version: string;
    resolved: string; // Url eg https://registry.npmjs.org/@types/jest/-/jest-29.5.10.tgz
    overridden: boolean;
}