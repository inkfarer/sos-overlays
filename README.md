# unnamed-tourney-overlays

A [NodeCG](http://github.com/nodecg/nodecg) bundle.

## Screenshots

* [Scoreboard (Main scene)](https://i.imgur.com/LBs1cyS.png)
* [Break screen](https://i.imgur.com/N2joHF9.png)
* [Upcoming teams](https://i.imgur.com/Q7laPh2.png)
* [Upcoming stages](https://i.imgur.com/hadGiZY.jpg)
* [Dashboard 1 (Setup)](https://i.imgur.com/BYyIjFK.png)
* [Dashboard 2 (Live controls)](https://i.imgur.com/Vbsh79Z.png)

## Install

1.1. Install NodeCG and [nodecg-cli](https://github.com/nodecg/nodecg-cli) (optional)

If you're using nodecg-cli:

2.1. Run `nodecg install inkfarer/unnamed-tourney-overlays`.

Otherwise:

2.1. Clone unnamed-tourney-overlays to `nodecg/bundles/unnamed-tourney-overlays`.

2.2. Install dependencies by running `npm install` in `nodecg/bundles/unnamed-tourney-overlays`.

3.1. For last.fm and smash.gg integration to work, create the configuration file at `nodecg/cfg/unnamed-tourney-overlays.json`.

Example configuration file:
```
{
	"lastfm": {
		"targetAccount": "Your last.fm account name",
		"apiKey": "your API key",
		"secret": "your secret"
	},
	"smashgg": {
		"apiKey": "Your Smash.gg API key"
	}
}
```

## Usage

Start NodeCG. By default, the dashboard can be accessed from `localhost:9090` in your browser.

From the dashboard, URLs to the graphics can be found from the graphics tab. To use them, they should be added as browser sources in a broadcast application such as OBS Studio. The graphics are made to run at a resolution of 1920x1080.

## Credits

Splatoon 2 map portraits are property of Nintendo and were downloaded from the [Splatoon wiki.](https://splatoonwiki.org/)