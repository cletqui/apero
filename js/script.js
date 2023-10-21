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
 * Toggle the visibility of a menu and update the menu button's icon accordingly.
 */
const showMenu = () => {
  // Get references to the header and menu button elements
  const header = document.getElementById("header");
  const menuButton = document.getElementById("menu-icon");

  // Determine the new class name and icon source based on the current state of the menu
  const headerClassName =
    header.className === "menu-hidden" ? "menu-visible" : "menu-hidden";
  const menuButtonIconSrc =
    header.className === "menu-hidden" ? icons.CROSS : icons.BURGER;

  // Update the class name of the header to show/hide the menu
  header.className = headerClassName;

  // Update the menu button's icon source to 'cross' or 'menu burger'
  menuButton.src = menuButtonIconSrc;
};

/**
 * Set the initial theme based on the user's system preferences.
 */
const initiateTheme = () => {
  // Get the user's system default theme preference
  const defaultTheme = window.matchMedia("(prefers-color-scheme: dark)");

  // Update the isDarkMode global flag
  isDarkMode = defaultTheme.matches;

  // Determine the 'data-theme' attribute value based on 'defaultTheme.matches'
  const themeAttribute = `${isDarkMode ? "dark" : "light"}-theme`;

  // Get a reference to the <html> element and set its 'data-theme' attribute
  document.querySelector("html").dataset.theme = themeAttribute;
};

/**
 * Toggle between dark and light themes and update the theme icon.
 */
const toggleTheme = () => {
  // Toggle the 'isDarkMode' variable between true and false
  isDarkMode = !isDarkMode;

  // Determine the icon source and theme attribute value based on 'isDarkMode'
  const iconSrc = isDarkMode ? icons.MOON : icons.SUN;
  const themeAttribute = `${isDarkMode ? "dark" : "light"}-theme`;

  // Get the element for the theme icon and update its source
  document.getElementById("theme-icon").src = iconSrc;

  // Update the 'data-theme' attribute of the <html> element based on 'isDarkMode'
  document.querySelector("html").dataset.theme = themeAttribute;
};

const toggleFullScreen = () => {
  // Determine the icon source 
  let iconSrc = document.fullscreenElement ? icons.COMPRESS : icons.EXPAND;

  // Toggle full screen (https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API#examples)
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
  }

  // Update the icon source
  document.getElementById("full-screen-icon").src = iconSrc;
};

/**
 * Toggle the display of seconds on a clock and update the clock icon accordingly.
 */
const toggleSeconds = () => {
  // Determine whether to show seconds based on the clock icon's source
  const showSeconds = document
    .getElementById("seconds-icon")
    .src.endsWith(icons.CLOCK);

  // Update the timeOptions to include or exclude seconds based on 'showSeconds'
  timeOptions.second = showSeconds ? "2-digit" : undefined;

  // Update the clock icon based on 'showSeconds'
  document.getElementById("seconds-icon").src = showSeconds
    ? icons.STOPWATCH
    : icons.CLOCK;

  // Update the clock to apply the change immediately
  updateClock();
};

/**
 * Toggle the time format between 12-hour and 24-hour and update the clock display accordingly.
 */
const toggleTimeFormat = () => {
  // Toggle between 12-hour and 24-hour time format
  timeOptions.hour12 = !timeOptions.hour12;

  // Update the clock display to apply the format change immediately
  updateClock();
};

/**
 * Toggle between English (en-US) and French (fr-FR) language formats for displaying time on the clock.
 */
const toggleLanguage = () => {
  // Toggle the current language format between English and French
  languageFormat = languageFormat === "en-US" ? "fr-FR" : "en-US";

  // Update the clock and apéro displayed to apply the language change immediately
  updateClock();
  updateApero();
};

/**
 * Show the apéro information for the specified zone and add the "unselected" class to the other apéro button.
 *
 * @param {string} zone - The apéro zone to show ('local' or 'world').
 */
const showApero = (zone) => {
  // Get the apéro info element
  const aperoInfo = document.getElementById(`apero-${zone}`);

  // Determine the other apéro zone
  const otherZone = zone === "local" ? "world" : "local";

  // Get the other apéro icon element
  const otherAperoIcon = document.getElementById(`${otherZone}-icon`);

  // Show the apéro information by updating the class
  aperoInfo.classList.remove("apero-info-hidden");

  // Add the "unselected" class to the other apéro icon
  otherAperoIcon.classList.add("unselected");
};

/**
 * Hide the apéro information for the specified zone and remove the "unselected" class from the other apéro button.
 *
 * @param {string} zone - The apéro zone to hide ('local' or 'world').
 */
