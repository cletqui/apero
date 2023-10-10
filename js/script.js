// TODO: allow to browse time zones to find apero places, refactor code, add more entries in JSON

let showSeconds = true; // Boolean flag to determine whether to show seconds on the clock
let isDarkMode = true; // Boolean flag to determine whether the webpage is in dark mode
let languageFormat = "fr-FR"; // A string representing the preferred language format (e.g., "fr-FR" for French)
let apero = {}; // An empty object that will store Apero data in JSON format

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
  const menuButton = document.getElementById("menu-button");

  // Determine the new class name and icon source based on the current state of the menu
  const headerClassName =
    header.className === "menu-hidden" ? "menu-visible" : "menu-hidden";
  const menuButtonIconSrc =
    header.className === "menu-hidden"
      ? "./icons/cross.svg"
      : "./icons/menu-burger.svg";

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

  // Determine the 'data-theme' attribute value based on 'defaultTheme.matches'
  const themeAttribute = `${defaultTheme.matches ? "dark" : "light"}-theme`;

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
  const iconSrc = isDarkMode ? "./icons/moon.svg" : "./icons/sun.svg";
  const themeAttribute = `${isDarkMode ? "dark" : "light"}-theme`;

  // Get the element for the theme icon and update its source
  document.getElementById("theme").src = iconSrc;

  // Update the 'data-theme' attribute of the <html> element based on 'isDarkMode'
  document.querySelector("html").dataset.theme = themeAttribute;
};

/**
 * Toggle the display of seconds on a clock and update the clock icon accordingly.
 */
const toggleSeconds = () => {
  showSeconds = !showSeconds; // Toggle the 'showSeconds' variable between true and false

  // Update the timeOptions to include or exclude seconds based on 'showSeconds'
  timeOptions.second = showSeconds ? "2-digit" : undefined;

  // Update the icon based on 'showSeconds'
  document.getElementById("seconds-minutes").src = showSeconds
    ? "./icons/stopwatch.svg"
    : "./icons/clock-five.svg";

  // Update the clock to apply the change immediately
  updateClock();
};

/**
 * Toggle between English (en-US) and French (fr-FR) language formats for displaying time on the clock.
 */
const toggleLanguage = () => {
  // TODO: implement language switching for every line printed

  // Toggle the current language format between English and French
  languageFormat = languageFormat === "en-US" ? "fr-FR" : "en-US";

  // Use 24-hour format for French and 12-hour format for English
  timeOptions.hour12 = !(languageFormat === "fr-FR");

  // Update the clock to apply the language change immediately
  updateClock();
};

/**
 * Toggle the visibility of Apero local (user time zone) information and refresh it if necessary.
 */
const toggleAperoLocal = () => {
  // Get the apéro world element
  const aperoLocal = document.getElementById("apero-local");

  // Toggle the display style of apéro information
  if (aperoLocal.className === "apero-info-hidden") {
    // Refresh Apero information in case it needs updating
    updateAperoLocal();

    // If currently hidden, hide apéro world information and show apéro local information
    hideAperoWorld();
    showAperoLocal();
  } else {
    // If currently visible, hide apéro local information
    hideAperoLocal();
  }
};

/**
 * Show the apéro local information in the apéro local element and add "unselect" class for world button.
 */
const showAperoLocal = () => {
  // Get apéro local info element
  const aperoLocal = document.getElementById("apero-local");
  // Get apéro world button element
  const worldButton = document.getElementById("world-button");

  // Update the class to show apéro local information
  aperoLocal.className = "apero-info";
  // Update the class to add "unselected" color to world button
  worldButton.classList.add("unselected");
};

/**
 * Hide the apéro local information in the apéro local element and remove "unselect" class for world button.
 */
const hideAperoLocal = () => {
  // Get apéro local info element
  const aperoLocal = document.getElementById("apero-local");
  // Get apéro world button element
  const worldButton = document.getElementById("world-button");

  // Update the class to hide apéro local information
  aperoLocal.className = "apero-info-hidden";
  // Update the class to remove "unselected" color to apéro button
  worldButton.classList.remove("unselected");
};

/**
 * Toggle the visibility of apéro world information and trigger a search for apéro around the world.
 */
const toggleAperoWorld = () => {
  // Get the apéro world element
  const aperoWorld = document.getElementById("apero-world");

  // Toggle the display style of apéro information
  if (aperoWorld.className === "apero-info-hidden") {
    // Refresh apéro around the world information
    updateAperoWorld();

    // If currently hidden, hide apéro local information and show apéro world information
    hideAperoLocal();
    showAperoWorld();
  } else {
    // If currently visible, hide apéro world information
    hideAperoWorld();
  }
};

/**
 * Show the apéro world information in the apéro world element and add "unselect" class for apero button.
 */
