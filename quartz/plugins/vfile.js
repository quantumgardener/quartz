import { VFile } from "vfile";
export function defaultProcessedContent(vfileData) {
    const root = { type: "root", children: [] };
    const vfile = new VFile("");
    vfile.data = vfileData;
    return [root, vfile];
}