const hideApero = (zone) => {
  // Get the apéro info element
  const aperoInfo = document.getElementById(`apero-${zone}`);

  // Determine the other apéro zone
  const otherZone = zone === "local" ? "world" : "local";

  // Get the other apéro icon element
  const otherAperoIcon = document.getElementById(`${otherZone}-icon`);

  // Hide the apéro information by updating the class
  aperoInfo.classList.add("apero-info-hidden");

  // Remove the "unselected" class from the other apéro icon
  otherAperoIcon.classList.remove("unselected");
};

/**
 * Toggle the visibility of apéro information, reset the tooltip text and update the apéro information.
 *
 * @param {Element[]} children - An array of child elements.
 */
const toggleApero = (children) => {
  // Extract the button ID to determine the zone (local or world)
  const button = children[0].id;
  const [zone] = button.split("-");
  const targetApero = document.getElementById(`apero-${zone}`);

  // Determine the other apéro zone
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
 * Update the clock display.
 */
const updateClock = () => {
  // Get the current date and time
  const now = new Date();
  // Get the user's time zone
  const { timeZone: userTimezone } = Intl.DateTimeFormat().resolvedOptions();

  // Helper function to update an element's text content
  const updateElement = (elementId, value) => {
    document.getElementById(elementId).textContent = value;
  };

  // Helper function to capitalize the first letter of a string
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
  ); // Date in french starts with a small letter
  updateElement("time-zone", `(${userTimezone})`);
};

/**
 * Check if the current time is 4:20 AM or 4:20 PM.
 *
 * @returns {boolean} True if it's an Easter egg time, false otherwise.
 */
const isEasterEgg = () => {
  // Get the current date and time
  const now = new Date();
  // Get the current hours and minutes
  const hours = now.getHours();
  const minutes = now.getMinutes();

  // Return true if it's 4:20 AM or 4:20 PM
  return (hours === 4 || hours === 16) && minutes === 20;
};

/**
 * Generate an HTML link element with the specified link and site name.
 *
 * @param {string} link - The URL to link to.
 * @param {string} name - The name or label for the link.
 * @returns {string} A string representing an HTML link element.
 */
const getLink = (link, name) => {
  // Create an HTML link element with the specified link and site name
  return `<a href="${link}" target="_blank" rel="noopener noreferrer">${name}</a>`;
};

/**
 * Fetch apéro data from the specified JSON file "./data/apero.json".
 *
 * @returns {Promise<object>} - A Promise that resolves to the apero data object.
 */
const fetchApero = async () => {
  try {
    const response = await fetch(APERO_DATA_URL); // Attempt to fetch apéro data from the specified JSON file
    const data = await response.json(); // Parse the response as JSON
    apero = data; // Assign the fetched data to the global 'apero' variable
    return data; // Return the fetched data
  } catch (error) {
    console.error(`Error fetching apero.json: ${error}`); // Log any errors that occur during the fetch process

    // Handle the error gracefully by updating the HTML element with an error message
    const aperoLocalElement = document.getElementById("apero-local");
    if (aperoLocalElement) {
      aperoLocalElement.textContent =
        languageFormat === "fr-FR"
          ? "Les informations pour l'apéro ne sont pas disponibles pour le moment."
          : "Apéro information not available at the moment.";
    }
  }
};

/**
 * Get apéro data for a specific time zone.
 *
 * @param {string} timeZone - The desired time zone in the "continent/city" format (e.g., 'America/New_York').
 * @returns {object|undefined} - Apero data object if available; otherwise, undefined.
 */
const getTimeZoneInfo = (timeZone) => {
  try {
    // Validate the provided time zone and split it into continent and city
    const [continent, city] = timeZone.split("/");

    // Check if the provided time zone exists in the apéro data
    if (
      apero.hasOwnProperty(continent) &&
      apero[continent].hasOwnProperty(city)
    ) {
      return apero[continent][city]; // Return the apéro data associated with the provided time zone
    } else {
      console.error(`No time zone ${timeZone} found in apéro data: ${error}`);
      const link = getLink(
        "https://github.com/cletqui/apero/#contributing",
        "GitHub"
      );
      throw new Error(
        languageFormat === "fr-FR"
          ? `Aucun fuseau horaire ${timeZone} n'a été trouvé dans apero.json. Pour y ajouter ce fuseau horaire, proposez-la sur ${link}.`
          : `No time zone ${timeZone} found in apero.json. To add this time zone, submit it on ${link}`
      );
    }
  } catch (error) {
    console.error(`Invalid user time zone: ${timeZone}: ${error}`);
    const link = getLink("https://github.com/cletqui/apero/issues", "GitHub");
    throw new Error(
      languageFormat === "fr-FR"
        ? `Votre fuseau horaire semble invalide. Vous pouvez signaler ce problème sur ${link}.`
        : `Your time zone appears to be invalid. You can report this issue to ${link}.`
    );
  }
};