const showAperoWorld = () => {
  // Get apéro world info element
  const aperoWorld = document.getElementById("apero-world");
  // Get apéro local button element
  const aperoButton = document.getElementById("apero-button");

  // Update the class to show apéro world information
  aperoWorld.className = "apero-info";
  // Update the class to add "unselected" color to apéro button
  aperoButton.classList.add("unselected");
};

/**
 * Hide the apéro world information in the apéro world and remove "unselect" class for apero button.
 */
const hideAperoWorld = () => {
  // Get apéro world info element
  const aperoWorld = document.getElementById("apero-world");
  // Get apéro local button element
  const aperoButton = document.getElementById("apero-button");

  // Update the class to hide apéro world information
  aperoWorld.className = "apero-info-hidden";
  // Update the class to remove "unselected" color to apéro button
  aperoButton.classList.remove("unselected");
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

  // Update elements with formatted current time, date, and user time zone
  updateElement("time", now.toLocaleTimeString(languageFormat, timeOptions));
  updateElement(
    "date",
    now.toLocaleDateString(languageFormat, dateTimeOptions)
  );
  updateElement("time-zone", `(${userTimezone})`);
};

/**
 * Fetch Apero data from the specified JSON file.
 *
 * @returns {Promise<object>} - A Promise that resolves to the Apero data object.
 */
const fetchApero = async () => {
  try {
    const response = await fetch("./data/apero.json"); // Attempt to fetch Apero data from the specified JSON file
    const data = await response.json(); // Parse the response as JSON
    apero = data; // Assign the fetched data to the global 'apero' variable
    return data; // Return the fetched data
  } catch (error) {
    console.error(`Error fetching apero.json: ${error}`); // Log any errors that occur during the fetch process

    // Handle the error gracefully by updating the HTML element with an error message
    const aperoLocalElement = document.getElementById("apero-local");
    if (aperoLocalElement) {
      aperoLocalElement.textContent =
        "Apéro information not available at the moment.";
    }
  }
};

/**
 * Get Apero data for a specific time zone.
 *
 * @param {string} timeZone - The desired time zone in the "continent/city" format (e.g., 'America/New_York').
 * @returns {object|undefined} - Apero data object if available; otherwise, undefined.
 */
const getApero = (timeZone) => {
  try {
    // Validate the provided time zone and split it into continent and city
    const [continent, city] = timeZone.split("/");

    // Check if the provided time zone exists in the Apero data
    if (
      apero.hasOwnProperty(continent) &&
      apero[continent].hasOwnProperty(city)
    ) {
      return apero[continent][city]; // Return the Apero data associated with the provided time zone
    } else {
      console.error(`No time zone ${timeZone} found in apéro data: ${error}`);
      throw new Error(
        `No time zone (${timeZone}) found in apero.json. To add this new time zone, follow: https://github.com/cletqui/apero/#contributing.`
      );
    }
  } catch (error) {
    console.error(`Invalid user time zone: ${timeZone}: ${error}`);
    throw new Error(
      `Your time zone appears to be invalid. You can report this issue at https://github.com/cletqui/apero/issues.`
    );
  }
};

/**
 * Get Apero information for a specific time zone.
 *
 * @param {string} timeZone - The desired time zone (e.g., 'America/New_York').
 * @returns {Object|string|undefined} - Apero information object if available; otherwise, an error message.
 */
const getAperoInfo = (timeZone) => {
  try {
    // Attempt to retrieve Apero data for the provided time zone
    const aperoTimeZone = getApero(timeZone);

    // Check if the retrieved Apero data contains the 'aperoInfo' field
    if (aperoTimeZone && aperoTimeZone.aperoInfo) {
      return aperoTimeZone.aperoInfo; // Return the Apero information if it exists
    } else {
      console.error(
        `Apéro info not found for ${timeZone} in apéro data: ${error}`
      );
      throw new Error(
        `Apéro info not found for ${timeZone}. To contribute, follow: https://github.com/cletqui/apero/#contributing.`
      );
    }
  } catch (error) {
    throw error; // Return the error thrown by getApero function
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
    throw new Error(`Error getting time in ${timeZone}. Please try again.`);
  }
};

/**
 * Determine if it's Apero time in a specific time zone.
 *
 * @param {string} aperoTime - The Apero time in "HH:mm" format (e.g., '18:30').
 * @param {string} timeZone - The desired time zone (e.g., 'America/New_York').
 * @returns {number} - A positive value if Apero time is in the future, 0 if it's now, or a negative value if it's in the past.
 */
const isAperoTime = (aperoTime, timeZone) => {
  try {
    const [aperoHour] = aperoTime.split(":").map(Number);
    const [timeZoneHour] = getTimezoneTime(timeZone).split(":").map(Number);

    return aperoHour - timeZoneHour;
  } catch (error) {
    console.error(`Error calculating apéro time: ${error}`);
    throw new Error(`Error calculating apéro time. Please try again.`);
  }
};

/**
 * Update Apero information for the local time zone and display it on the page.
 */
