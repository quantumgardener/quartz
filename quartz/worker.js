import sourceMapSupport from "source-map-support";
sourceMapSupport.install(options);
import cfg from "../quartz.config";
import { createFileParser, createProcessor } from "./processors/parse";
import { options } from "./util/sourcemap";
// only called from worker thread
export async function parseFiles(buildId, argv, fps, allSlugs) {
    const ctx = {
        buildId,
        cfg,
        argv,
        allSlugs,
    };
    const processor = createProcessor(ctx);
    const parse = createFileParser(ctx, fps);
    return parse(processor);
}
