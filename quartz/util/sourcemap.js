import fs from "fs";
import { fileURLToPath } from "url";
export const options = {
    // source map hack to get around query param
    // import cache busting
    retrieveSourceMap(source) {
        if (source.includes(".quartz-cache")) {
            let realSource = fileURLToPath(source.split("?", 2)[0] + ".map");
            return {
                map: fs.readFileSync(realSource, "utf8"),
            };
        }
        else {
            return null;
        }
    },
};
