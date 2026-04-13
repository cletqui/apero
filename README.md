# Apéro Time

It's always apéro time somewhere. A world clock that tells you where.

[![pages-build-deployment](https://github.com/cletqui/apero/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/cletqui/apero/actions/workflows/pages/pages-build-deployment)

**Live:** [cletqui.github.io/apero](https://cletqui.github.io/apero) · [apero.pages.dev](https://apero.pages.dev)

## How it works

The clock shows your local time. Two buttons let you check:

- **?** — Is it apéro time where _you_ are? Shows whether you're before, during, or past the local apéro hour, with a countdown or a toast.
- **🪐** — Where in the world is it apéro time right now? Picks a random timezone currently at apéro hour and tells you what to drink.

Click the timezone tooltip to cycle through cultural facts: typical drinks, snacks, brands, how to toast, and local tradition.

Apéro data is fetched from [data.cybai.re/apero](https://github.com/cletqui/data), a Cloudflare Worker API serving cultural drinking information for 190+ timezones.

## Features

- Live clock with 12h/24h toggle, seconds toggle, EN/FR language switch
- Local apéro status (too early / almost / apéro time! / already happened)
- World apéro finder — randomises across all timezones currently at apéro hour
- Clickable tooltip cycling through country & apéro facts
- Dark / light theme (persisted across sessions)
- Fullscreen mode
- 4:20 easter egg

## Project structure

```
apero/
├── css/style.css
├── icons/
├── js/script.js
└── index.html
```

## Data schema

Apéro data is served from the API. Each timezone entry follows this shape:

```json
{
  "timeZone": "Europe/Paris",
  "countryInfo": {
    "name": "France",
    "capital": "Paris",
    "language": "French",
    "currency": "EUR",
    "majorCities": ["Marseille", "Lyon", "Bordeaux"]
  },
  "aperoInfo": {
    "time": "18:30",
    "drinks": ["Pastis", "Kir", "Wine"],
    "snacks": ["Cheese", "Baguette", "Olives"],
    "brands": ["Ricard", "Lillet", "Suze"],
    "toast": ["Santé !", "Tchin tchin !"],
    "tradition": "Make eye contact while clinking glasses and say \"Santé !\"."
  }
}
```

To contribute data for a missing timezone, open an [issue](https://github.com/cletqui/apero/issues) or a pull request against the [data API](https://github.com/cletqui/data).

## Disclaimer

Cultural data was assembled with the help of a language model. If anything is inaccurate or offensive, please open an issue — contributions are very welcome.

## Inspiration

UI inspired by [bypedroneres](https://github.com/bypedroneres)'s [Minimalistic-Clock](https://github.com/bypedroneres/Minimalistic-Clock/).

## License

MIT — see [LICENSE](LICENSE).
