// Scene switching

activeBreakScene.on('change', (newValue, oldValue) => {
	let mapsDelay = 0.3;

	if (oldValue === 'mainScene') {
		mapsDelay = 1.2;
	}

	switch (newValue) {
		case 'main':
			showMainScene();
			hideAltBG();
			return;
		case 'teams':
			hideMainScene();
			showAltBG();
			toggleMaps(false);
			let animDelay = 0.6;
			if (oldValue === 'mainScene') animDelay = 1.2;
			toggleNextUp(true, animDelay);
			return;
		case 'stages':
			hideMainScene();
			showAltBG();
			toggleMaps(true, mapsDelay);
			toggleNextUp(false);
			return;
		default:
			// show main scene in case of an unknown scene
			showMainScene();
			hideAltBG();
			return;
	}
});

function hideMainScene() {
	gsap.to(['.bgContentImage', '.bgWaterTexture', '.mainScene'], {duration: 1.5, top: -1280, ease: 'power2.inOut'});
}

function showMainScene() {
	gsap.to(['.bgContentImage', '.bgWaterTexture', '.mainScene'], {duration: 1.5, top: 0, ease: 'power2.inOut'});
}

function showAltBG() {
	gsap.to('.sceneAlt', {duration: 1.5, top: 0, ease: 'power2.inOut'});
}

function hideAltBG() {
	gsap.to('.sceneAlt', {duration: 1.5, top: 1280, ease: 'power2.inOut'});
}

function toggleMaps(show, delay = 0) {
	const stageElems = document.querySelectorAll('.stageElem');

	let scoreboardDelay = 0;

	let delays;
	switch (stageElems.length) {
		case 7:
			delays = [0, 0.15, 0.3, 0.45, 0.3, 0.15, 0];
			scoreboardDelay = 0.3;
			break;
		case 5:
			delays = [0, 0.15, 0.3, 0.15, 0];
			scoreboardDelay = 0.15;
			break;
		case 3:
			delays = [0, 0.15, 0];
			scoreboardDelay = 0.1;
			break;
	}

	let opacity = 1;

	if (show) {
		if (delay !== 0 && delays && delays.length >= 1) {
			for (let i = 0; i < delays.length; i++) {
				delays[i] += delay;
			}
			scoreboardDelay += delay;
		}
	} else {
		opacity = 0;
	}

	let opacFrom = opacity === 0 ? 1 : 0;

	gsap.fromTo('.stagesScoreboard', {opacity: opacFrom}, {duration: 0.25, opacity: opacity, ease: 'power2.inOut', delay: scoreboardDelay});
	if (stageElems.length === 0) return;

	for (let i = 0; i < stageElems.length; i++) {
		const element = stageElems[i];
		gsap.fromTo(element, {opacity: opacFrom}, {duration: 0.25, opacity: opacity, delay: delays[i], ease: 'power2.inOut'});
	}
}

function toggleNextUp(show, delay = 0) {
	if (show) {
		gsap.fromTo('.nextTeamInfoContainer', {opacity: 0}, {duration: 0.25, opacity: 1, delay: delay});
		let teamAPlayers = document.querySelectorAll('.nextTeamAPlayer');
		let teamBPlayers = document.querySelectorAll('.nextTeamBPlayer');

		for (let i = 0; i < teamAPlayers.length; i++) {
			element = teamAPlayers[i];

			element.style.opacity = '0';
			gsap.to(element, {opacity: 1, duration: 0.25, delay: (i * 0.05) + (delay * 1.2)});
		};

		for (let j = 0; j < teamBPlayers.length; j++) {
			element = teamBPlayers[j];

			element.style.opacity = '0';
			gsap.to(element, {opacity: 1, duration: 0.25, delay: (j * 0.05) + (delay * 1.2)});
		};
	} else {
		gsap.to('.nextTeamInfoContainer', {duration: 0.25, opacity: 0});
	}
}
