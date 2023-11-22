
export function getArg(name: string, defaultValue: string): string {
    let next = false;
    for (const arg of process.argv) {
        if (arg == `--${name}`) {
            next = true;
        } else if (next) {
            return arg;
        }
    }
    return defaultValue;
}

export function hasArg(name: string): boolean {
    for (const arg of process.argv) {
        if (arg == `--${name}`) {
            return true;
        }
    }
    return false;
}