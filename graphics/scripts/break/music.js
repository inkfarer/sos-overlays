function getSongNameString(rep) {
	if (_.isEmpty(rep.artist) && _.isEmpty(rep.song)) {return 'No song is playing.'}

	if (_.isEmpty(rep.artist)) { return rep.song; }
	else if (_.isEmpty(rep.song)) { return rep.artist; }

	return rep.artist + ' - ' + rep.song;
}

nowPlaying.on('change', newValue => {
	setMainSceneText(getSongNameString(newValue), document.querySelector('#breakMusic'));
});

NodeCG.waitForReplicants(musicShown, nextRoundTime).then(() => {
	musicShown.on('change', newValue => {
		animToggleInfo(nextRoundTime.value.isVisible, newValue, '#breakMusic', newValue, '#musicDivider');
	});
});
