import "./styles.css";
import { Logger } from "./logger.js";
import {
  fetchUserLocation,
  fetchWeatherByCity,
  fetchWeatherByCoordinates,
} from "./fetcher.js";
import { SearchLocationForm } from "./searcher.js";

// TODO: Switch to convert units
// Display data
// Style

const logger = new Logger();
logger.info("Start");

let unit = "metric";

const searchLocationForm = new SearchLocationForm(
  logger,
  fetchUserLocation,
  fetchWeatherByCity,
  fetchWeatherByCoordinates,
  unit
);



// fetchUserLocation()
//   .then((userLocation) => {
//     if (userLocation) {
//       const { city, latitude, longitude } = userLocation;
//       displayLocation(city);
//       return fetchWeatherByCoordinates(latitude, longitude);
//     } else {
//       throw new Error('No location data available');
//     }
//   })
//   .then(displayWeather);

// fetchWeatherByCity('Oslo', unit).then(displayWeather);
