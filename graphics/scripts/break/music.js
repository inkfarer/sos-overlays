function checkStringEmptyOrUndef(string) {
	string = String(string);
	return (string === 'undefined' || string === '');
}

function getSongNameString(rep) {
	if (checkStringEmptyOrUndef(rep.artist) && checkStringEmptyOrUndef(rep.song)) {return 'No song is playing.'}

	if (checkStringEmptyOrUndef(rep.artist)) { return rep.song; }
	else if (checkStringEmptyOrUndef(rep.song)) { return rep.artist; }

	return rep.artist + ' - ' + rep.song;
}

NodeCG.waitForReplicants(nowPlaying, manualNowPlaying, nowPlayingSource).then(() => {
	nowPlaying.on('change', newValue => {
		if (nowPlayingSource.value === "lastfm") {
			setMainSceneText(getSongNameString(newValue), document.querySelector('#breakMusic'));
		}
	});
	nowPlayingSource.on('change', newValue => {
		var value;

		if (newValue === 'manual') { value = manualNowPlaying.value; }
		else { value = nowPlaying.value; }

		setMainSceneText(getSongNameString(value), document.querySelector('#breakMusic'));
	});

	manualNowPlaying.on('change', newValue => {
		if (nowPlayingSource.value === 'manual') {
			setMainSceneText(getSongNameString(newValue), document.querySelector('#breakMusic'));
		}
	});
});

NodeCG.waitForReplicants(nowPlaying, manualNowPlaying, nowPlayingSource).then(() => {
	nowPlaying.on('change', newValue => {
		if (nowPlayingSource.value === "lastfm") {

		}
	});
	nowPlayingSource.on('change', newValue => {
		var value;

		if (newValue === 'manual') { value = manualNowPlaying.value; }
		else { value = nowPlaying.value; }


	});
	manualNowPlaying.on('change', newValue => {
		if (nowPlayingSource.value === 'manual') {

		}
	});
});

NodeCG.waitForReplicants(musicShown).then(() => {
	musicShown.on('change', newValue => {
		animToggleInfo(nextRoundStartTimeShown.value, newValue, '#breakMusic', newValue, '#musicDivider');
	});
});
