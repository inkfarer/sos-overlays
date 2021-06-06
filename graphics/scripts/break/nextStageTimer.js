var nextStageInterval = setInterval(() => {
	const now = new Date();
	const diff = new Date(nextStageTimeObj - now);
	const diffMinutes = Math.ceil(diff / (1000 * 60));
	if (lastDiff !== diffMinutes) {
		lastDiff = diffMinutes;
		var newText;
		if (diffMinutes < 1) {
			newText = 'Next round begins soon!';
		} else if (diffMinutes == 1) {
			newText = `Next round begins in ~${diffMinutes} minute...`;
		} else {
			newText = `Next round begins in ~${diffMinutes} minutes...`;
		}
		setMainSceneText(newText, document.querySelector('#breakTimer'));
	}
}, 1000);

var lastDiff;
var nextStageTimeObj;

nextRoundTime.on('change', newValue => {
	time = new Date();
	time.setDate(newValue.day);
	time.setHours(newValue.hour, newValue.minute, 0);
	time.setMonth(newValue.month-1);

	nextStageTimeObj = time;
});