/**
 * Get apéro information for a specific time zone.
 *
 * @param {string} timeZone - The desired time zone (e.g., 'America/New_York').
 * @returns {Object|string|undefined} - Apéro information object if available; otherwise, an error message.
 */
const getAperoInfo = (timeZone) => {
  try {
    // Attempt to retrieve Apero data for the provided time zone
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
      throw new Error(
        languageFormat === "fr-FR"
          ? `Aucune information sur l'apéro à ${timeZone}. Vous pouvez contribuer au projet et ajouter ce fuseau horaire sur ${link}.`
          : `Apéro info not found for ${timeZone}. You can contribute to the project and add this time zone on ${link}>.`
      );
    }
  } catch (error) {
    throw error; // Return the error thrown by getTimeZoneInfo function
  }
};

/**
 * Get the current time in the specified time zone.
 *
 * @param {string} timeZone - The desired time zone (e.g., 'America/New_York').
 * @returns {string} - A Time string from a Date object representing the current time in the specified time zone.
 */
const getTimezoneTime = (timeZone) => {
  try {
    // Define options for formatting the time in the specified time zone
    const timeZoneOptions = {
      ...timeOptions, // Default time options
      timeZone: timeZone,
      timeZoneName: "short",
    };

    // Get the current time in the specified time zone
    return new Date().toLocaleTimeString(undefined, timeZoneOptions);
  } catch (error) {
    console.error(`Error getting time in ${timeZone}: ${error}`);
    throw new Error(
      languageFormat === "fr-FR"
        ? `Impossible d'obtenir l'heure à ${timeZone}, réessayez plus tard.`
        : `Error getting time in ${timeZone}. Please try again.`
    );
  }
};

/**
 * Determine if it's apéro time in a specific time zone.
 *
 * @param {string} aperoTime - The apéro time in "HH:mm" format (e.g., '18:30').
 * @param {string} timeZone - The desired time zone (e.g., 'America/New_York').
 * @returns {number} - A positive value if apéro time is in the future, 0 if it's now, or a negative value if it's in the past.
 */
const isAperoTime = (aperoTime, timeZone) => {
  try {
    const [aperoHour] = aperoTime.split(":").map(Number);
    const [timeZoneHour] = getTimezoneTime(timeZone).split(":").map(Number);

    return aperoHour - timeZoneHour;
  } catch (error) {
    console.error(`Error calculating apéro time: ${error}`);
    throw new Error(
      languageFormat === "fr-FR"
        ? `Erreur lors du calcul de l'heure, réessayez plus tard.`
        : `Error calculating apéro time. Please try again.`
    );
  }
};

/**
 * Generate an apéro tooltip HTML element based on the provided timeZone.
 *
 * @param {string} timeZone - The time zone for which the tooltip should be generated.
 * @returns {string} A string representing an HTML tooltip element.
 */
const aperoTooltip = (timeZone) => {
  // Create an HTML tooltip element with a click event to shuffle the tooltip text
  return `<div class="tooltip" onClick="shuffleTooltipText(this.childNodes)">${timeZone}<span id="tooltip-text" class="tooltip-text">${tooltipText}</span></div>`;
};

/**
 * Generate an apéro tooltip text HTML element.
 *
 * @returns {string} A string representing an HTML tooltip text element.
 */

/**
 * Generate a new apéro tooltip text and update the tooltip text in the HTML document.
 *
 * @param {string} timeZone - The time zone for which the tooltip should be generated.
 */
const shuffleTooltipText = (childNodes) => {
  const timeZone = childNodes[0].data;

  // Generate a new apéro tooltip text based on the provided timeZone
  tooltipText = randomAperoTooltipText(timeZone);

  // Update the tooltip text in the HTML document
  childNodes[1].textContent = tooltipText;
};

/**
 * Resets the tooltip text to its initial value, "Click on me!".
 */
const resetTooltipText = () => {
  // Reset the tooltipText to the initial value
  tooltipText = languageFormat === "fr-FR" ? `Clique...` : "Click on me...";
};

/**
 * Generate a random apéro tooltip text based on the provided timeZone.
 *
 * @param {string} timeZone - The time zone for which the tooltip should be generated.
 * @returns {string} A randomly selected tooltip text.
 */
