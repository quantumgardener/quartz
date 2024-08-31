import path from "path";
import fs from "fs";
import { joinSegments } from "../../util/path";
export const write = async ({ ctx, slug, ext, content }) => {
    const pathToPage = joinSegments(ctx.argv.output, slug + ext);
    const dir = path.dirname(pathToPage);
    await fs.promises.mkdir(dir, { recursive: true });
    await fs.promises.writeFile(pathToPage, content);
    return pathToPage;
};
