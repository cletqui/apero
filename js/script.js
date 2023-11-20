/* Global Constants */

const APERO_DATA_URL = "./data/apero.json";

const iconPath = "./icons/";
const getIconPath = (icon) => `${iconPath}${icon}.svg`;

const icons = {
  AFRICA: getIconPath("earth-africa"),
  AMERICAS: getIconPath("earth-americas"),
  ASIA: getIconPath("earth-asia"),
  BURGER: getIconPath("menu-burger"),
  CALENDAR_CLOCK: getIconPath("calendar-clock"),
  CLOCK: getIconPath("clock-five"),
  COMPRESS: getIconPath("compress"),
  CROSS: getIconPath("cross"),
  EASTER_EGG: getIconPath("easter-egg"),
  EUROPA: getIconPath("earth-europa"),
  EXCLAMATION: getIconPath("exclamation"),
  EXPAND: getIconPath("expand"),
  GLASS_CHEERS: getIconPath("glass-cheers"),
  HOURGLASS_END: getIconPath("hourglass-end"),
  HOURGLASS_START: getIconPath("hourglass-start"),
  INTERROGATION: getIconPath("interrogation"),
  MOON: getIconPath("moon"),
  PLANET: getIconPath("planet-ringed"),
  STOPWATCH: getIconPath("stopwatch"),
  SUN: getIconPath("sun"),
};

const SECONDS_INTERVAL = 1000;
const MINUTES_INTERVAL = 60000;

/* Global Variables */

let isDarkMode = true; // Boolean flag to determine whether the webpage is in dark mode
let languageFormat = "en-US"; // A string representing the preferred language format (e.g., "fr-FR" for French)
let apero = {}; // An empty object that will store apéro data in JSON format
let tooltipText = "Clique..."; // The default tooltip text to display over the time zones

// An object defining options for formatting the time on the clock
let timeOptions = {
  hour: "2-digit", // Display the hour in 2-digit format (e.g., 01 instead of 1)
  minute: "2-digit", // Display the minute in 2-digit format
  second: "2-digit", // Display the second in 2-digit format
  hour12: false, // Use 24-hour format (e.g., 14:30 instead of 2:30 PM)
};

// An object defining options for formatting the date on the clock
let dateTimeOptions = {
  weekday: "long", // Display the full weekday name (e.g., "Wednesday")
  year: "numeric", // Display the year (e.g., 2023)
  month: "long", // Display the full month name (e.g., "October")
  day: "numeric", // Display the day of the month (e.g., 7)
};

/* Display Functions */

/**
 * Toggles the specified class on the given element.
 *
 * @param {Element} element - The element on which to toggle the class.
 * @param {string} className - The class name to toggle.
 * @returns {boolean} - A boolean indicating whether the class was added (true) or removed (false) after the toggle.
 */
const toggleClass = (element, className) => element.classList.toggle(className);

/**
 * Updates the text content of the element with the specified ID.
 *
 * @param {string} elementId - The ID of the element to update.
 * @param {string} value - The new value to set as the text content.
 */
const updateElement = (elementId, value) =>
  (document.getElementById(elementId).textContent = value);

/**
 * Capitalizes the first letter of a string.
 *
 * @param {string} string - The string to capitalize.
 * @returns {string} - The string with the first letter capitalized.
 */
