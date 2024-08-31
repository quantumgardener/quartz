import { PerfTimer } from "../util/perf";
import { getStaticResourcesFromPlugins } from "../plugins";
import { QuartzLogger } from "../util/log";
import { trace } from "../util/trace";
export async function emitContent(ctx, content) {
    const { argv, cfg } = ctx;
    const perf = new PerfTimer();
    const log = new QuartzLogger(ctx.argv.verbose);
    log.start(`Emitting output files`);
    let emittedFiles = 0;
    const staticResources = getStaticResourcesFromPlugins(ctx);
    for (const emitter of cfg.plugins.emitters) {
        try {
            const emitted = await emitter.emit(ctx, content, staticResources);
            emittedFiles += emitted.length;
            if (ctx.argv.verbose) {
                for (const file of emitted) {
                    console.log(`[emit:${emitter.name}] ${file}`);
                }
            }
        }
        catch (err) {
            trace(`Failed to emit from plugin \`${emitter.name}\``, err);
        }
    }
    log.end(`Emitted ${emittedFiles} files to \`${argv.output}\` in ${perf.timeSince()}`);
}
