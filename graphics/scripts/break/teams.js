// teams

nextTeams.on('change', newValue => {
	nextTeamAName.setAttribute('text', newValue.teamAInfo.name);
	nextTeamBName.setAttribute('text', newValue.teamBInfo.name);

	teamAplayersBG.innerHTML = '';
	teamBplayersBG.innerHTML = '';

	newValue.teamAInfo.players.forEach(player => {
		const elem = createNextTeamPlayerElem(player.name, 'right', 'a');
		teamAplayersBG.appendChild(elem);
	});

	newValue.teamBInfo.players.forEach(player => {
		const elem = createNextTeamPlayerElem(player.name, 'left', 'b');
		teamBplayersBG.appendChild(elem);
	});

	teamAImage.style.backgroundImage = `url(${newValue.teamAInfo.logoUrl})`;
	teamBImage.style.backgroundImage = `url(${newValue.teamBInfo.logoUrl})`;
});

function createNextTeamPlayerElem(name, align, team) {
	const elem = document.createElement('fitted-text');
	elem.setAttribute('text', name);
	elem.setAttribute('max-width', '435');
	elem.setAttribute('align', align);
	if (team === 'a') {
		elem.classList.add('nextTeamAPlayer');
	} else {
		elem.classList.add('nextTeamBPlayer');
	}

	return elem;
}

// Hide team image

teamImageShown.on('change', newValue => {
	gsap.to('#teamAImage', {duration: 0.5, opacity: (newValue.teamA ? 0.25 : 0)});
	gsap.to('#teamBImage', {duration: 0.5, opacity: (newValue.teamB ? 0.25 : 0)});
});

// Scoreboard on maps page

teamScores.on('change', newValue => {
	document.querySelector('#teamAScore').setAttribute('text', newValue.teamA);
	document.querySelector('#teamBScore').setAttribute('text', newValue.teamB);
});
