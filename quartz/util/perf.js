import chalk from "chalk";
import pretty from "pretty-time";
export class PerfTimer {
    evts;
    constructor() {
        this.evts = {};
        this.addEvent("start");
    }
    addEvent(evtName) {
        this.evts[evtName] = process.hrtime();
    }
    timeSince(evtName) {
        return chalk.yellow(pretty(process.hrtime(this.evts[evtName ?? "start"])));
    }
}
