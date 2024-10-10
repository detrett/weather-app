import { format, addDays } from "date-fns";

export class Displayer {
  constructor(logger, unit = "metric", extraDays = 4) {
    this.logger = logger;
    this.unit = unit;
    this.extraDays = extraDays;

    this.today = new Date();
    this.nextDays = Array.from({ length: this.extraDays }, (_, i) =>
      addDays(this.today, i + 1)
    );
    this.timeRanges = ["0-6", "6-12", "12-18", "18-23"];
  }

  setUnit(unit) {
    this.unit = unit;
  }

  roundTemp(temp) {
    return Math.round(temp);
  }

  calcAverageTemp(weather, range) {
    // Calculate the start and end hour based on the range
    const [start, end] = range.split("-").map(Number);
    const rangeData = weather.days[0].hours.slice(start, end);

    const totalTemp = rangeData.reduce((sum, entry) => sum + entry.temp, 0);
    return this.roundTemp(totalTemp / rangeData.length);
  }

  calcAverageCondition(weather, range) {
    const [start, end] = range.split("-").map(Number);
    const rangeData = weather.days[0].hours.slice(start, end);
    const conditionCount = {};

    // Loop through the range data to count conditions
    rangeData.forEach((data) => {
      const condition = data.conditions;

      // Increment the count for the current condition
      if (conditionCount[condition]) {
        conditionCount[condition]++;
      } else {
        conditionCount[condition] = 1;
      }
    });

    // Find the condition with the highest count
    let maxCount = 0;
    let predominantCondition = "";

    for (const [condition, count] of Object.entries(conditionCount)) {
      if (count > maxCount) {
        maxCount = count;
        predominantCondition = condition;
      }
    }

    return predominantCondition || 'No data';
  }

  displayToday(weather) {
    this.logger.display(format(this.today, "eeee"));

    const temp = this.roundTemp(weather.currentConditions.temp);
    this.displayTemperature(temp);

    const conditions = weather.currentConditions;
    this.displayConditions(conditions);

    this.displayIcon(conditions.conditions);
  }

  displayTodayRanged(weather) {
    for (let i = 0; i < this.timeRanges.length; i++) {
      const range = this.timeRanges[i];
      this.logger.display(range, "darkgreen");

      const avgTemp = this.calcAverageTemp(weather, range);
      this.displayTemperature(avgTemp);

      const avgCondition = this.calcAverageCondition(weather, range);
      this.displayIcon(avgCondition);
    }
  }

  displayNextDays(weather) {
    this.nextDays.forEach((day, index) => {
      this.logger.display(format(day, "eee"));

      const temp = this.roundTemp(weather.days[index + 1].temp);
      this.displayTemperature(temp);

      const condition = weather.days[index + 1].conditions;
      this.displayIcon(condition);
    });
  }

  displayLocation(city) {
    this.logger.display(city, "DarkMagenta");
  }

  displayTemperature(temp) {
    const tempUnit = this.unit === "metric" ? "Cº" : "Fº";
    this.logger.display(`${temp} ${tempUnit}`, "Indigo");
  }

  displayConditions(conditions) {
    this.logger.display(conditions.conditions, "DarkSlateBlue");
    const precipUnit = this.unit === "metric" ? "mm" : "in";
    this.logger.display(
      `Precip. ${precipUnit}: ${conditions.precip}`,
      "DarkSlateBlue"
    );
    this.logger.display(`UV Index: ${conditions.uvindex}`, "DarkSlateBlue");
    const windSpeedUnit = this.unit === "metric" ? "m/s" : "mph";
    this.logger.display(
      `Wind (Gust) ${windSpeedUnit}: ${Math.round(
        conditions.windspeed
      )}(${Math.round(conditions.windgust)})`,
      "DarkSlateBlue"
    );
  }

  displayIcon(conditions) {
    const condition = conditions.split(',')[0];
    this.logger.display(`Icon for ${condition}`, "Crimson");
  }
}
