import { hasArg } from "./args";

export function writeError(message: string) {
    console.error(message);
}

export function verbose(message: string) {
    if (hasArg('verbose')) {
        console.info(message);
    }
}

export function write(message: string) {
    console.info(message);
}