const capitalizeFirstLetter = (string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

/**
 * Toggles the visibility of the menu and updates the menu button icon accordingly.
 */
const showMenu = () => {
  const header = document.getElementById("header");
  const menuButton = document.getElementById("menu-icon");
  toggleClass(header, "menu-visible");
  menuButton.src = header.classList.contains("menu-visible")
    ? icons.CROSS
    : icons.BURGER;
};

/**
 * Initializes the theme based on the user's preferred color scheme.
 */
const initiateTheme = () => {
  const defaultTheme = window.matchMedia("(prefers-color-scheme: dark)");
  isDarkMode = defaultTheme.matches;
  document.querySelector("html").dataset.theme = `${
    isDarkMode ? "dark" : "light"
  }-theme`;
};

/**
 * Toggles the theme between dark and light mode and updates the theme icon and HTML dataset accordingly.
 */
const toggleTheme = () => {
  isDarkMode = !isDarkMode;
  document.getElementById("theme-icon").src = isDarkMode
    ? icons.SUN
    : icons.MOON;
  document.querySelector("html").dataset.theme = `${
    isDarkMode ? "dark" : "light"
  }-theme`;
};

/**
 * Toggles the fullscreen mode and updates the fullscreen icon accordingly.
 */
const toggleFullScreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
  }
  document.getElementById("full-screen-icon").src = document.fullscreenElement
    ? icons.EXPAND
    : icons.COMPRESS;
};

/**
 * Toggles the display of seconds on the clock and updates the seconds icon accordingly.
 */
const toggleSeconds = () => {
  const showSeconds = document
    .getElementById("seconds-icon")
    .src.endsWith("stopwatch.svg");

  timeOptions.second = showSeconds ? "2-digit" : undefined;
  document.getElementById("seconds-icon").src = showSeconds
    ? icons.CLOCK
    : icons.STOPWATCH;

  // Update the clock to apply the change immediately
  updateClock();
};

/**
 * Toggles the time format between 12-hour and 24-hour and updates the clock display accordingly.
 */
const toggleTimeFormat = () => {
  timeOptions.hour12 = !timeOptions.hour12;

  // Update the clock display to apply the format change immediately
  updateClock();
};

/**
 * Toggles the language format between English and French and updates the clock and apéro display accordingly.
 */
const toggleLanguage = () => {
  languageFormat = languageFormat === "en-US" ? "fr-FR" : "en-US";

  // Update the clock and apéro displayed to apply the language change immediately
  updateClock();
  updateApero();
};

/**
 * Shows the apéro information for the specified zone and updates the appearance of the other apéro icon.
 *
 * @param {string} zone - The zone for which to show the apéro information ("local" or "world").
 */
const showApero = (zone) => {
  const aperoInfo = document.getElementById(`apero-${zone}`);
  const otherZone = zone === "local" ? "world" : "local";
  const otherAperoIcon = document.getElementById(`${otherZone}-icon`);

  // Show the apéro information by updating the class
  aperoInfo.classList.remove("apero-info-hidden");

  // Add the "unselected" class to the other apéro icon
  otherAperoIcon.classList.add("unselected");
};

/**
 * Hides the apéro information for the specified zone.
 *
 * @param {string} zone - The apéro zone to hide (local or world).
 */
const hideApero = (zone) => {
  const aperoInfo = document.getElementById(`apero-${zone}`);
  const otherZone = zone === "local" ? "world" : "local";
  const otherAperoIcon = document.getElementById(`${otherZone}-icon`);

  // Hide the apéro information by updating the class
  aperoInfo.classList.add("apero-info-hidden");

  // Remove the "unselected" class from the other apéro icon
  otherAperoIcon.classList.remove("unselected");
};

/**
 * Toggles the visibility of apéro information for the specified zone (local or world) and updates the apéro display accordingly.
 *
 * @param {HTMLElement[]} children - The child elements of a container element.
 */
const toggleApero = (children) => {
  const button = children[0].id;
  const [zone] = button.split("-");
  const targetApero = document.getElementById(`apero-${zone}`);
  const otherZone = zone === "local" ? "world" : "local";

  // Reset the tooltip text to its default value
  resetTooltipText();

  if (targetApero.className === "apero-info-hidden") {
    // Refresh apéro information for zone 'local' or 'world'
    updateApero(zone);

    // If currently hidden, hide other apéro information and show apéro information
    hideApero(otherZone);
    showApero(zone);
  } else {
    // If currently visible, hide apéro information
    hideApero(zone);
  }
};

/* Operating Functions */

/**
 * Updates the clock by displaying the current time, date, and user time zone.
 */
