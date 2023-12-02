import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

export function install(path: string): boolean {
    const filename = join(path, 'package.json');
    if (!existsSync(filename)) return false;
    const json = readFileSync(filename, 'utf8');
    const packages = JSON.parse(json);
    let changed = false;
    if (!packages.scripts) return false;
    if (!packages.scripts.postinstall) {
        packages.scripts.postinstall = 'npx pkup';
        changed = true;
    } else {
        if (!packages.scripts.postinstall.includes('pkup')) {
            packages.scripts.postinstall = packages.scripts.postinstall + '&& npx pkup';
            changed = true;
        }
    }
    if (changed) {
        writeFileSync(filename, JSON.stringify(packages, undefined, 2), 'utf8');
    }
    return true;
}