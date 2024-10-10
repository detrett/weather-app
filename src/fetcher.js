import { Logger } from "./logger.js";

const logger = new Logger();

const ipstackAccessKey = "efb68c0b839d08c4eea31d47271a3dbe";
const weatherAccessKey = "RZQHQRQUZ9NVY77XFMB6C5H9W";

export async function fetchUserLocation() {
  try {
    logger.info("Fetching location data");

    const url = `http://api.ipstack.com/check?access_key=${ipstackAccessKey}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status ${response.status}`);
    }

    const json = await response.json();
    console.log(json);
    return json;
  } catch (error) {
    console.error(error.message);
  }
}

export async function fetchWeatherByCoordinates(latitude, longitude, unit) {
  try {
    logger.info("Fetching weather data by latitude and longitude");

    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/
    ${latitude}%2C${longitude}?unitGroup=${unit}&key=${weatherAccessKey}&contentType=json`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status ${response.status}`);
    }

    const json = await response.json();
    console.log(json);
    return json;
  } catch (error) {
    console.error(error.message);
  }
}

export async function fetchWeatherByCity(city, unit) {
  try {
    logger.info("Fetching weather data by city");

    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/
    ${city}?unitGroup=${unit}&key=${weatherAccessKey}&contentType=json`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status ${response.status}`);
    }

    const json = await response.json();
    console.log(json);
    return json;
  } catch (error) {
    console.error(error.message);
  }
}