const updateClock = () => {
  const now = new Date();
  const { timeZone: userTimezone } = Intl.DateTimeFormat().resolvedOptions();

  updateElement("time", now.toLocaleTimeString(languageFormat, timeOptions));
  updateElement(
    "date",
    capitalizeFirstLetter(
      now.toLocaleDateString(languageFormat, dateTimeOptions)
    )
  );
  updateElement("time-zone", `(${userTimezone})`);
};

/**
 * Checks if the current time corresponds to the "Easter Egg" time of 4:20 AM or 4:20 PM.
 *
 * @returns {boolean} True if it's 4:20 AM or 4:20 PM, false otherwise.
 */
const isEasterEgg = () => {
  const now = new Date();
  return (
    (now.getHours() === 4 || now.getHours() === 16) && now.getMinutes() === 20
  );
};

/**
 * Generates an HTML link with the specified URL and display name.
 *
 * @param {string} link - The URL of the link.
 * @param {string} name - The display name of the link.
 * @returns {string} The HTML link element.
 */
const getLink = (link, name) => {
  return `<a href="${link}" target="_blank" rel="noopener noreferrer">${name}</a>`;
};

/**
 * Fetches the apéro data from the specified JSON file asynchronously.
 *
 * @returns {Promise<object>} - A promise that resolves to the fetched apéro data.
 * @throws {Error} - If there is an error fetching the apéro data or updating the HTML element with an error message.
 */
const fetchApero = async () => {
  try {
    const response = await fetch(APERO_DATA_URL); // Attempt to fetch apéro data from the specified JSON file
    const data = await response.json(); // Parse the response as JSON

    apero = data; // Assign the fetched data to the global 'apero' variable

    return data; // Return the fetched data
  } catch (error) {
    console.error(`Error fetching apero.json: ${error}`); // Log any errors that occur during the fetch process

    const errorMessage =
      languageFormat === "fr-FR"
        ? "Les informations pour l'apéro ne sont pas disponibles pour le moment."
        : "Apéro information not available at the moment.";

    // Handle the error gracefully by updating the HTML element with an error message
    const aperoLocalElement = document.getElementById("apero-local");
    if (aperoLocalElement) {
      aperoLocalElement.textContent = errorMessage;
    }
  }
};

/**
 * Retrieves the apéro data for the provided time zone.
 *
 * @param {string} timeZone - The time zone in "continent/city" format.
 * @returns {object} - The apéro data associated with the provided time zone.
 * @throws {Error} - If there is an error retrieving the apéro data or if the provided time zone is invalid or not found in the apéro data.
 */
const getTimeZoneInfo = (timeZone) => {
  try {
    const [continent, city] = timeZone.split("/");
    const timeZoneData = apero?.[continent]?.[city];

    if (timeZoneData) {
      return timeZoneData;
    }

    console.error(`No time zone ${timeZone} found in apéro data: ${error}`);

    const link = getLink(
      "https://github.com/cletqui/apero/#contributing",
      "GitHub"
    );
    const errorMessage =
      languageFormat === "fr-FR"
        ? `Aucun fuseau horaire ${timeZone} n'a été trouvé dans apero.json. Pour y ajouter ce fuseau horaire, proposez-la sur ${link}.`
        : `No time zone ${timeZone} found in apero.json. To add this time zone, submit it on ${link}.`;

    throw new Error(errorMessage);
  } catch (error) {
    console.error(`Invalid user time zone: ${timeZone}: ${error}`);

    const link = getLink("https://github.com/cletqui/apero/issues", "GitHub");
    const errorMessage =
      languageFormat === "fr-FR"
        ? `Votre fuseau horaire semble invalide. Vous pouvez signaler ce problème sur ${link}.`
        : `Your time zone appears to be invalid. You can report this issue to ${link}.`;

    throw new Error(errorMessage);
  }
};

