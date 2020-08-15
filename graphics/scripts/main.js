// Team Scores

const teamScores = nodecg.Replicant('teamScores', {defaultValue: {
    teamA: 0,
    teamB: 0
}});

teamScores.on('change', newValue => {
	teamAScoreDisplay.setAttribute('text', (newValue.teamA === '') ? '0' : newValue.teamA);
	teamBScoreDisplay.setAttribute('text', (newValue.teamB === '') ? '0' : newValue.teamB);
});

// Scoreboard data

const colorNameToHex = {
	"Dark Blue": "#3535D2",
	"Green": "#6BD921",
	"Blue Green": "#16DD81",
	"Purple": "#B51CCE",
	"Yellow": "#FEF232",
	"Light Blue": "#2ED2FE",
	"Violet": "#8941FF",
	"Pink": "#EF26BD",
	"Turquoise": "#39EAB1",
	"Orange": "#FB7B08"
}

const SBData = nodecg.Replicant('SBData', {defaultValue: {
	flavorText: 'Flavor Text',
	teamAInfo: {
		name: "Placeholder Team 1",
		players: [
			{name:"You should fix this before going live."}
		]
	},
	teamAColor: 'Green',
	teamBInfo: {
		name: "Placeholder Team 2",
		players: [
			{name:"You should fix this before going live."}
		]
	},
	teamBcolor: 'Purple'
}});

SBData.on('change', newValue => {
	teamAName.setAttribute('text', newValue.teamAInfo.name);
	teamBName.setAttribute('text', newValue.teamBInfo.name);

	gsap.to('#teamAColorDisplay', {backgroundColor: colorNameToHex[newValue.teamAColor]});
	gsap.to('#teamBColorDisplay', {backgroundColor: colorNameToHex[newValue.teamBcolor]});

	flavorTextDisplay.setAttribute('text', newValue.flavorText);
});

// Show/hide scoreboard
const SBShown = nodecg.Replicant('SBShown', {defaultValue: true});

SBShown.on('change', newValue => {
	var sbTop, flavorBottom, ease;
	if (newValue) {
		sbTop = 40;
		flavorBottom = 10;
		ease = 'power2.out';
	} else {
		sbTop = -135;
		flavorBottom = -50;
		ease = 'power2.in';
	}
	gsap.to('.flavorTextWrapper', {bottom: flavorBottom, ease: ease});
	gsap.to('.scWrapper', {top: sbTop, ease: ease});
});