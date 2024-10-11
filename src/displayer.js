import { format, addDays } from "date-fns";

export class Displayer {
  constructor(logger, unit = "metric", extraDays = 5) {
    this.logger = logger;
    this.unit = unit;
    this.extraDays = extraDays;
    this.convertTemp = false;

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

  setUnit(unit, weatherData = null) {
    this.unit = unit;

    this.convertTemperatures(weatherData);
  }

  convertTemperatures(weatherData) {
    this.convertTemp = true;

    if (weatherData) {
      this.displayToday(weatherData);
      this.displayNextDays(weatherData);
      this.displayRanged(weatherData);

      this.convertTemp = false;
    }
  }

  displayToday(weatherData) {
    const tempElement = document.getElementById("main-temp");
    let temp = weatherData.getTemperature();

    if (this.convertTemp === true) {
      temp =
        this.unit === "metric"
          ? weatherData.convertFtoC(temp)
          : weatherData.convertCtoF(temp);
    }

    this.displayTemperature(tempElement, temp);

    const condition = weatherData.getCondition();
    this.displayConditions(condition, weatherData.currentConditions);

    const iconElement = document.getElementById("main-weather-icon");
    const iconName = weatherData.getIcon();
    this.displayIcon(iconElement, iconName);
  }

  displayNextDays(weatherData) {
    const futureDates = Array.from({ length: this.extraDays }, (_, i) =>
      format(addDays(this.today, i), "eee")
    );

    futureDates.forEach((dayName, index) => {
      const dayNameElement = document.querySelector(
        `[data-day="${index}"] > span.day`
      );
      dayNameElement.textContent = dayName;

      const dayData = weatherData.getDayData(index + 1);
      if (dayData) {
        const tempElement = document.querySelector(
          `[data-day="${index}"] span.temp`
        );
        let temp = Math.round(dayData.temp);

        if (this.convertTemp === true) {
          temp =
            this.unit === "metric"
              ? weatherData.convertFtoC(temp)
              : weatherData.convertCtoF(temp);
        }

        this.displayTemperature(tempElement, temp);

        const iconElement = document.querySelector(
          `[data-day="${index}"] span.icon`
        );
        const iconName = dayData.icon;
        this.displayIcon(iconElement, iconName);
      } else {
        this.logger.info("No data available", "Gray");
      }
    });
  }

  displayRanged(weatherData, dayIndex = 0) {
    let index = 0;
    for (let range of this.timeRanges) {
      const [start, end] = range.split("-").map(Number);
      const rangeData = weatherData.getHourData(dayIndex, start, end);

      const tempElement = document.querySelector(
        `[data-range="${index}"] span.temp`
      );
      let avgTemp = weatherData.calculateAverageTemp(rangeData);

      if (this.convertTemp === true) {
        avgTemp =
          this.unit === "metric"
            ? weatherData.convertFtoC(avgTemp)
            : weatherData.convertCtoF(avgTemp);
      }

      this.displayTemperature(tempElement, avgTemp);

      const iconName = weatherData.calculatePredominantCondition(rangeData);
      const iconElement = document.querySelector(
        `[data-range="${index}"] span.icon`
      );
      this.displayIcon(iconElement, iconName);

      index++;
    }
  }

  displayLocation(location) {
    const locationElement = document.getElementById("location");
    locationElement.textContent = location;
  }

  displayTemperature(element, temp) {
    const tempUnit = this.unit === "metric" ? "Cº" : "Fº";
    element.textContent = `${temp} ${tempUnit}`;
  }

  displayConditions(condition, conditions) {
    const mainConditionElement = document.getElementById(
      "main-weather-condition"
    );
    mainConditionElement.textContent = condition;

    const precipElement = document.querySelector('[data-target="precip"]');
    const precipUnit = this.unit === "metric" ? "mm" : "in";
    precipElement.textContent = `Precip. ${precipUnit}: ${conditions.precip}`;

    const uvIndexElement = document.querySelector('[data-target="uvindex"]');
    uvIndexElement.textContent = `UV Index: ${conditions.uvindex}`;

    const windElement = document.querySelector('[data-target="wind"]');
    const windSpeedUnit = this.unit === "metric" ? "m/s" : "mph";
    windElement.textContent = `Wind (Gust) ${windSpeedUnit}: ${Math.round(
      conditions.windspeed
    )}(${Math.round(conditions.windgust)})`;
  }

  displayIcon(iconElement, iconName) {
    iconElement.className = `icon ${iconName}`;
  }
}