/**
 * Retrieves the apéro information for the provided time zone.
 *
 * @param {string} timeZone - The time zone in "continent/city" format.
 * @returns {object} - The apéro information for the provided time zone.
 * @throws {Error} - If there is an error retrieving the apéro information or if the apéro info is not found for the provided time zone.
 */
const getAperoInfo = (timeZone) => {
  try {
    const timeZoneInfo = getTimeZoneInfo(timeZone);

    // Check if the retrieved apéro data contains the 'aperoInfo' field
    if (timeZoneInfo && timeZoneInfo.aperoInfo) {
      return timeZoneInfo.aperoInfo; // Return the apéro information if it exists
    } else {
      console.error(
        `Apéro info not found for ${timeZone} in apéro data: ${error}`
      );

      const link = getLink(
        "https://github.com/cletqui/apero/#contributing",
        "GitHub"
      );
      const errorMessage =
        languageFormat === "fr-FR"
          ? `Aucune information sur l'apéro à ${timeZone}. Vous pouvez contribuer au projet et ajouter ce fuseau horaire sur ${link}.`
          : `Apéro info not found for ${timeZone}. You can contribute to the project and add this time zone on ${link}.`;

      throw new Error(errorMessage);
    }
  } catch (error) {
    throw error; // Return the error thrown by getTimeZoneInfo function
  }
};

/**
 * Gets the current time in the specified time zone.
 *
 * @param {string} timeZone - The time zone in "continent/city" format.
 * @returns {string} - The current time in the specified time zone.
 * @throws {Error} - If there is an error getting the time in the specified time zone.
 */
const getTimezoneTime = (timeZone) => {
  try {
    const timeZoneOptions = {
      ...timeOptions, // Default time options
      timeZone: timeZone,
      timeZoneName: "short",
    };

    // Get the current time in the specified time zone
    return new Date().toLocaleTimeString(undefined, timeZoneOptions);
  } catch (error) {
    console.error(`Error getting time in ${timeZone}: ${error}`);

    const errorMessage =
      languageFormat === "fr-FR"
        ? `Impossible d'obtenir l'heure à ${timeZone}, réessayez plus tard.`
        : `Error getting time in ${timeZone}. Please try again.`;

    throw new Error(errorMessage);
  }
};

/**
 * Calculates the time difference between the provided apéro time and the current time in the given time zone.
 *
 * @param {string} aperoTime - The apéro time in "HH:mm" format.
 * @param {string} timeZone - The time zone in "continent/city" format.
 * @returns {number} - The time difference in hours between the apéro time and the current time in the given time zone.
 * @throws {Error} - If there is an error calculating the apéro time.
 */
const isAperoTime = (aperoTime, timeZone) => {
  try {
    const [aperoHour] = aperoTime.split(":").map(Number);
    const [timeZoneHour] = getTimezoneTime(timeZone).split(":").map(Number);

    return aperoHour - timeZoneHour;
  } catch (error) {
    console.error(`Error calculating apéro time: ${error}`);

    const errorMessage =
      languageFormat === "fr-FR"
        ? `Erreur lors du calcul de l'heure, réessayez plus tard.`
        : `Error calculating apéro time. Please try again.`;

    throw new Error(errorMessage);
  }
};

/**
 * Generates an HTML tooltip element with a click event to shuffle the tooltip text.
 *
 * @param {string} timeZone - The time zone to display in the tooltip.
 * @returns {string} - The HTML tooltip element.
 */
const aperoTooltip = (timeZone) => {
  return `<div class="tooltip" onClick="shuffleTooltipText(this.childNodes)">${timeZone}<span id="tooltip-text" class="tooltip-text">${tooltipText}</span></div>`;
};

/**
 * Shuffles the tooltip text based on the provided time zone.
 *
 * @param {NodeList} childNodes - The child nodes of an HTML element.
 */
const shuffleTooltipText = (childNodes) => {
  const timeZone = childNodes[0].data;

  // Generate a new apéro tooltip text based on the provided timeZone
  tooltipText = randomAperoTooltipText(timeZone);

  // Update the tooltip text in the HTML document
  childNodes[1].textContent = tooltipText;
};

