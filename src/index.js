import './styles.css';
import { Logger } from './logger.js';
import { Searcher } from './searcher.js';
import { Displayer } from './displayer.js';
import {
  fetchUserLocation,
  fetchWeatherByCity,
  fetchWeatherByCoordinates,
} from './fetcher.js';
import { addDays, format } from 'date-fns';

// Time
// Display data
// Style

const logger = new Logger();
let unit = 'metric'
const displayer = new Displayer(logger, unit);

logger.info('Start');
// Set up the search box
const searcher = new Searcher(
  logger,
  fetchUserLocation,
  fetchWeatherByCity,
  fetchWeatherByCoordinates,
  displayer
);

// Set up the temp toggle switch
const toggleUnitSwitch = document.querySelector('input[name=checkbox]');
toggleUnitSwitch.addEventListener('change', () => {
  const newUnit = toggleUnitSwitch.checked ? 'us' : 'metric';
  searcher.setUnit(newUnit);
  logger.display(`Temperature is now in ${newUnit === 'metric' ? 'Cº' : 'Fº'}`);
});

