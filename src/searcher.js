import { WeatherData } from "./weather-data.js";

export class Searcher {
  constructor(
    logger,
    fetchUserLocation,
    fetchWeatherByCity,
    fetchWeatherByCoordinates,
    displayer
  ) {
    this.logger = logger;
    this.fetchUserLocation = fetchUserLocation;
    this.fetchWeatherByCity = fetchWeatherByCity;
    this.fetchWeatherByCoordinates = fetchWeatherByCoordinates;
    this.displayer = displayer;
    this.weatherData = null;

    this.searchForm = document.getElementById("search-form");
    this.searchInput = document.getElementById("search-input");
    this.searchNearbyBtn = document.getElementById("search-nearby-btn");
    // Regular expression to check if the search input is in latitude,longitude format
    this.coordinatesRegex = /^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/;

    this.currentlyActive = 0;

    this.initialize();
  }

  setUnit(unit) {
    this.displayer.setUnit(unit, this.weatherData);
  }

  initialize() {
    this.searchInput.addEventListener("click", () => {
      this.searchNearbyBtn.classList.add("active");
    });
    // Remove search nearby button when not searching
    this.searchInput.addEventListener("blur", () => {
      this.searchNearbyBtn.classList.remove("active");
    });
    // Without this you can't click the search nearby button before it disappears
    this.searchNearbyBtn.addEventListener("mousedown", (e) => {
      e.preventDefault();
    });

    this.searchNearbyBtn.addEventListener("click", () => {
      this.searchNearby();
      this.searchNearbyBtn.classList.remove("active");
    });

    this.searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleSearch();
    });
  }

  handleSearch(manualInput = "") {
    if (manualInput) {
      if (this.coordinatesRegex.test(manualInput)) {
        const [latitude, longitude] = manualInput
          .split(",")
          .map((x) => x.trim());
        this.fetchWeatherByCoordinates(
          latitude,
          longitude,
          this.displayer.unit
        ).then((weather) => this.displayData(weather));
      } else {
        const formattedInput = this.formatSearchCity(manualInput);
        this.fetchWeatherByCity(formattedInput, this.displayer.unit).then(
          (weather) => this.displayData(weather)
        );
      }
    } else {
      const input = this.searchInput.value;
      this.logger.info("Search submitted");

      if (this.coordinatesRegex.test(input)) {
        const [latitude, longitude] = input.split(",").map((x) => x.trim());
        this.fetchWeatherByCoordinates(
          latitude,
          longitude,
          this.displayer.unit
        ).then((weather) => this.displayData(weather));
      } else {
        const formattedInput = this.formatSearchCity(input);
        this.fetchWeatherByCity(formattedInput, this.displayer.unit).then(
          (weather) => this.displayData(weather)
        );
      }

      this.searchInput.value = "";
    }
  }

  searchNearby() {
    this.logger.info("Searching nearby");
    this.fetchUserLocation()
      .then((userLocation) => {
        if (userLocation) {
          return this.fetchWeatherByCity(
            userLocation.city,
            this.displayer.unit
          );
        } else {
          throw new Error("No location data available");
        }
      })
      .then((weather) => this.displayData(weather));
  }

  formatSearchCity(input) {
    return input.replaceAll(" ", "%20").replaceAll(",", "%2C");
  }

  displayData(rawData) {
    if (!rawData) {
      console.error("Weather data is undefined");
      return;
    }

    this.weatherData = new WeatherData(rawData);
    this.logger.info("Updating location info");
    this.displayer.displayLocation(this.weatherData.getLocation());
    this.logger.info("Updating weather info");
    this.displayer.displayToday(this.weatherData);
    this.displayer.displayNextDays(this.weatherData);
    this.displayer.displayRanged(this.weatherData, this.currentlyActive);
  }

  updateRangedDisplay() {
    this.logger.info("Updating weather info");
    this.displayer.displayRanged(this.weatherData, this.currentlyActive);
  }
}