/**
 * Resets the tooltip text to the initial value.
 */
const resetTooltipText = () => {
  // Reset the tooltipText to the initial value
  tooltipText = languageFormat === "fr-FR" ? `Clique...` : "Click on me...";
};

/**
 * Generates a random tooltip text for the apéro based on the provided time zone.
 *
 * @param {string} timeZone - The time zone in "continent/city" format.
 * @returns {string} - The randomly generated tooltip text.
 */
const randomAperoTooltipText = (timeZone) => {
  const timeZoneInfo = getTimeZoneInfo(timeZone);
  const {
    countryInfo: { name: countryName, capital, majorCities },
    aperoInfo: { time: aperoTime, drinks, snacks, brands, toast, tradition },
  } = timeZoneInfo;

  const textCountry =
    languageFormat === "fr-FR"
      ? `La capitale de ${countryName} est ${capital}, mais vous pouvez profiter de l'apéro dans d'autres grandes villes comme ${majorCities.join(
          ", "
        )}.`
      : `The capital of ${countryName} is ${capital}, but you can enjoy apéro in other big cities like ${majorCities.join(
          ", "
        )}.`;
  const textAperoTime =
    languageFormat === "fr-FR"
      ? `L'apéro en ${countryName} a lieu à ${aperoTime}.`
      : `Apéro in ${countryName} takes place at ${aperoTime}.`;
  const textDrinks =
    languageFormat === "fr-FR"
      ? `Pendant l'apéro en ${countryName}, vous pouvez profiter de boissons typiques comme ${drinks.join(
          ", "
        )}.`
      : `During apéro in ${countryName}, you can enjoy typical drinks like ${drinks.join(
          ", "
        )}.`;
  const textSnacks =
    languageFormat === "fr-FR"
      ? `Pendant l'apéro en ${countryName}, vous pouvez profiter d'en-cas typiques comme ${drinks.join(
          ", "
        )}.`
      : `During apéro in ${countryName}, you can enjoy typical apéro snacks like ${snacks.join(
          ", "
        )}.`;
  const textBrands =
    languageFormat === "fr-FR"
      ? `Les marques de boisson connues en ${countryName} son ${brands.join(
          ", "
        )}.`
      : `Typical drink brands in ${countryName} include ${brands.join(", ")}.`;
  const textToast =
    languageFormat === "fr-FR"
      ? `Pour trinquer en ${countryName}, vous pouvez dire ${toast.join(", ")}.`
      : `To raise a toast in ${countryName}, you can say ${toast.join(", ")}.`;
  const textTradition = tradition; // TODO translate tradition in other languages automatically

  const texts = [
    textCountry,
    textAperoTime,
    textDrinks,
    textSnacks,
    textBrands,
    textToast,
    textTradition,
  ];

  let randomText;

  do {
    randomText = pickRandom(texts);
  } while (randomText === tooltipText);

  return randomText;
};

/**
 * Updates the local apéro information based on the user's time zone.
 */
