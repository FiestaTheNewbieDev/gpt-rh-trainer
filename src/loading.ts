export default class Loading {
    private interval;

    start(message: string) {
        let icon = '|';
        process.stdout.write(`${icon} ${message}`);
        this.interval = setInterval(() => {
            process.stdout.clearLine(0);
            process.stdout.cursorTo(0);
            process.stdout.write(`${icon} ${message}`);
            switch (icon) {
                case '|':
                    icon = '/';
                    break;
                case '/':
                    icon = '―';
                    break;
                case '―':
                    icon = '\\';
                    break;
                case '\\':
                    icon = '|';
                    break;
            }
        }, 100)
    }

    stop(message: string) {
        clearInterval(this.interval);
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        process.stdout.write(`${message}\n`);
    }
}