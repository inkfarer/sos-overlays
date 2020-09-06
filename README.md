# unnamed-tourney-overlays

A [NodeCG](http://github.com/nodecg/nodecg) bundle.

## Screenshots

* [Scoreboard (Main scene)](https://inkfarer.com/img/ut-1.png)
* [Break screen](https://inkfarer.com/img/ut-2.png)
* [Upcoming teams](https://inkfarer.com/img/ut-3.png)
* [Upcoming stages](https://inkfarer.com/img/ut-4.png)
* [Dashboard 1 (Setup)](https://inkfarer.com/img/ut-dashboard2.png)
* [Dashboard 2 (Live controls)](https://inkfarer.com/img/ut-dashboard1.png)

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