import { Spinner } from "cli-spinner";
export class QuartzLogger {
    verbose;
    spinner;
    constructor(verbose) {
        this.verbose = verbose;
    }
    start(text) {
        if (this.verbose) {
            console.log(text);
        }
        else {
            this.spinner = new Spinner(`%s ${text}`);
            this.spinner.setSpinnerString(18);
            this.spinner.start();
        }
    }
    end(text) {
        if (!this.verbose) {
            this.spinner.stop(true);
        }
        if (text) {
            console.log(text);
        }
    }
}
