// TODO: allow to browse timeZones to find apero places, refactor code, add more entries in JSON

let showSeconds = true; // Show seconds
let isDarkMode = true; // Dark mode
let languageFormat = "fr-FR"; // Language format
let apero = {}; // Apero JSON object

let timeOptions = {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
};

let dateTimeOptions = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

// Display Functions */

const showMenu = () => {
  // TODO: add animation to switch between menu buttons and display the menu
  const header = document.getElementById("header");
  const menuButton = document.getElementById("menu-button");

  if (header.className === "menu-hidden") {
    header.className = "menu-visible";
    menuButton.src = "./icons/cross.svg";
  } else {
    header.className = "menu-hidden";
    menuButton.src = "./icons/menu-burger.svg";
  }
};

const initiateTheme = () => {
  const defaultTheme = window.matchMedia("(prefers-color-scheme: dark)");
  document.querySelector("html").dataset.theme = `${
    defaultTheme.matches ? "dark" : "light"
  }-theme`;
};

const toggleTheme = () => {
  isDarkMode = !isDarkMode;
  document.getElementById("theme").src = isDarkMode
    ? "./icons/moon.svg"
    : "./icons/sun.svg";
  document.querySelector("html").dataset.theme = `${
    isDarkMode ? "dark" : "light"
  }-theme`;
};

const toggleSeconds = () => {
  // Function to show or hide seconds
  showSeconds = !showSeconds;
  if (showSeconds) {
    timeOptions.second = "2-digit";
    document.getElementById("seconds-minutes").src = "./icons/stopwatch.svg";
  } else {
    delete timeOptions.second;
    document.getElementById("seconds-minutes").src = "./icons/clock-five.svg";
  }

  updateClock(); // Update the clock to apply the change immediately
};

const toggleLanguage = () => {
  // TODO: implement language switching for every line printed
  if (languageFormat === "en-US") {
    languageFormat = "fr-FR";
    timeOptions.hour12 = false;
  } else {
    languageFormat = "en-US";
    timeOptions.hour12 = true;
  }

  updateClock(); // Update the clock to apply the change immediately
};

const showApero = () => {
  updateApero(); // Refresh apero information just in case
  const aperoStatus = document.getElementById("apero-status");

  if (
    aperoStatus.style.display === "none" ||
    aperoStatus.style.display === ""
  ) {
    aperoStatus.style.display = "block";
  } else {
    aperoStatus.style.display = "none";
  }
};

const showWorld = () => {
  const aperoInfo = document.getElementById("apero-info");

  if (aperoInfo.style.display === "none" || aperoInfo.style.display === "") {
    aperoInfo.style.display = "block";
  } else {
    aperoInfo.style.display = "none";
  }
};

/* Operating Functions */

const updateClock = () => {
  const now = new Date();
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  document.getElementById("time").textContent = now.toLocaleTimeString(
    languageFormat,
    timeOptions
  );
  document.getElementById("date").textContent = now.toLocaleDateString(
    languageFormat,
    dateTimeOptions
  );
  document.getElementById("timezone").textContent = `(${userTimezone})`;
};

const fetchApero = async () => {
  try {
    const response = await fetch("./data/apero.json");
    const data = await response.json();
    apero = data;
    return data;
  } catch (error) {
    console.error(`Error fetching apero.json: ${error}`);
    document.getElementById("apero-status").textContent =
      "Apéro information not available at the moment.";
  }
};

const getApero = (timeZone) => {
  try {
    const [continent, city] = timeZone.split("/");

    if (
      apero.hasOwnProperty(continent) &&
      apero[continent].hasOwnProperty(city)
    ) {
      return apero[continent][city];
    } else {
      console.log(`Timezone information not found for: ${timeZone}.`);
    }
  } catch (error) {
    console.error(`Error: ${error}`);
    console.log(`Invalid user timeZone: ${timeZone}`);
  }
};

const getAperoInfo = (timeZone) => {
  const apero = getApero(timeZone);

  if (apero && apero.aperoInfo) {
    return apero.aperoInfo;
  } else {
    console.error(`Error: ${error}`);
    console.log(`Apéro time not found for ${timeZone}`);
  }
};

const updateAperoStatus = (aperoInfo, now) => {
  const aperoStatusElement = document.getElementById("apero-status");
  const aperoButton = document.getElementById("apero-button");

  if (aperoInfo && aperoInfo.time) {
    const aperoTime = aperoInfo.time;
    const [aperoHours] = aperoTime.split(":").map(Number);
    const nowHours = now.getHours();

    if (nowHours < aperoHours - 1) {
      aperoStatusElement.textContent = `It's not yet time for apéro, you need to be patient until ${aperoTime}!`;
      aperoButton.src = "./icons/hourglass-start.svg";
    } else if (nowHours === aperoHours - 1) {
      aperoStatusElement.textContent = `Apéro is coming soon, it will be time at ${aperoTime}!`;
      aperoButton.src = "./icons/hourglass-end.svg";
    } else if (nowHours === aperoHours) {
      aperoStatusElement.textContent = `It's time for apéro! Cheers!`;
      aperoButton.src = "./icons/glass-cheers.svg";
    } else {
      aperoStatusElement.textContent = `Apéro has already happened at ${aperoTime}, wait until tomorrow at that time!`;
      aperoButton.src = "./icons/time-twenty-four.svg";
    }
  } else {
    console.log("Apéro time not found.");
    aperoStatusElement.textContent =
      "Apéro information (time) not available for your location.";
  }
};

const updateApero = () => {
  const now = new Date();
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const aperoInfo = getAperoInfo(userTimezone);

  updateAperoStatus(aperoInfo, now);
};

const searchApero = () => {};

const getTimezoneTime = (timeZone, now) => {
  const timeZoneOptions = {
    ...timeOptions,
    timeZone: timeZone,
    timeZoneName: "short",
  };

  return now.toLocaleDateString(languageFormat, timeZoneOptions);
};

/* Startup Function */

document.addEventListener("DOMContentLoaded", async function () {
  updateClock(); // Start by updating the clock
  setInterval(updateClock, 1000); // Setup automatic refresh of clock every seconds
  initiateTheme(); // Initiate default system theme
  await fetchApero(); // Fetch apero info on ./data/apero.json
  updateApero(); // Update apero status
  setInterval(updateApero, 1000); // Setup automatic refresh of clock apero info every seconds
});
