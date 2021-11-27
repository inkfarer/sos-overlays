// teams

activeRound.on('change', newValue => {
	nextTeamAName.setAttribute('text', newValue.teamA.name);
	nextTeamBName.setAttribute('text', newValue.teamB.name);

	teamAplayersBG.innerHTML = '';
	teamBplayersBG.innerHTML = '';

	newValue.teamA.players.forEach(player => {
		const elem = createNextTeamPlayerElem(player.name, 'right', 'a');
		teamAplayersBG.appendChild(elem);
	});

	newValue.teamB.players.forEach(player => {
		const elem = createNextTeamPlayerElem(player.name, 'left', 'b');
		teamBplayersBG.appendChild(elem);
	});

	teamAImage.style.backgroundImage = `url(${newValue.teamA.logoUrl})`;
	teamBImage.style.backgroundImage = `url(${newValue.teamB.logoUrl})`;

	gsap.to('#teamAImage', {duration: 0.5, opacity: (newValue.teamA.showLogo ? 0.25 : 0)});
	gsap.to('#teamBImage', {duration: 0.5, opacity: (newValue.teamB.showLogo ? 0.25 : 0)});
});

function createNextTeamPlayerElem(name, align, team) {
	const elem = document.createElement('fitted-text');
	elem.text = name;
	elem.maxWidth = 435;
	elem.align = align;
	if (team === 'a') {
		elem.classList.add('nextTeamAPlayer');
	} else {
		elem.classList.add('nextTeamBPlayer');
	}

	return elem;
}
