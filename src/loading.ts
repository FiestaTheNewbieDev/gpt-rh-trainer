export default class Loading {
    private interval;

    start(message: string) {
        let points = '   ';
        process.stdout.write(points + message);
        this.interval = setInterval(() => {
            let points = '   ';
            process.stdout.clearLine(0);
            process.stdout.cursorTo(0);
            process.stdout.write(points + message);
            if (points === '   ') points = '.  ';
            else if (points === '.  ') points = '.. ';
            else if (points === '.. ') points = '...';
            else if (points === '...') points = '   ';
        }, 500)
    }

    stop(message: string) {
        clearInterval(this.interval);
        process.stdout.write(message);
    }
}