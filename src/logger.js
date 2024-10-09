export class Logger {
  constructor() {
    this.startTime = Date.now();
  }

  timePassed() {
    const millis = Date.now() - this.startTime;
    return Math.floor(millis / 1000);
  }

  // For debugging purposes
  info(string) {
    console.log(`%c ${this.timePassed()}s: ${string}`, 'font-weight: bold; color: #196060;');
  }
  // For data that would be displayed on the screen
  display(string) {
    console.log(`%c ${this.timePassed()}s: ${string}`, 'font-weight: bold; color: #fb5607;');
  }
}