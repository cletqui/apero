document.addEventListener("DOMContentLoaded", function () {
  // TODO: improve UI, allow to browse timezones to find apero places, refactor code, add more entries in JSON
  const clockElement = document.getElementById("clock");
  const dateTimeElement = document.getElementById("date-time");
  const timezoneElement = document.getElementById("timezone");
  const aperoButton = document.getElementById("apero-button");
  const aperoStatusElement = document.getElementById("apero-status");
  const aperoInfoElement = document.getElementById("apero-info");

  const timeOptions = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };
  const dateTimeOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const getTimezoneTime = (now, timezone) => {
    const timeZoneOptions = {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
      hour12: false,
    };
    return now.toLocaleDateString(undefined, timeZoneOptions);
  };

  let isAperoVisible = false;

  aperoButton.addEventListener("click", () => {
    isAperoVisible = !isAperoVisible;
    aperoStatusElement.style.display = isAperoVisible ? "block" : "none";
    const locations = findAperitifLocation();
    if (locations) {
      aperitifResult.textContent = `It's aperitif time in ${locations}!`;
    } else {
      aperitifResult.textContent = "It's not aperitif time anywhere right now.";
    }
  });

  const updateClock = () => {
    const now = new Date();
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    clockElement.textContent = now.toLocaleTimeString(undefined, timeOptions);
    dateTimeElement.textContent = now.toLocaleDateString(
      undefined,
      dateTimeOptions
    );
    timezoneElement.textContent = `(${userTimezone})`;

    fetch("timezone.json")
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
              const [aperoHours, aperoMinutes] = aperoTime
                .split(":")
                .map(Number);
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
            console.log(`Timezone information not found for: ${userTimezone}.`);
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

  setInterval(updateClock, 1000);
  updateClock();
});
