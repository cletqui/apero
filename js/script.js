/* Global Constants */

const APERO_DATA_URL = "./data/apero.json";

const icons = {
  AFRICA: "./icons/earth-africa.svg",
  AMERICAS: "./icons/earth-americas.svg",
  ASIA: "./icons/earth-asia.svg",
  BURGER: "./icons/menu-burger.svg",
  CALENDAR_CLOCK: "./icons/calendar-clock.svg",
  CLOCK: "./icons/clock-five.svg",
  COMPRESS: "./icons/compress.svg",
  CROSS: "./icons/cross.svg",
  EASTER_EGG: "./icons/easter-egg.svg",
  EUROPA: "./icons/earth-europa.svg",
  EXCLAMATION: "./icons/exclamation.svg",
  EXPAND: "./icons/expand.svg",
  GLASS_CHEERS: "./icons/glass-cheers.svg",
  HOURGLASS_END: "./icons/hourglass-end.svg",
  HOURGLASS_START: "./icons/hourglass-start.svg",
  INTERROGATION: "./icons/interrogation.svg",
  MOON: "./icons/moon.svg",
  PLANET: "./icons/planet-ringed.svg",
  STOPWATCH: "./icons/stopwatch.svg",
  SUN: "./icons/sun.svg",
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
 * Shows or hides the menu and updates the menu button icon accordingly.
 */
const showMenu = () => {
  /**
   * The header element.
   *
   * @type {HTMLElement}
   */
  const header = document.getElementById("header");

  /**
   * The menu button element.
   *
   * @type {HTMLImageElement}
   */
  const menuButton = document.getElementById("menu-icon");

  /**
   * The new class name for the header element.
   *
   * @type {string}
   */
  const headerClassName =
    header.className === "menu-hidden" ? "menu-visible" : "menu-hidden";

  /**
   * The icon source for the menu button.
   *
   * @type {string}
   */
  const menuButtonIconSrc =
    header.className === "menu-hidden" ? icons.CROSS : icons.BURGER;

  // Update the class name of the header to show/hide the menu
  header.className = headerClassName;

  // Update the menu button's icon source to 'cross' or 'menu burger'
  menuButton.src = menuButtonIconSrc;
};

/**
 * Initiates the theme based on the user's system default theme preference.
 */
const initiateTheme = () => {
  /**
   * The user's system default theme preference.
   *
   * @type {MediaQueryList}
   */
  const defaultTheme = window.matchMedia("(prefers-color-scheme: dark)");

  /**
   * Indicates whether the current theme is dark mode.
   *
   * @type {boolean}
   */
  isDarkMode = defaultTheme.matches;

  /**
   * The value of the 'data-theme' attribute based on the current theme.
   *
   * @type {string}
   */
  const themeAttribute = `${isDarkMode ? "dark" : "light"}-theme`;

  /**
   * The <html> element.
   *
   * @type {HTMLElement}
   */
  const htmlElement = document.querySelector("html");

  // Set the 'data-theme' attribute of the <html> element
  htmlElement.dataset.theme = themeAttribute;
};

/**
 * Toggles the theme between dark mode and light mode.
 */
const toggleTheme = () => {
  /**
   * Indicates whether the current theme is dark mode.
   *
   * @type {boolean}
   */
  isDarkMode = !isDarkMode;

  /**
   * The icon source for the theme button.
   *
   * @type {string}
   */
  const iconSrc = isDarkMode ? icons.SUN : icons.MOON;

  /**
   * The value of the 'data-theme' attribute based on the current theme.
   *
   * @type {string}
   */
  const themeAttribute = `${isDarkMode ? "dark" : "light"}-theme`;

  // Get the element for the theme icon and update its source
  document.getElementById("theme-icon").src = iconSrc;

  // Update the 'data-theme' attribute of the <html> element based on 'isDarkMode'
  document.querySelector("html").dataset.theme = themeAttribute;
};

/**
 * Toggles the full screen mode and updates the full screen icon accordingly.
 */
const toggleFullScreen = () => {
  /**
   * The icon source for the full screen button.
   *
   * @type {string}
   */
  let iconSrc = document.fullscreenElement ? icons.EXPAND : icons.COMPRESS;

  // Toggle full screen
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
  }

  // Update the icon source
  document.getElementById("full-screen-icon").src = iconSrc;
};

