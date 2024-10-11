import "./styles.css";
import { Logger } from "./logger.js";
import { Searcher } from "./searcher.js";
import { Displayer } from "./displayer.js";
import {
  fetchUserLocation,
  fetchWeatherByCity,
  fetchWeatherByCoordinates,
} from "./fetcher.js";
import { addDays, format } from "date-fns";

const logger = new Logger();
let unit = "metric";
const displayer = new Displayer(logger, unit);

logger.info("Start");
// Set up the search box
const searcher = new Searcher(
  logger,
  fetchUserLocation,
  fetchWeatherByCity,
  fetchWeatherByCoordinates,
  displayer
);

searcher.currentlyActive = 0;
searcher.handleSearch("Oslo");
// searcher.searchNearby();

// Set up the temp toggle switch
const toggleUnitSwitch = document.querySelector("input[name=checkbox]");
toggleUnitSwitch.addEventListener("change", () => {
  const newUnit = toggleUnitSwitch.checked ? "us" : "metric";

  searcher.convertTemperatures(newUnit);

  logger.display(`Current unit: ${newUnit}`);
});

// Active weather range being displayed
const thirdRow = document.getElementById("third-row");
const buttons = thirdRow.querySelectorAll(".info-day-column");

thirdRow.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-day]");
  if (!button) return;

  // Remove 'active' class from all buttons
  buttons.forEach((btn) => btn.classList.remove("active"));

  // Add 'active' class to the clicked button
  button.classList.add("active");

  searcher.currentlyActive = parseInt(button.getAttribute("data-day"));
  const buttonWidth = 100 / buttons.length;

  thirdRow.style.setProperty(
    "--indicator-position",
    `${searcher.currentlyActive * buttonWidth}%`
  );
  // Display this data with Displayer
  searcher.updateRangedDisplay(
    searcher.weatherData,
    searcher.currentlyActive
  );
});

// Ensure the border starts at the first day
window.addEventListener("load", () => {
  document.documentElement.style.setProperty("--indicator-position", "0px");
});
