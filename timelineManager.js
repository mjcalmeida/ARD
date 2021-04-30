const timelineJobs = require("./public/js/cron/timelimeJobs");

class timelineManager{
    constructor(){
        this.jobs = [
            timelineJobs
        ]
    }

    run(){
        this.jobs.forEach(job => job.start())
    }
}

module.exports = new timelineManager();