/**
 * Toggles the display of seconds on the clock.
 */
const toggleSeconds = () => {
  /**
   * Determines whether to show seconds based on the clock icon's source.
   *
   * @type {boolean}
   */
  const showSeconds = document
    .getElementById("seconds-icon")
    .src.endsWith(icons.STOPWATCH.substring(icons.STOPWATCH.lastIndexOf("/"))); // Get rid of the "." at the beginning of the path string

  // Update the timeOptions to include or exclude seconds based on 'showSeconds'
  timeOptions.second = showSeconds ? "2-digit" : undefined;

  // Update the clock icon based on 'showSeconds'
  document.getElementById("seconds-icon").src = showSeconds
    ? icons.CLOCK
    : icons.STOPWATCH;

  // Update the clock to apply the change immediately
  updateClock();
};

/**
 * Toggles between 12-hour and 24-hour time format.
 */
const toggleTimeFormat = () => {
  /**
   * The options for formatting the time.
   *
   * @type {object}
   */
  timeOptions.hour12 = !timeOptions.hour12;

  // Update the clock display to apply the format change immediately
  updateClock();
};

/**
 * Toggles the current language format between English and French.
 */
const toggleLanguage = () => {
  /**
   * The current language format.
   *
   * @type {string}
   */
  languageFormat = languageFormat === "en-US" ? "fr-FR" : "en-US";

  // Update the clock and apéro displayed to apply the language change immediately
  updateClock();
  updateApero();
};

/**
 * Shows the apéro information for the specified zone.
 *
 * @param {string} zone - The apéro zone to show (local or world).
 */
const showApero = (zone) => {
  /**
   * The apéro info element to show.
   *
   * @type {HTMLElement}
   */
  const aperoInfo = document.getElementById(`apero-${zone}`);

  /**
   * The other apéro zone.
   *
   * @type {string}
   */
  const otherZone = zone === "local" ? "world" : "local";

  /**
   * The other apéro icon element.
   *
   * @type {HTMLElement}
   */
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
  /**
   * The apéro info element to hide.
   *
   * @type {HTMLElement}
   */
  const aperoInfo = document.getElementById(`apero-${zone}`);

  /**
   * The other apéro zone.
   *
   * @type {string}
   */
  const otherZone = zone === "local" ? "world" : "local";

  /**
   * The other apéro icon element.
   *
   * @type {HTMLElement}
   */
  const otherAperoIcon = document.getElementById(`${otherZone}-icon`);

  // Hide the apéro information by updating the class
  aperoInfo.classList.add("apero-info-hidden");

  // Remove the "unselected" class from the other apéro icon
  otherAperoIcon.classList.remove("unselected");
};

/**
 * Toggles the visibility of apéro information for the specified zone (local or world).
 *
 * @param {HTMLElement[]} children - The child elements of a container element.
 */
