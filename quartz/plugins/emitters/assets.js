import { joinSegments, slugifyFilePath } from "../../util/path";
import path from "path";
import fs from "fs";
import { glob } from "../../util/glob";
import DepGraph from "../../depgraph";
const filesToCopy = async (argv, cfg) => {
    // glob all non MD files in content folder and copy it over
    return await glob("**", argv.directory, ["**/*.md", ...cfg.configuration.ignorePatterns]);
};
export const Assets = () => {
    return {
        name: "Assets",
        getQuartzComponents() {
            return [];
        },
        async getDependencyGraph(ctx, _content, _resources) {
            const { argv, cfg } = ctx;
            const graph = new DepGraph();
            const fps = await filesToCopy(argv, cfg);
            for (const fp of fps) {
                const ext = path.extname(fp);
                const src = joinSegments(argv.directory, fp);
                const name = (slugifyFilePath(fp, true) + ext);
                const dest = joinSegments(argv.output, name);
                graph.addEdge(src, dest);
            }
            return graph;
        },
        async emit({ argv, cfg }, _content, _resources) {
            const assetsPath = argv.output;
            const fps = await filesToCopy(argv, cfg);
            const res = [];
            for (const fp of fps) {
                const ext = path.extname(fp);
                const src = joinSegments(argv.directory, fp);
                const name = (slugifyFilePath(fp, true) + ext);
                const dest = joinSegments(assetsPath, name);
                const dir = path.dirname(dest);
                await fs.promises.mkdir(dir, { recursive: true }); // ensure dir exists
                await fs.promises.copyFile(src, dest);
                res.push(dest);
            }
            return res;
        },
    };
};
