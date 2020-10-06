// Team Scores

const teamScores = nodecg.Replicant('teamScores', 'ipl-overlay-controls');

teamScores.on('change', newValue => {
	document.querySelector('#teamAScore').setAttribute('text', newValue.teamA);
	document.querySelector('#teamBScore').setAttribute('text', newValue.teamB);
});

// Scoreboard data

const SBData = nodecg.Replicant('SBData', 'ipl-overlay-controls');

SBData.on('change', newValue => {
	document.querySelector('#teamAName').setAttribute('text', newValue.teamAInfo.name);
	document.querySelector('#teamBName').setAttribute('text', newValue.teamBInfo.name);

	gsap.to('#teamAColor', {duration: 0.5, backgroundColor: (newValue.swapColorOrder) ? newValue.colorInfo.clrB : newValue.colorInfo.clrA});
	gsap.to('#teamBColor', {duration: 0.5, backgroundColor: (newValue.swapColorOrder) ? newValue.colorInfo.clrA : newValue.colorInfo.clrB});

	document.querySelector('.sbFlavorTextBG fitted-text').setAttribute('text', newValue.flavorText);
});

// Show/hide scoreboard

const SBShown = nodecg.Replicant('SBShown', 'ipl-overlay-controls');

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
