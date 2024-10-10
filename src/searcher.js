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

    this.searchForm = document.getElementById("search-form");
    this.searchInput = document.getElementById("search-input");
    this.searchNearbyBtn = document.getElementById("search-nearby-btn");
    // Regular expression to check if the search input is in latitude,longitude format
    this.coordinatesRegex = /^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/;

    this.initialize();
  }

  setUnit(unit) {
    this.displayer.setUnit(unit);
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
      this.logger.info("Searching nearby");
      this.fetchUserLocation()
        .then((userLocation) => {
          if (userLocation) {
            const { city, latitude, longitude } = userLocation;
            return this.fetchWeatherByCoordinates(
              latitude,
              longitude,
              this.unit
            );
          } else {
            throw new Error("No location data available");
          }
        })
        .then((weather) => this.displayData(weather));
      this.searchNearbyBtn.classList.remove("active");
    });

    this.searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleSearch();
    });
  }

  handleSearch() {
    const input = this.searchInput.value;
    this.logger.info("Search submitted");

    if (this.coordinatesRegex.test(input)) {
      const [latitude, longitude] = input.split(",").map((x) => x.trim());
      this.fetchWeatherByCoordinates(latitude, longitude, this.displayer.unit).then(
        (weather) => this.displayData(weather)
      );
    } else {
      const formattedInput = this.formatSearchCity(input);
      this.fetchWeatherByCity(formattedInput, this.displayer.unit).then(
        (weather) => this.displayData(weather)
      );
    }

    this.searchInput.value = "";
  }

  formatSearchCity(input) {
    return input.replaceAll(" ", "%20").replaceAll(",", "%2C");
  }

  displayData(weather) {
    this.displayer.displayLocation(weather.resolvedAddress.trimStart());
    this.displayer.displayToday(weather);
    this.displayer.displayTodayRanged(weather);
    this.displayer.displayNextDays(weather);
  }
}
