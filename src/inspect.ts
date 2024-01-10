import { join } from "path";
import { hasArg } from "./args";
import { verbose, writeError } from "./log";
import { daysAgo, getAsJson, getAsString, timePeriod } from "./utilities";
import { existsSync, readFileSync, readdirSync } from "fs";
import { audit } from "./audit";
import { getNpmInfo } from "./npm-info";

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


    const securityIssues = await audit(folder, Object.keys(npmList.dependencies));

    verbose(`Found "${npmList.name}" v${npmList.version}`);
    const dependencies: Record<string, DependencyInfo> = {};
    for (const key of Object.keys(npmList.dependencies)) {
        const dep: ListDependency = npmList.dependencies[key];
        verbose(`Inspecting ${key}`);
        const npmInfo = await getNpmInfo(key, false);
        let issue: Issue | undefined;
        // example: released = 2016-03-17T15:16:31.913Z
        //const released = npmInfo.time[dep.version];
        if (npmInfo) {
            const keys = Object.keys(npmInfo.time);
            const modified = npmInfo.time[keys[keys.length - 1]];
            let lastReleased = 0;
            lastReleased = daysAgo(new Date(modified));

            

            if (lastReleased > 365) {
                issue = { type: 'maintenance', title: `${timePeriod(lastReleased)} since last release`, severity: 'critical' };
            } else if (lastReleased > 180) {
                issue = { type: 'potentialUnmaintained', title: `${timePeriod(lastReleased)} since last release`, severity: 'moderate' };
            }
        }

        // dep.resolved contains the url to the package. Eg: https://registry.npmjs.org/zone.js/-/zone.js-0.14.2.tgz
        const packageInfo: DependencyInfo = {
            name: key, current: dep.version, latest: dep.version,
            pluginType: getPluginType(key, folder),
            security: securityIssues?.find(a => a.name == key),
            issue
        };
        if (!dep.extraneous) {
            dependencies[key] = packageInfo;
        }
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
        dependencies,
        securityAuditFailed: (securityIssues == undefined)
    };
}

function getPluginType(library: string, folder: string): PluginType {
    let result: PluginType = 'Dependency';
    const plugin = join(folder, 'node_modules', library, 'plugin.xml');
    if (existsSync(plugin)) {
        // Cordova based
        result = 'Cordova';
    }

    const nmFolder = join(folder, 'node_modules', library);

    let isPlugin = false;

    if (existsSync(nmFolder)) {
        isPlugin = markIfPlugin(nmFolder);
        try {
            readdirSync(nmFolder, { withFileTypes: true })
                .filter((dirent) => dirent.isDirectory())
                .map((dirent) => {
                    const hasPlugin = markIfPlugin(join(nmFolder, dirent.name));
                    if (hasPlugin) {
                        isPlugin = true;
                    }
                });
        } catch {
            isPlugin = false;
        }
    }

    // Look for capacitor only as well
    if (isPlugin) {
        result = 'Capacitor';
    }
    return result;
}

function markIfPlugin(folder: string): boolean {
    const pkg = join(folder, 'package.json');
    if (existsSync(pkg)) {
        try {
            const packages = JSON.parse(readFileSync(pkg, 'utf8'));
            if (packages.capacitor?.ios || packages.capacitor?.android) {
                return true;
            }
        } catch {
            console.warn(`Unable to parse ${pkg}`);
            return false;
        }
    }
    return false;
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
    securityAuditFailed: boolean;
}
export interface DependencyInfo {
    name: string;
    current: string; // eg 2.6.2
    latest: string; // eg 3.0.0
    pluginType: PluginType;
    security: SecurityVulnerability | undefined;
    issue: Issue | undefined
}

export interface Issue {
    title: string;
    type: IssueType;
    severity: string;
}

export type IssueType = 'maintenance' | 'deprecated' | 'potentialUnmaintained';

export interface SecurityVulnerability {
    name: string;
    severity: string;
    url: string;
    title: string;
}

export type PluginType = 'Dependency' | 'Capacitor' | 'Cordova';

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
    extraneous: boolean;
}