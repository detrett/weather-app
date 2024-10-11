export class WeatherData {
  constructor(weather) {
    this.weather = weather;
    this.currentConditions = weather.currentConditions || {};
    this.days = weather.days || [];
    this.temp = Math.round(this.currentConditions.temp);
    this.address = weather.resolvedAddress || weatherData.city || "Location not found";
  }

  getTemperature() {
    return this.temp;
  }

  convertCtoF(temp) {
    return Math.round((temp * 1.8) + 32);
  }

  convertFtoC(temp) {
    return Math.round((temp - 32) * 5 / 9);
  }

  getCondition() {
    return this.currentConditions.conditions.split(',')[0];
  }

  getLocation() {
    return this.address.trimStart();
  }

  getDayData(dayIndex) {
    return this.days[dayIndex] || null;
  }

  getIcon() {
    return this.currentConditions.icon;
  }

  getHourData(dayIndex, startHour, endHour) {
    return this.getDayData(dayIndex).hours.slice(startHour, endHour);
  }

  calculateAverageTemp(rangeData) {
    const totalTemp = rangeData.reduce((sum, entry) => sum + entry.temp, 0);
    return Math.round(totalTemp / rangeData.length);
  }

  calculatePredominantCondition(rangeData) {
    const conditionCount = {};

    rangeData.forEach((entry) => {
      const condition = entry.icon;
      conditionCount[condition] = (conditionCount[condition] || 0) + 1;
    });

    return Object.keys(conditionCount).reduce((a, b) =>
      conditionCount[a] > conditionCount[b] ? a : b
    );
  }
}