const updateAperoLocal = () => {
  let message = "Unknown error.";
  let icon = "./icons/interrogation.svg";

  try {
    // Get the user's time zone
    const { timeZone: userTimeZone } = Intl.DateTimeFormat().resolvedOptions();

    // Get Apero information for the user's time zone
    const aperoInfo = getAperoInfo(userTimeZone);

    // Calculate the time difference between Apero time and current time
    const isAperoNow = isAperoTime(aperoInfo.time, userTimeZone);

    // Set message and icon based on the Apero status
    if (isAperoNow > 1) {
      message = `It's not yet time for apéro in ${userTimeZone}, you need to be patient until ${aperoInfo.time}!`;
      icon = "./icons/hourglass-start.svg";
    } else if (isAperoNow === 1) {
      message = `Apéro is coming soon in ${userTimeZone}, it will be time at ${aperoInfo.time}!`;
      icon = "./icons/hourglass-end.svg";
    } else if (isAperoNow === 0) {
      message = `It's time for apéro in ${userTimeZone}! Cheers!`;
      icon = "./icons/glass-cheers.svg";
    } else {
      message = `Apéro has already happened in ${userTimeZone} at ${aperoInfo.time}, wait until tomorrow at that time!`;
      icon = "./icons/time-twenty-four.svg";
    }
  } catch (error) {
    console.error(`Error updating apéro: ${error}`);
    message = error.message;
    icon = "./icons/exclamation.svg";
  } finally {
    // Update the page elements with the Apero information
    document.getElementById("apero-local").textContent = message;
    document.getElementById("apero-button").src = icon;
  }
};

/**
 * Searches for apéro times across the world and categorizes them.
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
 * Picks a random time zone from the given array of time zones.
 * @param {Array} aperoWorld - An array of time zones to choose from.
 * @returns {string} - A randomly selected time zone.
 */
const pickRandomTimeZone = (aperoWorld) => {
  // Generate a random index within the range of the array length
  const randomIndex = Math.floor(Math.random() * aperoWorld.length);

  // Return the time zone at the randomly selected index
  return aperoWorld[randomIndex];
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
        icon = "./icons/earth-europa.svg";
        break;
      case "Atlantic":
      case "Africa":
        icon = "./icons/earth-africa.svg";
        break;
      case "America":
      case "Canada":
      case "US":
        icon = "./icons/earth-americas.svg";
        break;
      case "Asia":
      case "Australia":
      case "Indian":
      case "Pacific":
        icon = "./icons/earth-asia.svg";
        break;
      default:
        icon = "./icons/planet-ringed.svg";
    }

    return icon;
  } catch (error) {
    // Handle invalid time zone input
    console.error(`Invalid user time zone: ${timeZone}: ${error}`);
    throw new Error(
      `Your time zone appears to be invalid. You can report this issue at https://github.com/cletqui/apero/issues.`
    );
  }
};

/**
 * Updates the Apero information for the world view.
 * This function displays information about apéro time or errors on the world view.
 */
const updateAperoWorld = () => {
  // Default message and icon in case of errors or no data
  let message = "Unknown error.";
  let icon = "./icons/interrogation.svg";

  try {
    // Variables to store the results of searchAperoWorld()
    const [aperoWorld, almostAperoWorld] = searchAperoWorld();

    // Check if there are apéro locations
    if (aperoWorld.length > 0) {
      const {
        timeZone,
        aperoInfo: { time: aperoTime },
      } = pickRandomTimeZone(aperoWorld);
      message = `It's apéro time in ${timeZone} (${aperoTime}).`;
      icon = getContinentIcon(timeZone);
    } else if (almostAperoWorld.length > 0) {
      const {
        timeZone,
        aperoInfo: { time: aperoTime },
      } = pickRandomTimeZone(almostAperoWorld);
      message = `It's almost apéro time in ${timeZone} (${aperoTime}).`;
      icon = getContinentIcon(timeZone);
    } else {
      // No apéro locations found
      message = "No apéro found across the globe, try even further!";
      icon = "./icons/planet-ringed.svg";
    }
  } catch (error) {
    // Handle errors and log them
    console.error(`Error updating world apéro: ${error}`);
    message = error.message;
    icon = "./icons/exclamation.svg";
  } finally {
    // Update the DOM elements with the message and icon
    document.getElementById("apero-world").textContent = message;
    document.getElementById("world-button").src = icon;
  }
};

/* Startup Function */

document.addEventListener("DOMContentLoaded", async function () {
  updateClock(); // Start by updating the clock
  setInterval(updateClock, 1000); // Setup automatic refresh of clock every seconds
  initiateTheme(); // Initiate default system theme
  await fetchApero(); // Fetch apéro info on ./data/apero.json
  updateAperoLocal(); // Update apéro local info
  setInterval(updateAperoLocal, 1000); // Setup automatic refresh of apero local info every seconds
  updateAperoWorld(); // Update apéro world info
  setInterval(updateAperoWorld, 60000); // Setup automatic refresh of apero world info every minutes
});
