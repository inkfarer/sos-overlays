activeRound.on('change', (newValue) => {
	document.querySelector('#teamAName').setAttribute('text', addDots(newValue.teamA.name));
	document.querySelector('#teamBName').setAttribute('text', addDots(newValue.teamB.name));

	document.querySelector('#teamAScore').setAttribute('text', newValue.teamA.score);
	document.querySelector('#teamBScore').setAttribute('text', newValue.teamB.score);

	gsap.to('#teamAColor', {
		duration: 0.5,
		backgroundColor: newValue.teamA.color
	});
	gsap.to('#teamBColor', {
		duration: 0.5,
		backgroundColor: newValue.teamB.color
	});
});

const scoreboardShowTl = gsap.timeline();

scoreboardData.on('change', (newValue, oldValue) => {
	document.querySelector('.sbFlavorTextBG fitted-text').setAttribute('text', newValue.flavorText);

	doOnDifference(newValue, oldValue, 'isVisible', isVisible => {
		let lineClipPath, lineDelay, bgTop, bgEase, bgDelay, flavorOpacity, flavorDelay;
		if (isVisible) {
			lineClipPath = 'polygon(0px 0px, 300px 0px, 300px 300px, 0px 300px)';
			bgTop = '0px';
			bgEase = 'power2.out';
			bgDelay = 0.6;
			lineDelay = 0;
			flavorDelay = 0.75;
			flavorOpacity = 1;
		} else {
			lineClipPath = 'polygon(0px 0px, 0px 0px, 0px 300px, 0px 300px)';
			bgTop = '90px';
			bgEase = 'power2.in';
			bgDelay = 0;
			lineDelay = 0.6;
			flavorDelay = 0.6;
			flavorOpacity = 0;
		}

		const sbTl = gsap.timeline();

		sbTl.to('.sbBrandLine', {duration: 0.5, clipPath: lineClipPath, ease: 'power2.inOut', delay: lineDelay}, 'show-hide')
		.to('.sbBackground', {duration: 0.5, top: bgTop, ease: bgEase, delay: bgDelay}, 'show-hide')
		.to('.sbFlavorTextBG', {duration: 0.5, opacity: flavorOpacity, ease: 'power2.inOut', delay: flavorDelay}, 'show-hide');

		scoreboardShowTl.add(sbTl);
	});
});
