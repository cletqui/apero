# 🍹 Apéro Time 🍷

You don't know when it's time for apéro? It's always apéro time! (at least somewhere in the world...)

## Description

🕒 It's Apéro Time - Time to Raise Your Glass! 🥂 Apéro Time is a Worldly Aperitif Clock, it is your passport to a global aperitif adventure. 🌍 Not only does it show you the current time with style but it also helps you determine which country to raise a glass to! 🍻

## Table of Contents

- [🍹 Apéro Time 🍷](#-apéro-time-)
  - [Description](#description)
  - [Table of Contents](#table-of-contents)
  - [Website URLs](#website-urls)
  - [Features](#features)
  - [Roadmap](#roadmap)
  - [Disclaimer](#disclaimer)
  - [Contributing](#contributing)
  - [Data schema](#data-schema)
  - [Inspiration](#inspiration)
  - [License](#license)
  - [Project Status](#project-status)

## Website URLs

You can access the website at the following URLs:

- [Apéro Time - GitHub Pages](https://cletqui.github.io/apero)
- [Apéro Time - Cloudflare Pages](https://apero.pages.dev)

Feel free to visit and explore the website!

## Features

🕓 **Current Time:** Watch the clock as it keeps perfect time. Choose your style with options for dark or light themes, decide if seconds should be in the spotlight, and set the language that tickles your fancy.

🍺 **Aperitif Time:** Is it too early for an aperitif, the golden hour, or time to call it a day? Apéro Time will let you know. Plus, discover where on Earth it's prime aperitif time and join in the global toast.

🌍 **Country Information:** Dive into fascinating facts about the selected country, including its culinary delights and signature drinks. Want to fit in like a local? Learn how to raise your glass the right way!

## Roadmap

- [x] Build static webpage.
- [x] Implement dark/light mode.
- [x] Organise all buttons with emojis/icons in a dropdown hidden header (minimalistic).
- [x] Improve the time zone field and detect apéro time efficiently, handle all cases.
- [x] Handle mobile and non standard display through css.
- [ ] Add links to GitHub repo in error handling.
- [ ] Display country/apéro information in GUI.
- [ ] Complete `data/apero.json` with every countries ([flags](https://iconbuddy.app/circle-flags)?) and more fields.
- [ ] Add non-alcoholic drinks (juices, mocktails).
- [ ] Add animations in GUI.

## Disclaimer

The content of `data/apero.json` should represent the traditions of countries around the world, especially regarding drinking and eating specialities. Most of the content was created by a language model, I therefore apologize if the information in this file is offensive or erroneous. Feel free to participate in this project to correct or complete this data.

## Contributing

We're raising our glasses to welcome contributions that make Apéro Time even more delightful! 🍻 Here's how you can join the fun:

1. **Bug Reports:** If you stumble upon any quirky bugs or hiccups while exploring the website, kindly raise your glass and [open an issue](https://github.com/cletqui/apero/issues) to report it. Provide all the juicy details!

2. **Feature Requests:** Got a brilliant idea for a new feature or a quirky improvement? Don't keep it to yourself—share it with us by [opening an issue](https://github.com/cletqui/apero/issues).

3. **Data Contributions:** Apéro Time is all about the world's aperitif traditions, and it starts with the data in `data/apero.json` Pour in your knowledge, correct inaccuracies, or add missing info about countries. To do that, [fork this repository](https://github.com/cletqui/apero/fork), make your updates to the JSON file following the [data schema](#data-schema), and raise a toast with a pull request.

Let's make Apéro Time the life of the global party together! 🌟

## Data schema

The apéro data in `data/apero.json` is stored following this schema:

```json
{
  "Europe": {
    // Continent part of the time zone
    "Paris": {
      // City part of the time zone
      "timeZone": "Europe/Paris", // Time zone
      "countryInfo": {
        // Country information
        "name": "France", // Country name
        "capital": "Paris", // Country capital
        "language": "French", // Country language
        "currency": "EUR", // Country currency
        "majorCities": ["Marseille", "Lyon", "Rennes"] // Country major cities
      },
      "aperoInfo": {
        // Apéro information
        "time": "18:00", // Apéro time
        "drinks": [
          "Wine (e.g., Bordeaux, Champagne)",
          "Pastis",
          "Kir",
          "Champagne Cocktail"
        ], // Typical drinks
        "snacks": ["Cheese", "Baguette", "Pâté"], // Typical snacks
        "brands": ["Lillet", "Suze", "Byrrh"], // Typical drink brands
        "toast": ["Santé !", "Tchin tchin", "À votre santé !"], // Typical cheers
        "tradition": "Make eye contact while raising your glass and saying \"Santé !\". In formal settings, glasses are gently clinked together." // Traditional way to cheer
      }
    }
  }
}
```

Make sure you follow the same schema when adding new data.

## Inspiration

Website UI is largely inspired from [bypedroneres](https://github.com/bypedroneres)'s [Minimalistic-Clock](https://github.com/bypedroneres/Minimalistic-Clock/), thanks for the inspiration!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Project Status

This project is actively maintained and open to contributions.
