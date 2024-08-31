import path from "path";
import { globby } from "globby";
export function toPosixPath(fp) {
    return fp.split(path.sep).join("/");
}
export async function glob(pattern, cwd, ignorePatterns) {
    const fps = (await globby(pattern, {
        cwd,
        ignore: ignorePatterns,
        gitignore: true,
    })).map(toPosixPath);
    return fps;
}