const randomAperoTooltipText = (timeZone) => {
  // Retrieve time zone information
  const timeZoneInfo = getTimeZoneInfo(timeZone);

  // Destructure relevant information from timeZoneInfo
  const {
    countryInfo: { name: countryName, capital, majorCities },
    aperoInfo: { time: aperoTime, drinks, snacks, brands, toast, tradition },
  } = timeZoneInfo;

  // Generate informative text snippets
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
 * Update apéro information for the local time zone and display it on the page.
 */
const updateAperoLocal = () => {
  let message =
    languageFormat === "fr-FR" ? "Erreur inconnue" : "Unknown error.";
  let icon = icons.INTERROGATION;

  try {
    // Get the user's time zone
    const { timeZone: userTimeZone } = Intl.DateTimeFormat().resolvedOptions();

    // Get apéro information for the user's time zone
    const { time: aperoTime } = getAperoInfo(userTimeZone);

    // Calculate the time difference between apéro time and current time
    const isAperoNow = isAperoTime(aperoTime, userTimeZone);

    const tooltip = aperoTooltip(userTimeZone); // The tooltip to display with the time zone

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
 * Search for apéro times across the world and categorizes them.
 * @returns {Array[]} - An array containing two arrays: aperoWorld and almostAperoWorld.
 *                      aperoWorld contains time zones where it's currently apéro time,
 *                      almostAperoWorld contains time zones where it's almost apéro time.
 */
const searchAperoWorld = () => {
  // Initialize arrays to store apéro and almost apéro time zones
  let aperoWorld = [];
  let almostAperoWorld = [];

  // Iterate through the continents and cities in the 'apero' object
  for (const continent of Object.keys(apero)) {
    for (const city of Object.keys(apero[continent])) {
      const timeZoneInfo = apero[continent][city];
      const { timeZone, aperoInfo } = timeZoneInfo;

      if (aperoInfo) {
        const { time: aperoTime } = aperoInfo;

        if (aperoTime) {
          // Check if it's apéro time now, later, or not
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
 * Pick a random value from the given array.
 * @param {Array} array - An array to choose from.
 * @returns {string} - A randomly selected value.
 */
const pickRandom = (array) => {
  // Generate a random index within the range of the array length
  const randomIndex = Math.floor(Math.random() * array.length);

  // Return the time zone at the randomly selected index
  return array[randomIndex];
};

/**
 * Get the appropriate continent icon based on the provided time zone.
 * @param {string} timeZone - The time zone in "continent/city" format.
 * @returns {string} - The URL of the continent-specific icon.
 */

const getContinentIcon = (timeZone) => {
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
    const link = getLink("https://github.com/cletqui/apero/issues", "GitHub");
    throw new Error(
      languageFormat === "fr-FR"
        ? `Votre fuseau horaire semble être invalide. Vous pouvez signaler ce problème sur ${link}.`
        : `Your time zone appears to be invalid. You can report this issue on ${link}.`
    );
  }
};

/**
 * Update the apéro information for the world view.
 * This function displays information about apéro time or errors on the world view.
 */
const updateAperoWorld = () => {
  // TODO display time zone time inside brackets
  // Default message and icon in case of errors or no data
  let message =
    languageFormat === "fr-FR" ? "Erreur inconnue" : "Unknown error.";
  let icon = icons.INTERROGATION;

  try {
    // Variables to store the results of searchAperoWorld()
    const [aperoWorld, almostAperoWorld] = searchAperoWorld();

    // Check if there are apéro locations
    if (aperoWorld.length > 0) {
      const { timeZone } = pickRandom(aperoWorld); // Picks a random time zone from the given array of time zones.

      const tooltip = aperoTooltip(timeZone);

      message =
        languageFormat === "fr-FR"
          ? `C'est l'heure de l'apéro à ${tooltip}!`
          : `It's apéro time in ${tooltip}!`;
      icon = getContinentIcon(timeZone);
    } else if (almostAperoWorld.length > 0) {
      const { timeZone } = pickRandom(almostAperoWorld); // Picks a random time zone from the given array of time zones.

      const tooltip = aperoTooltip(timeZone); // The tooltip to display with the time zone

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
 * Update apéro information based on the specified zone (local or world). Update both if no zone is specified.
 *
 * @param {string} zone - The apéro zone to update ('local' or 'world').
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
 * Adds event listeners to various buttons in the HTML document.
 */
const addEventListeners = () => {
  // Menu Button
  document.getElementById("menu-button").addEventListener("click", showMenu);
  // Theme Button
  document
    .getElementById("theme-button")
    .addEventListener("click", toggleTheme);
  // Full screen Button
  document
    .getElementById("full-screen-button")
    .addEventListener("click", toggleFullScreen);
  // Seconds Button
  document
    .getElementById("seconds-button")
    .addEventListener("click", toggleSeconds);
  // Time Format Button
  document
    .getElementById("time-format-button")
    .addEventListener("click", toggleTimeFormat);
  // Language Button
  document
    .getElementById("language-button")
    .addEventListener("click", toggleLanguage);
  // Local Button
  document
    .getElementById("local-button")
    .addEventListener("click", function () {
      // Toggle the "apero" element children
      toggleApero(this.children);
    });
  // World Button
  document
    .getElementById("world-button")
    .addEventListener("click", function () {
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
