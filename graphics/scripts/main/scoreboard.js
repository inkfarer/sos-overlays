activeRound.on('change', (newValue) => {
	document.querySelector('#teamAName').setAttribute('text', newValue.teamA.name);
	document.querySelector('#teamBName').setAttribute('text', newValue.teamB.name);

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

scoreboardData.on('change', (newValue, oldValue) => {
	document.querySelector('.sbFlavorTextBG fitted-text').setAttribute('text', newValue.flavorText);

	doOnDifference(newValue, oldValue, 'isVisible', isVisible => {
		let lineClipPath, lineDelay, bgTop, bgEase, bgDelay, flavorOpacity;
		if (isVisible) {
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
});
