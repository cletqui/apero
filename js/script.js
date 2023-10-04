let showSeconds = true; // Show seconds status
let isDarkMode = true; // Dark mode
let languageFormat = "fr-FR"; // Language format
let isAperoVisible = false; // Apero information status
let isMenuVisible = false; // Menu showdown status
let timezone = {}; // Timezone JSON object

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

const toggleDarkMode = () => {
  // TODO: implement dark/light mode switch
  isDarkMode = !isDarkMode;
  document.getElementById("dark-light").src = isDarkMode
    ? "./icons/moon.svg"
    : "./icons/sun.svg";
  updateClock();
};

// Function to show or hide seconds
const toggleSeconds = () => {
  showSeconds = !showSeconds;
  if (showSeconds) {
    timeOptions.second = "2-digit";
    document.getElementById("seconds-minutes").src = "./icons/stopwatch.svg";
  } else {
    delete timeOptions.second;
    document.getElementById("seconds-minutes").src = "./icons/clock-five.svg";
  }
  updateClock();
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
  updateClock();
};

const showMenu = () => {
  isMenuVisible = !isMenuVisible;
  document.getElementById("menu").style.display = isMenuVisible
    ? "block"
    : "none";
  document.getElementById("header").style.backgroundColor = isMenuVisible
    ? "#0f0f0f"
    : "";
  document.getElementById("menu-button").src = isMenuVisible
    ? "./icons/cross-small.svg"
    : "./icons/menu-burger.svg";
};

const getTimezoneTime = (now, timezone) => {
  const timeZoneOptions = {
    ...timeOptions,
    timeZone: timezone,
    timeZoneName: "short",
  };
  return now.toLocaleDateString(languageFormat, timeZoneOptions);
};

const showApero = () => {
  isAperoVisible = !isAperoVisible;
  document.getElementById("apero-status").style.display = isAperoVisible
    ? "block"
    : "none";

  // const locations = findAperitifLocation();

  // if (locations) {
  //   document.getElementById("apero-info").textContent = `It's aperitif time in ${locations}!`;
  // } else {
  //   document.getElementById("apero-info").textContent = "It's not aperitif time anywhere right now.";
  // }

  updateClock();
};

const updateClock = () => {
  const now = new Date();
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const aperoStatusElement = document.getElementById("apero-status");

  document.getElementById("time").textContent = now.toLocaleTimeString(
    languageFormat,
    timeOptions
  );
  document.getElementById("date").textContent = now.toLocaleDateString(
    languageFormat,
    dateTimeOptions
  );
  document.getElementById("timezone").textContent = `(${userTimezone})`;

  fetch("./data/timezone.json")
    .then((response) => response.json())
    .then((data) => {
      try {
        const [continent, city] = userTimezone.split("/");

        if (
          data.hasOwnProperty(continent) &&
          data[continent].hasOwnProperty(city)
        ) {
          const timezoneInfo = data[continent][city];
          const countryInfo = timezoneInfo["countryInfo"];
          const aperoInfo = timezoneInfo["aperoInfo"];

          if (aperoInfo && aperoInfo.time) {
            const aperoTime = aperoInfo.time;
            const [aperoHours, aperoMinutes] = aperoTime.split(":").map(Number);
            const nowHours = now.getHours();

            if (nowHours < aperoHours - 1) {
              aperoStatusElement.textContent = `😌 It's not yet time for apéro, you need to be patient until ${aperoTime}! ⏳`;
            } else if (nowHours === aperoHours - 1) {
              aperoStatusElement.textContent = `😬 Apéro is coming soon, it will be time at ${aperoTime}! ⌛`;
            } else if (nowHours === aperoHours) {
              aperoStatusElement.textContent = `🥳 It's time for apéro! 🍻`;
            } else {
              aperoStatusElement.textContent = `🙁 Apéro has already happened at ${aperoTime}, wait until tomorrow at the same time! ⌚`;
            }
          } else {
            aperoStatusElement.textContent =
              "Apéro information (time) not available for your location. 🌍";
          }
        } else {
          console.log(`Timezone information not found for: ${userTimezone}.`); // TODO add GitHub repo link and invite user to enhance the JSON file
        }
      } catch (error) {
        console.error(`Error: ${error}`);
        console.log(`Invalid user timezone: ${userTimezone}`);
      }
    })
    .catch((error) => {
      console.error(`Error fetching timezone.json: ${error}`);
      aperoStatusElement.textContent = `Apéro information not available at the moment. ❓`;
    });
};

document.addEventListener("DOMContentLoaded", function () {
  // TODO: improve UI, allow to browse timezones to find apero places, refactor code, add more entries in JSON
  // TODO: fetch apero.json only once
  setInterval(updateClock, 1000);
  updateClock();
});
