// Team Scores

const teamScores = nodecg.Replicant('teamScores', {defaultValue: {
    teamA: 0,
    teamB: 0
}});

teamScores.on('change', newValue => {
	document.querySelector('#teamAScore').setAttribute('text', newValue.teamA);
	document.querySelector('#teamBScore').setAttribute('text', newValue.teamB);
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
	document.querySelector('#teamAName').setAttribute('text', newValue.teamAInfo.name);
	document.querySelector('#teamBName').setAttribute('text', newValue.teamBInfo.name);

	gsap.to('#teamAColor', {duration: 0.5, backgroundColor: colorNameToHex[newValue.teamAColor]});
	gsap.to('#teamBColor', {duration: 0.5, backgroundColor: colorNameToHex[newValue.teamBcolor]});

	document.querySelector('.sbFlavorTextBG fitted-text').setAttribute('text', newValue.flavorText);
});

// Show/hide scoreboard

const SBShown = nodecg.Replicant('SBShown', {defaultValue: true});

SBShown.on('change', newValue => {
	var lineClipPath, lineDelay, bgTop, bgEase, bgDelay, flavorOpacity;
	if (newValue) {
		lineClipPath = 'polygon(0px 0px, 300px 0px, 300px 300px, 0px 300px)';
		bgTop = '0px';
		bgEase = 'power2.out';
		bgDelay = 0.4;
		lineDelay = 0;
		flavorOpacity = 1;
	} else {
		lineClipPath = 'polygon(0px 0px, 0px 0px, 0px 300px, 0px 300px)';
		bgTop = '90px';
		bgEase = 'power2.in';
		bgDelay = 0;
		lineDelay = 0.4;
		flavorOpacity = 0;
	}

	gsap.to('.sbBrandLine', {duration: 0.5, clipPath: lineClipPath, ease: 'power2.inOut', delay: lineDelay});
	gsap.to('.sbBackground', {duration: 0.5, top: bgTop, ease: bgEase, delay: bgDelay});
	gsap.to('.sbFlavorTextBG', {duration: 0.5, opacity: flavorOpacity, ease: 'power2.inOut', delay: lineDelay});
});