const updateAperoLocal = () => {
  let message =
    languageFormat === "fr-FR" ? "Erreur inconnue" : "Unknown error.";
  let icon = icons.INTERROGATION;

  try {
    const { timeZone: userTimeZone } = Intl.DateTimeFormat().resolvedOptions();
    const { time: aperoTime } = getAperoInfo(userTimeZone);
    const isAperoNow = isAperoTime(aperoTime, userTimeZone);
    const tooltip = aperoTooltip(userTimeZone);

    if (isAperoNow > 1) {
      message =
        languageFormat === "fr-FR"
          ? `Ce n'est pas encore l'heure de l'apéro à ${tooltip}, il faudra être patient jusqu'à ${aperoTime} !`
          : `It's not yet time for apéro in ${tooltip}, you need to be patient until ${aperoTime}!`;
      icon = icons.HOURGLASS_START;
    } else if (isAperoNow === 1) {
      message =
        languageFormat === "fr-FR"
          ? `C'est bientôt l'apéro à ${tooltip}, ce sera l'heure à ${aperoTime} !`
          : `Apéro is coming soon in ${tooltip}, it will be time at ${aperoTime}!`;
      icon = icons.HOURGLASS_END;
    } else if (isAperoNow === 0) {
      message =
        languageFormat === "fr-FR"
          ? `It's time for apéro in ${tooltip}! Santé!`
          : `It's time for apéro in ${tooltip}! Cheers!`;
      icon = icons.GLASS_CHEERS;
    } else {
      message =
        languageFormat === "fr-FR"
          ? `L'Apéro a déjà eu lieu à ${tooltip} à ${aperoTime}. Rassurez-vous et rendez-vous demain à cette heure-là !`
          : `Apéro has already happened in ${tooltip} at ${aperoTime}. Cheer up and wait until tomorrow at that time!`;
      icon = icons.CALENDAR_CLOCK;
    }

    if (isEasterEgg()) {
      message =
        languageFormat === "fr-FR"
          ? "Ce n'est peut-être pas encore l'heure de l'apéro, mais c'est aussi un moment spécial. Il est temps de se détendre !"
          : "It might not be apéro time yet, but it's a special time too. It's time to relax!";
      icon = icons.EASTER_EGG;
    }
  } catch (error) {
    console.error(`Error updating apéro: ${error}`);
    message = error.message;
    icon = icons.EXCLAMATION;
  } finally {
    // Update the page elements with the apéro information
    document.getElementById("apero-local").innerHTML = `<div>${message}</div>`;
    document.getElementById("local-icon").src = icon;
  }
};

/**
 * Searches for apéro information worldwide and categorizes the time zones into apéroWorld and almostAperoWorld.
 *
 * @returns {Array[]} An array containing two arrays: apéroWorld and almostAperoWorld.
 */
const searchAperoWorld = () => {
  let aperoWorld = [];
  let almostAperoWorld = [];

  Object.entries(apero).forEach(([_, countries]) => {
    Object.entries(countries).forEach(([_, timeZoneInfo]) => {
      const { timeZone, aperoInfo } = timeZoneInfo;

      if (aperoInfo && aperoInfo.time) {
        const isAperoNow = isAperoTime(aperoInfo.time, timeZone);

        if (isAperoNow === 0) {
          aperoWorld.push(timeZoneInfo);
        } else if (isAperoNow === 1) {
          almostAperoWorld.push(timeZoneInfo);
        }
      }
    });
  });

  return [aperoWorld, almostAperoWorld];
};

/**
 * Picks a random value from the given array.
 *
 * @param {Array} array - The array to choose from.
 * @returns {*} - A randomly selected value from the array.
 */
const pickRandom = (array) => {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};

/**
 * Gets the continent-specific icon based on the provided time zone.
 *
 * @param {string} timeZone - The time zone in "continent/city" format.
 * @returns {string} - The URL of the continent-specific icon.
 */
const getContinentIcon = (timeZone) => {
  let icon;

  try {
    const [continent] = timeZone.split("/");
    const continentIcons = {
      Antarctica: icons.EUROPA,
      Arctic: icons.EUROPA,
      Europe: icons.EUROPA,
      Atlantic: icons.AFRICA,
      Africa: icons.AFRICA,
      America: icons.AMERICAS,
      Canada: icons.AMERICAS,
      US: icons.AMERICAS,
      Asia: icons.ASIA,
      Australia: icons.ASIA,
      Indian: icons.ASIA,
      Pacific: icons.ASIA,
    };

    return continentIcons[continent] || icons.PLANET;
  } catch (error) {
    console.error(`Invalid user time zone: ${timeZone}: ${error}`);

    const link = getLink("https://github.com/cletqui/apero/issues", "GitHub");
    const errorMessage =
      languageFormat === "fr-FR"
        ? `Votre fuseau horaire semble être invalide. Vous pouvez signaler ce problème sur ${link}.`
        : `Your time zone appears to be invalid. You can report this issue on ${link}.`;

    throw new Error(errorMessage);
  }
};

