import { format, addDays } from "date-fns";

export class Displayer {
  constructor(logger, unit = "metric", extraDays = 5) {
    this.logger = logger;
    this.unit = unit;
    this.extraDays = extraDays;

    this.today = new Date();
    this.timeRanges = [
      "0-3",
      "3-6",
      "6-9",
      "9-12",
      "12-15",
      "15-18",
      "18-21",
      "21-23",
    ];
  }

  setUnit(unit) {
    this.unit = unit;
  }

  displayToday(weatherData) {
    this.logger.display(format(this.today, "eeee"));

    const temp = weatherData.getTemperature();
    this.displayTemperature(temp);

    const conditions = weatherData.getCondition();
    this.displayConditions(conditions, weatherData.currentConditions);

    this.displayIcon(conditions);
  }

  displayRanged(weatherData, dayIndex = 0) {
    for (let range of this.timeRanges) {
      const [start, end] = range.split('-').map(Number);
      const rangeData = weatherData.getHourData(dayIndex, start, end);
  
      this.logger.display(range, 'darkgreen');
  
      const avgTemp = weatherData.calculateAverageTemp(rangeData);
      this.displayTemperature(avgTemp);
  
      const avgCondition = weatherData.calculatePredominantCondition(rangeData);
      this.displayIcon(avgCondition);
    }
  }

  displayNextDays(weatherData) {
    const futureDates = Array.from({ length: this.extraDays }, (_, i) =>
      format(addDays(this.today, i + 1), "eee")
    );

    futureDates.forEach((dayName, index) => {
      this.logger.display(dayName);

      const dayData = weatherData.getDayData(index + 1);
      if (dayData) {
        const temp = Math.round(dayData.temp);
        this.displayTemperature(temp);

        const condition = dayData.conditions;
        this.displayIcon(condition);
      } else {
        this.logger.display("No data available", "Gray");
      }
    });
  }

  displayLocation(location) {
    this.logger.display(location, "DarkMagenta");
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
    const condition = conditions.split(",")[0];
    this.logger.display(`Icon for ${condition}`, "Crimson");
  }
}
