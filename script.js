document.addEventListener("DOMContentLoaded", function () {
  const dateTimeElement = document.getElementById("date-time");
  const timezoneElement = document.getElementById("timezone");
  const locationElement = document.getElementById("location");
  const aperoMessageElement = document.getElementById("apero-message");

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  };

  const updateDateTime = () => {
    const now = new Date();
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const userLocation = Intl.DateTimeFormat().resolvedOptions().timeZone;

    dateTimeElement.textContent = now.toLocaleDateString(undefined, options);
    timezoneElement.textContent = "Timezone: " + userTimezone;
    locationElement.textContent = "Location: " + userLocation;

    // Fetch and process apero.json
    fetch("apero.json")
      .then((response) => response.json())
      .then((data) => {
        const countryInfo = data.countries.find((country) =>
          country.timezone.includes(userTimezone)
        );
        if (countryInfo) {
          // Split the time into hours and minutes
          const [hours, minutes] = countryInfo.aperoTime.split(":").map(Number);

          // Create a Date object representing today's date with the aperitif time
          const aperoTime = new Date();
          console.log(aperoTime);
          aperoTime.setHours(hours);
          console.log(aperoTime);
          aperoTime.setMinutes(minutes);
          aperoTime.setSeconds(0);
          
          if (now < aperoTime) {
            aperoMessageElement.textContent = "Apero is coming!";
          } else if (now > aperoTime) {
            aperoMessageElement.textContent = "Apero has just happened!";
          } else {
            aperoMessageElement.textContent = "It's Apero time!";
          }
        } else {
          aperoMessageElement.textContent =
            "Apero information not available for your location.";
        }
      })
      .catch((error) => {
        console.error("Error fetching apero.json:", error);
        aperoMessageElement.textContent =
          "Apero information not available at the moment.";
      });
  };

  setInterval(updateDateTime, 1000);
  updateDateTime();
});
