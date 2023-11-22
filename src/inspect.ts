import { hasArg } from "./args";
import { verbose, write } from "./log";
import { getAsJson } from "./utilities";

export async function inspect(folder: string) {
    verbose(`Inspecting "${folder}"...`);    
    const npmOutdated = await getAsJson(`npm outdated --json`, folder);
    const npmList = await getAsJson(`npm list --json`, folder);

    verbose(`Found "${npmList.name}" v${npmList.version}`);
    const packages: Record<string, PackageInfo> = {};
    for (const key of Object.keys(npmList.dependencies)) {
        const dep: ListDependency = npmList.dependencies[key];
        // dep.resolved contains the url to the package. Eg: https://registry.npmjs.org/zone.js/-/zone.js-0.14.2.tgz
        const packageInfo: PackageInfo = { current: dep.version, latest: dep.version };
        packages[key] = packageInfo;
    }
    for (const key of Object.keys(npmOutdated)) {
        const lib: OutdatedPackage = npmOutdated[key];
        packages[key].latest = lib.latest;
    }
    if (hasArg('verbose')) {
        verbose(JSON.stringify(packages));
    }
    write(`Project "${npmList.name}" v${npmList.version} has ${Object.keys(packages).length} packages.`);
}

interface PackageInfo {
    current: string; // eg 2.6.2
    latest: string; // eg 3.0.0
}

// This is for npm outdated --json
interface OutdatedPackage {
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