/**
 * Updates the apéro information for the world view.
 * This function displays information about apéro time or errors on the world view.
 */
const updateAperoWorld = () => {
  // TODO display time zone time inside brackets
  let message =
    languageFormat === "fr-FR" ? "Erreur inconnue" : "Unknown error.";
  let icon = icons.INTERROGATION;

  try {
    const [aperoWorld, almostAperoWorld] = searchAperoWorld();

    // Check if there are apéro locations
    if (aperoWorld.length > 0) {
      const { timeZone } = pickRandom(aperoWorld);
      const tooltip = aperoTooltip(timeZone);

      message =
        languageFormat === "fr-FR"
          ? `C'est l'heure de l'apéro à ${tooltip}!`
          : `It's apéro time in ${tooltip}!`;
      icon = getContinentIcon(timeZone);
    } else if (almostAperoWorld.length > 0) {
      const { timeZone } = pickRandom(almostAperoWorld);
      const tooltip = aperoTooltip(timeZone);

      message =
        languageFormat === "fr-FR"
          ? `C'est presque l'heure de l'apéro à ${tooltip}!`
          : `It's almost apéro time in ${tooltip}!`;
      icon = getContinentIcon(timeZone);
    } else {
      // No apéro locations found
      message =
        languageFormat === "fr-FR"
          ? "Aucun apéro trouvé dans le monde, essayez encore plus loin !"
          : "No apéro found across the globe, try even further!";
      icon = icons.PLANET;
    }
  } catch (error) {
    // Handle errors and log them
    console.error(`Error updating world apéro: ${error}`);
    message = error.message;
    icon = icons.EXCLAMATION;
  } finally {
    // Update the DOM elements with the message and icon
    document.getElementById("apero-world").innerHTML = `<div>${message}</div>`;
    document.getElementById("world-icon").src = icon;
  }
};

/**
 * Updates the apéro information based on the specified zone.
 *
 * @param {string} zone - The zone to update: "local" for local apéro information, "world" for world apéro information, or any other value to update both.
 */
const updateApero = (zone) => {
  if (zone !== "local" && zone !== "world") {
    updateAperoLocal();
    updateAperoWorld();
  } else {
    zone === "local" ? updateAperoLocal() : updateAperoWorld();
  }
};

/* Startup Function */

const addEventListeners = () => {
  document.getElementById("menu-button").addEventListener("click", showMenu);
  document
    .getElementById("theme-button")
    .addEventListener("click", toggleTheme);
  document
    .getElementById("full-screen-button")
    .addEventListener("click", toggleFullScreen);
  document
    .getElementById("seconds-button")
    .addEventListener("click", toggleSeconds);
  document
    .getElementById("time-format-button")
    .addEventListener("click", toggleTimeFormat);
  document
    .getElementById("language-button")
    .addEventListener("click", toggleLanguage);
  document
    .getElementById("local-button")
    .addEventListener("click", function () {
      toggleApero(this.children);
    });
  document
    .getElementById("world-button")
    .addEventListener("click", function () {
      toggleApero(this.children);
    });
};

document.addEventListener("DOMContentLoaded", async function () {
  addEventListeners(); // Add event listeners to buttons
  initiateTheme(); // Initiate default system theme

  updateClock(); // Start by updating the clock
  setInterval(updateClock, SECONDS_INTERVAL); // Setup automatic refresh of clock every seconds

  await fetchApero(); // Fetch apéro info on ./data/apero.json

  updateAperoLocal(); // Update apéro local info
  setInterval(updateAperoLocal, SECONDS_INTERVAL); // Setup automatic refresh of apéro local info every seconds

  updateAperoWorld(); // Update apéro world info
  setInterval(updateAperoWorld, MINUTES_INTERVAL); // Setup automatic refresh of apéro world info every minutes
});