const toggleApero = (children) => {
  /**
   * The button ID to determine the zone (local or world).
   *
   * @type {string}
   */
  const button = children[0].id;

  /**
   * The zone extracted from the button ID.
   *
   * @type {string}
   */
  const [zone] = button.split("-");

  /**
   * The target apéro element to toggle visibility.
   *
   * @type {HTMLElement}
   */
  const targetApero = document.getElementById(`apero-${zone}`);

  /**
   * The other apéro zone.
   *
   * @type {string}
   */
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
  /**
   * The current date and time.
   *
   * @type {Date}
   */
  const now = new Date();

  /**
   * The user's time zone.
   *
   * @type {string}
   */
  const { timeZone: userTimezone } = Intl.DateTimeFormat().resolvedOptions();

  /**
   * Updates the text content of an element with the specified value.
   *
   * @param {string} elementId - The ID of the element to update.
   * @param {string} value - The value to set as the text content.
   */
  const updateElement = (elementId, value) => {
    document.getElementById(elementId).textContent = value;
  };

  /**
   * Capitalizes the first letter of a string.
   *
   * @param {string} string - The string to capitalize.
   * @returns {string} The string with the first letter capitalized.
   */
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // Update elements with formatted current time, date, and user time zone
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
 * Checks if the current time is 4:20 AM or 4:20 PM.
 *
 * @returns {boolean} - True if it's 4:20 AM or 4:20 PM, false otherwise.
 */
const isEasterEgg = () => {
  /**
   * The current date and time.
   *
   * @type {Date}
   */
  const now = new Date();

  /**
   * The current hours.
   *
   * @type {number}
   */
  const hours = now.getHours();

  /**
   * The current minutes.
   *
   * @type {number}
   */
  const minutes = now.getMinutes();

  // Return true if it's 4:20 AM or 4:20 PM
  return (hours === 4 || hours === 16) && minutes === 20;
};

/**
 * Creates an HTML link element with the specified link and site name.
 *
 * @param {string} link - The URL of the link.
 * @param {string} name - The name or label of the link.
 * @returns {string} - The HTML link element.
 */
const getLink = (link, name) => {
  // Create an HTML link element with the specified link and site name
  return `<a href="${link}" target="_blank" rel="noopener noreferrer">${name}</a>`;
};

/**
 * Fetches the apéro data from the specified JSON file.
 *
 * @returns {Promise<object>} - A promise that resolves to the fetched apéro data.
 * @throws {Error} - If there is an error fetching the apéro data or updating the HTML element with an error message.
 */
const fetchApero = async () => {
  try {
    /**
     * The response from fetching the apéro data.
     *
     * @type {Response}
     */
    const response = await fetch(APERO_DATA_URL); // Attempt to fetch apéro data from the specified JSON file

    /**
     * The parsed JSON data from the response.
     *
     * @type {object}
     */
    const data = await response.json(); // Parse the response as JSON

    apero = data; // Assign the fetched data to the global 'apero' variable

    return data; // Return the fetched data
  } catch (error) {
    console.error(`Error fetching apero.json: ${error}`); // Log any errors that occur during the fetch process

    /**
     * The error message to display in the HTML element.
     *
     * @type {string}
     */
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
    /**
     * The continent and city extracted from the provided time zone.
     *
     * @type {string[]}
     */
    const [continent, city] = timeZone.split("/");

    // Check if the provided time zone exists in the apéro data
    if (
      apero.hasOwnProperty(continent) &&
      apero[continent].hasOwnProperty(city)
    ) {
      return apero[continent][city]; // Return the apéro data associated with the provided time zone
    } else {
      console.error(`No time zone ${timeZone} found in apéro data: ${error}`);

      /**
       * The link to contribute to the project and add the missing time zone.
       *
       * @type {string}
       */
      const link = getLink(
        "https://github.com/cletqui/apero/#contributing",
        "GitHub"
      );

      throw new Error(
        languageFormat === "fr-FR"
          ? `Aucun fuseau horaire ${timeZone} n'a été trouvé dans apero.json. Pour y ajouter ce fuseau horaire, proposez-la sur ${link}.`
          : `No time zone ${timeZone} found in apero.json. To add this time zone, submit it on ${link}.`
      );
    }
  } catch (error) {
    console.error(`Invalid user time zone: ${timeZone}: ${error}`);

    /**
     * The link to report the invalid time zone issue.
     *
     * @type {string}
     */
    const link = getLink("https://github.com/cletqui/apero/issues", "GitHub");

    throw new Error(
      languageFormat === "fr-FR"
        ? `Votre fuseau horaire semble invalide. Vous pouvez signaler ce problème sur ${link}.`
        : `Your time zone appears to be invalid. You can report this issue to ${link}.`
    );
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
    /**
     * The apéro data for the provided time zone.
     *
     * @type {object}
     */
    const timeZoneInfo = getTimeZoneInfo(timeZone);

    // Check if the retrieved apéro data contains the 'aperoInfo' field
    if (timeZoneInfo && timeZoneInfo.aperoInfo) {
      return timeZoneInfo.aperoInfo; // Return the apéro information if it exists
    } else {
      console.error(
        `Apéro info not found for ${timeZone} in apéro data: ${error}`
      );

      /**
       * The link to contribute to the project and add the missing time zone.
       *
       * @type {string}
       */
      const link = getLink(
        "https://github.com/cletqui/apero/#contributing",
        "GitHub"
      );

      throw new Error(
        languageFormat === "fr-FR"
          ? `Aucune information sur l'apéro à ${timeZone}. Vous pouvez contribuer au projet et ajouter ce fuseau horaire sur ${link}.`
          : `Apéro info not found for ${timeZone}. You can contribute to the project and add this time zone on ${link}.`
      );
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
    /**
     * The options for formatting the time in the specified time zone.
     *
     * @type {object}
     */
    const timeZoneOptions = {
      ...timeOptions, // Default time options
      timeZone: timeZone,
      timeZoneName: "short",
    };

    // Get the current time in the specified time zone
    return new Date().toLocaleTimeString(undefined, timeZoneOptions);
  } catch (error) {
    console.error(`Error getting time in ${timeZone}: ${error}`);

    /**
     * The error message to throw if there is an error getting the time in the specified time zone.
     *
     * @type {string}
     */
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
    /**
     * The hour component of the apéro time.
     *
     * @type {number}
     */
    const [aperoHour] = aperoTime.split(":").map(Number);

    /**
     * The hour component of the current time in the given time zone.
     *
     * @type {number}
     */
    const [timeZoneHour] = getTimezoneTime(timeZone).split(":").map(Number);

    return aperoHour - timeZoneHour;
  } catch (error) {
    console.error(`Error calculating apéro time: ${error}`);

    /**
     * The error message to throw if there is an error calculating the apéro time.
     *
     * @type {string}
     */
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
  // Create an HTML tooltip element with a click event to shuffle the tooltip text
  return `<div class="tooltip" onClick="shuffleTooltipText(this.childNodes)">${timeZone}<span id="tooltip-text" class="tooltip-text">${tooltipText}</span></div>`;
};

/**
 * Shuffles the tooltip text based on the provided time zone.
 *
 * @param {NodeList} childNodes - The child nodes of an HTML element.
 */
const shuffleTooltipText = (childNodes) => {
  /**
   * The time zone extracted from the child nodes.
   *
   * @type {string}
   */
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
  /**
   * The time zone information for the provided time zone.
   *
   * @type {object}
   */
  const timeZoneInfo = getTimeZoneInfo(timeZone);

  // Destructure relevant information from timeZoneInfo
  const {
    countryInfo: { name: countryName, capital, majorCities },
    aperoInfo: { time: aperoTime, drinks, snacks, brands, toast, tradition },
  } = timeZoneInfo;

  /**
   * The informative text snippet about the country.
   *
   * @type {string}
   */
  const textCountry =
    languageFormat === "fr-FR"
      ? `La capitale de ${countryName} est ${capital}, mais vous pouvez profiter de l'apéro dans d'autres grandes villes comme ${majorCities.join(
          ", "
        )}.`
      : `The capital of ${countryName} is ${capital}, but you can enjoy apéro in other big cities like ${majorCities.join(
          ", "
        )}.`;

  /**
   * The informative text snippet about the apéro time.
   *
   * @type {string}
   */
  const textAperoTime =
    languageFormat === "fr-FR"
      ? `L'apéro en ${countryName} a lieu à ${aperoTime}.`
      : `Apéro in ${countryName} takes place at ${aperoTime}.`;

  /**
   * The informative text snippet about the drinks.
   *
   * @type {string}
   */
  const textDrinks =
    languageFormat === "fr-FR"
      ? `Pendant l'apéro en ${countryName}, vous pouvez profiter de boissons typiques comme ${drinks.join(
          ", "
        )}.`
      : `During apéro in ${countryName}, you can enjoy typical drinks like ${drinks.join(
          ", "
        )}.`;

  /**
   * The informative text snippet about the snacks.
   *
   * @type {string}
   */
  const textSnacks =
    languageFormat === "fr-FR"
      ? `Pendant l'apéro en ${countryName}, vous pouvez profiter d'en-cas typiques comme ${drinks.join(
          ", "
        )}.`
      : `During apéro in ${countryName}, you can enjoy typical apéro snacks like ${snacks.join(
          ", "
        )}.`;

  /**
   * The informative text snippet about the drink brands.
   *
   * @type {string}
   */
  const textBrands =
    languageFormat === "fr-FR"
      ? `Les marques de boisson connues en ${countryName} son ${brands.join(
          ", "
        )}.`
      : `Typical drink brands in ${countryName} include ${brands.join(", ")}.`;

  /**
   * The informative text snippet about the toast.
   *
   * @type {string}
   */
  const textToast =
    languageFormat === "fr-FR"
      ? `Pour trinquer en ${countryName}, vous pouvez dire ${toast.join(", ")}.`
      : `To raise a toast in ${countryName}, you can say ${toast.join(", ")}.`;

  /**
   * The informative text snippet about the apéro tradition.
   *
   * @type {string}
   */
  const textTradition = tradition; // TODO translate tradition in other languages automatically

  // Create an array of possible tooltip texts
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

  // Ensure the randomly selected text is not equal to the previously displayed tooltipText
  do {
    randomText = pickRandom(texts);
  } while (randomText === tooltipText);

  return randomText;
};

/**
 * Updates the apéro information for the local view.
 * This function displays information about apéro time or errors on the local view.
 */
const updateAperoLocal = () => {
  /**
   * The default message in case of errors or no data.
   *
   * @type {string}
   */
  let message =
    languageFormat === "fr-FR" ? "Erreur inconnue" : "Unknown error.";

  /**
   * The default icon in case of errors or no data.
   *
   * @type {string}
   */
  let icon = icons.INTERROGATION;

  try {
    /**
     * The user's time zone.
     *
     * @type {string}
     */
    const { timeZone: userTimeZone } = Intl.DateTimeFormat().resolvedOptions();

    /**
     * The apéro information for the user's time zone.
     *
     * @type {object}
     */
    const { time: aperoTime } = getAperoInfo(userTimeZone);

    /**
     * The result of checking if it's apéro time for the user's time zone.
     * 0 indicates it's apéro time, 1 indicates it's almost apéro time, -1 indicates it's not apéro time yet, and -2 indicates apéro has already happened.
     *
     * @type {number}
     */
    const isAperoNow = isAperoTime(aperoTime, userTimeZone);

    /**
     * The tooltip to display with the user's time zone.
     *
     * @type {string}
     */
    const tooltip = aperoTooltip(userTimeZone);

    // Set message and icon based on the apéro status
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

    // Check for Easter egg
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
 * Searches for apéro and almost apéro time zones in the 'apero' object.
 *
 * @returns {Array[]} - An array containing two arrays: 'aperoWorld' and 'almostAperoWorld'.
 *                      'aperoWorld' contains time zone information for apéro time zones.
 *                      'almostAperoWorld' contains time zone information for almost apéro time zones.
 */
const searchAperoWorld = () => {
  /**
   * An array to store time zone information for apéro time zones.
   *
   * @type {Array}
   */
  let aperoWorld = [];

  /**
   * An array to store time zone information for almost apéro time zones.
   *
   * @type {Array}
   */
  let almostAperoWorld = [];

  // Iterate through the continents and cities in the 'apero' object
  for (const continent of Object.keys(apero)) {
    for (const city of Object.keys(apero[continent])) {
      /**
       * The time zone information for the current city.
       *
       * @type {object}
       */
      const timeZoneInfo = apero[continent][city];

      /**
       * The time zone of the current city.
       *
       * @type {string}
       */
      const { timeZone, aperoInfo } = timeZoneInfo;

      if (aperoInfo) {
        /**
         * The apéro time for the current city.
         *
         * @type {string}
         */
        const { time: aperoTime } = aperoInfo;

        if (aperoTime) {
          /**
           * The result of checking if it's apéro time for the current city.
           * 0 indicates it's apéro time now, 1 indicates it's almost apéro time, and -1 indicates it's not apéro time.
           *
           * @type {number}
           */
          const isAperoNow = isAperoTime(aperoTime, timeZone);

          if (isAperoNow === 0) {
            aperoWorld.push(timeZoneInfo);
          } else if (isAperoNow === 1) {
            almostAperoWorld.push(timeZoneInfo);
          }
        }
      }
    }
  }

  return [aperoWorld, almostAperoWorld];
};

/**
 * Picks a random value from the given array.
 *
 * @param {Array} array - The array to choose from.
 * @returns {*} - A randomly selected value from the array.
 */
const pickRandom = (array) => {
  /**
   * The random index within the range of the array length.
   *
   * @type {number}
   */
  const randomIndex = Math.floor(Math.random() * array.length);

  // Return the value at the randomly selected index
  return array[randomIndex];
};

/**
 * Gets the continent-specific icon based on the provided time zone.
 *
 * @param {string} timeZone - The time zone in "continent/city" format.
 * @returns {string} - The URL of the continent-specific icon.
 */
const getContinentIcon = (timeZone) => {
  /**
   * The continent-specific icon URL.
   *
   * @type {string}
   */
  let icon;

  try {
    // Split the provided time zone into continent and city
    const [continent] = timeZone.split("/");

    // Determine the continent-specific icon based on the continent
    switch (continent) {
      case "Antarctica":
      case "Arctic":
      case "Europe":
        icon = icons.EUROPA;
        break;
      case "Atlantic":
      case "Africa":
        icon = icons.AFRICA;
        break;
      case "America":
      case "Canada":
      case "US":
        icon = icons.AMERICAS;
        break;
      case "Asia":
      case "Australia":
      case "Indian":
      case "Pacific":
        icon = icons.ASIA;
        break;
      default:
        icon = icons.PLANET;
    }

    return icon;
  } catch (error) {
    // Handle invalid time zone input
    console.error(`Invalid user time zone: ${timeZone}: ${error}`);

    /**
     * The link to report the invalid time zone issue.
     *
     * @type {string}
     */
    const link = getLink("https://github.com/cletqui/apero/issues", "GitHub");

    throw new Error(
      languageFormat === "fr-FR"
        ? `Votre fuseau horaire semble être invalide. Vous pouvez signaler ce problème sur ${link}.`
        : `Your time zone appears to be invalid. You can report this issue on ${link}.`
    );
  }
};

/**
 * Updates the apéro information for the world view.
 * This function displays information about apéro time or errors on the world view.
 */
const updateAperoWorld = () => {
  // TODO display time zone time inside brackets
  /**
   * The default message in case of errors or no data.
   *
   * @type {string}
   */
  let message =
    languageFormat === "fr-FR" ? "Erreur inconnue" : "Unknown error.";

  /**
   * The default icon in case of errors or no data.
   *
   * @type {string}
   */
  let icon = icons.INTERROGATION;

  try {
    /**
     * The results of the searchAperoWorld function.
     *
     * @type {Array[]}
     */
    const [aperoWorld, almostAperoWorld] = searchAperoWorld();

    // Check if there are apéro locations
    if (aperoWorld.length > 0) {
      /**
       * A randomly selected time zone from the apéroWorld array.
       *
       * @type {object}
       */
      const { timeZone } = pickRandom(aperoWorld);

      /**
       * The tooltip to display with the time zone.
       *
       * @type {string}
       */
      const tooltip = aperoTooltip(timeZone);

      message =
        languageFormat === "fr-FR"
          ? `C'est l'heure de l'apéro à ${tooltip}!`
          : `It's apéro time in ${tooltip}!`;
      icon = getContinentIcon(timeZone);
    } else if (almostAperoWorld.length > 0) {
      /**
       * A randomly selected time zone from the almostAperoWorld array.
       *
       * @type {object}
       */
      const { timeZone } = pickRandom(almostAperoWorld);

      /**
       * The tooltip to display with the time zone.
       *
       * @type {string}
       */
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
  // Determine whether to update apéro local or apéro world information
  if (zone === "local") {
    updateAperoLocal();
  } else if (zone === "world") {
    updateAperoWorld();
  } else {
    updateAperoLocal();
    updateAperoWorld();
  }
};

/* Startup Function */

/**
 * Adds event listeners to various buttons in the application.
 */
const addEventListeners = () => {
  /**
   * The menu button element.
   *
   * @type {HTMLElement}
   */
  const menuButton = document.getElementById("menu-button");
  menuButton.addEventListener("click", showMenu);

  /**
   * The theme button element.
   *
   * @type {HTMLElement}
   */
  const themeButton = document.getElementById("theme-button");
  themeButton.addEventListener("click", toggleTheme);

  /**
   * The full screen button element.
   *
   * @type {HTMLElement}
   */
  const fullScreenButton = document.getElementById("full-screen-button");
  fullScreenButton.addEventListener("click", toggleFullScreen);

  /**
   * The seconds button element.
   *
   * @type {HTMLElement}
   */
  const secondsButton = document.getElementById("seconds-button");
  secondsButton.addEventListener("click", toggleSeconds);

  /**
   * The time format button element.
   *
   * @type {HTMLElement}
   */
  const timeFormatButton = document.getElementById("time-format-button");
  timeFormatButton.addEventListener("click", toggleTimeFormat);

  /**
   * The language button element.
   *
   * @type {HTMLElement}
   */
  const languageButton = document.getElementById("language-button");
  languageButton.addEventListener("click", toggleLanguage);

  /**
   * The local button element.
   *
   * @type {HTMLElement}
   */
  const localButton = document.getElementById("local-button");
  localButton.addEventListener("click", function () {
    // Toggle the "apero" element children
    toggleApero(this.children);
  });

  /**
   * The world button element.
   *
   * @type {HTMLElement}
   */
  const worldButton = document.getElementById("world-button");
  worldButton.addEventListener("click", function () {
    // Toggle the "apero" element children
    toggleApero(this.children);
  });
};

document.addEventListener("DOMContentLoaded", async function () {
  addEventListeners(); // Add event listeners to buttons
  updateClock(); // Start by updating the clock
  setInterval(updateClock, SECONDS_INTERVAL); // Setup automatic refresh of clock every seconds
  initiateTheme(); // Initiate default system theme
  await fetchApero(); // Fetch apéro info on ./data/apero.json
  updateAperoLocal(); // Update apéro local info
  setInterval(updateAperoLocal, SECONDS_INTERVAL); // Setup automatic refresh of apéro local info every seconds
  updateAperoWorld(); // Update apéro world info
  setInterval(updateAperoWorld, MINUTES_INTERVAL); // Setup automatic refresh of apéro world info every minutes
});
