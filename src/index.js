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

// Set up the temp toggle switch
const toggleUnitSwitch = document.querySelector("input[name=checkbox]");
toggleUnitSwitch.addEventListener("change", () => {
  const newUnit = toggleUnitSwitch.checked ? "us" : "metric";
  searcher.setUnit(newUnit);
  logger.display(`Temperature is now in ${newUnit === "metric" ? "Cº" : "Fº"}`);
});


// Active weather range being displayed
const thirdRow = document.getElementById("third-row");

thirdRow.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-day]");
  if (!button) return;

  // Remove 'active' class from all buttons
  thirdRow.querySelectorAll("button[data-day]").forEach((btn) => {
    btn.classList.remove("active");
  });

  // Add 'active' class to the clicked button
  button.classList.add("active");

  searcher.currentlyActive = parseInt(button.getAttribute("data-day"));

  // Display this data with Displayer
  searcher.displayer.displayRanged(searcher.weatherData, searcher.currentlyActive);
});
