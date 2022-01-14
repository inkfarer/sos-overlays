let nextStageDate;
let lastDiff;

nextRoundTime.on('change', newValue => {
	animToggleInfo(newValue.isVisible, musicShown.value, '#breakTimer', newValue.isVisible, '#timeDivider');

	nextStageDate = luxon.DateTime.fromISO(newValue.startTime);
});

setInterval(() => {
	const diff = Math.ceil(nextStageDate.diffNow(['minutes']).toObject().minutes);
	if (lastDiff !== diff) {
		lastDiff = diff;
		let newText;

		if (diff < 1) {
			newText = 'Next round begins soon!';
		} else if (diff === 1) {
			newText = `Next round begins in ~${diff} minute...`;
		} else {
			newText = `Next round begins in ~${diff} minutes...`;
		}

		setMainSceneText(newText, document.querySelector('#breakTimer'));
	}
}, 1000);
