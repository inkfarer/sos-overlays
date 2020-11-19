// Scene switching

const currentBreakScene = nodecg.Replicant('currentBreakScene', 'ipl-overlay-controls');

currentBreakScene.on('change', (newValue, oldValue) => {
	let mapsDelay = 0.3;

	if (oldValue === 'mainScene') {
		mapsDelay = 1.2;
	}

	switch (newValue) {
		case 'mainScene':
			showMainScene();
			hideAltBG();
			return;
		case 'nextUp':
			hideMainScene();
			showAltBG();
			toggleMaps(false);
			let animDelay = 0.6;
			if (oldValue === 'mainScene') animDelay = 1.2;
			toggleNextUp(true, animDelay);
			return;
		case 'maps':
			hideMainScene();
			showAltBG();
			toggleMaps(true, mapsDelay);
			toggleNextUp(false);
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

// Informative texts on main scene

function measureText(text, fontFamily, fontSize, maxWidth, useInnerHTML = false) {
	const measurer = document.createElement('div');
	measurer.classList.add('measurer');
	if (useInnerHTML) {
		measurer.innerHTML = text;
	} else {
		measurer.innerText = text;
	}
	measurer.style.fontFamily = fontFamily;
	measurer.style.fontSize = fontSize;

	document.body.appendChild(measurer);
	let width = measurer.getBoundingClientRect().width;
	measurer.parentNode.removeChild(measurer);
	if (width > maxWidth) { return maxWidth; }
	else { return width; }
}

const breakMainTextProps = {
	fontFamily: "'Dosis', 'Kosugi Maru', 'Roboto'",
	fontSize: '45px',
	maxWidth: 650
}

function setMainSceneText(text, elem, hasIcon = true, useInnerHTML = false) {
	let textWidth = measureText(text, breakMainTextProps.fontFamily, breakMainTextProps.fontSize, breakMainTextProps.maxWidth, useInnerHTML) + 20;

	let textElem = elem.querySelector('fitted-text');
	let bgElem = elem.querySelector('div.infoBoxBG');
	let bgWidth = hasIcon ? textWidth + 70 : textWidth;

	if (textElem.getAttribute('text') == text) return;

	let textTL = gsap.timeline();

	textTL.to(textElem, {duration: 0.5, opacity: 0, onComplete: function() {
		textElem.setAttribute('text', text);
	}});
	textTL.to(bgElem, {duration: 0.5, width: textWidth, ease: 'power2.inOut'}, 'a');
	textTL.to(elem, {duration: 0.5, width: bgWidth, ease: 'power2.inOut'}, 'a');
	textTL.to(textElem, {duration: 0.5, opacity: 1});
}

const mainFlavorText = nodecg.Replicant('mainFlavorText', 'ipl-overlay-controls');

mainFlavorText.on('change', newValue => {
	setMainSceneText(newValue, document.querySelector('#breakFlavorText'), false);
});

const casterNames = nodecg.Replicant('casterNames', 'ipl-overlay-controls');

casterNames.on('change', newValue => {
	let finalElem = newValue.replace(/\[\[/g, '<span class="pronoun">').replace(/\]\]/g, '</span>');
	setMainSceneText(finalElem, document.querySelector('#breakCasters'), true, true);
});

const nowPlaying = nodecg.Replicant('nowPlaying', 'ipl-overlay-controls');
const nowPlayingManual = nodecg.Replicant('nowPlayingManual', 'ipl-overlay-controls');
const mSongEnabled = nodecg.Replicant('mSongEnabled', 'ipl-overlay-controls');

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

NodeCG.waitForReplicants(nowPlaying, nowPlayingManual, mSongEnabled).then(() => {
	nowPlaying.on('change', newValue => {
		if (!mSongEnabled.value) {
			setMainSceneText(getSongNameString(newValue), document.querySelector('#breakMusic'));
		}
	});
	mSongEnabled.on('change', newValue => {
		var value;

		if (newValue) { value = nowPlayingManual.value; }
		else { value = nowPlaying.value; }

		setMainSceneText(getSongNameString(value), document.querySelector('#breakMusic'));
	});
	nowPlayingManual.on('change', newValue => {
		if (mSongEnabled.value) {
			setMainSceneText(getSongNameString(newValue), document.querySelector('#breakMusic'));
		}
	});
});

NodeCG.waitForReplicants(nowPlaying, nowPlayingManual, mSongEnabled).then(() => {
	nowPlaying.on('change', newValue => {
		if (!mSongEnabled.value) {
			
		}
	});
	mSongEnabled.on('change', newValue => {
		var value;

		if (newValue) { value = nowPlayingManual.value; }
		else { value = nowPlaying.value; }


	});
	nowPlayingManual.on('change', newValue => {
		if (mSongEnabled.value) {
			
		}
	});
});

const nextStageTime = nodecg.Replicant('nextStageTime', 'ipl-overlay-controls');

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
nextStageTime.on('change', newValue => {
	time = new Date();
	time.setDate(newValue.day);
	time.setHours(newValue.hour, newValue.minute, 0);
	time.setMonth(newValue.month);

	nextStageTimeObj = time;
});

function getGridRows(showTimer, showMusic) {
	let gridStyle = '4fr 1fr 1px 1fr';

	if (showTimer) {
		gridStyle += ' 1px 1fr';
	} else {
		gridStyle += ' 0px 0fr';
	}

	if (showMusic) {
		gridStyle += ' 1px 1fr';
	} else {
		gridStyle += ' 0px 0fr';
	}

	return gridStyle;
}

const NSTimerShown = nodecg.Replicant('NSTimerShown', 'ipl-overlay-controls');
const musicShown = nodecg.Replicant('musicShown', 'ipl-overlay-controls');

function animToggleInfo(showTimer, showMusic, infoElem, elemShown, divider) {
	let gridStyle = getGridRows(showTimer, showMusic), gridDelay, elemOpacity, elemDelay;
	if (elemShown) {
		elemOpacity = 1;
		elemDelay = 0.4;
		gridDelay = 0;
	} else {
		elemOpacity = 0;
		elemDelay = 0;
		gridDelay = 0.4;
	}

	gsap.to(divider, {duration: 0.5, opacity: elemOpacity, ease: 'power2.inOut'});
	gsap.to(infoElem, {duration: 0.5, opacity: elemOpacity, delay: elemDelay, ease: 'power2.inOut'});
	gsap.to('.mainSceneGrid', {duration: 0.5, gridTemplateRows: gridStyle, ease: 'power2.inOut', delay: gridDelay});
}

NodeCG.waitForReplicants(NSTimerShown, musicShown).then(() => {
	NSTimerShown.on('change', newValue => {
		animToggleInfo(newValue, musicShown.value, '#breakTimer', newValue, '#timeDivider');
	});

	musicShown.on('change', newValue => {
		animToggleInfo(NSTimerShown.value, newValue, '#breakMusic', newValue, '#musicDivider');
	});
});
	

// teams

const nextTeams = nodecg.Replicant('nextTeams', 'ipl-overlay-controls');

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

// Stages

const mapNameToImagePath = {"Ancho-V Games": "S2_Stage_Ancho-V_Games.png",
"Arowana Mall":"S2_Stage_Arowana_Mall.png",
"Blackbelly Skatepark":"S2_Stage_Blackbelly_Skatepark.png",
"Camp Triggerfish":"S2_Stage_Camp_Triggerfish.png",
"Goby Arena":"S2_Stage_Goby_Arena.png",
"Humpback Pump Track":"S2_Stage_Humpback_Pump_Track.png",
"Inkblot Art Academy":"S2_Stage_Inkblot_Art_Academy.png",
"Kelp Dome":"S2_Stage_Kelp_Dome.png",
"MakoMart":"S2_Stage_MakoMart.png",
"Manta Maria":"S2_Stage_Manta_Maria.png",
"Moray Towers":"S2_Stage_Moray_Towers.png",
"Musselforge Fitness":"S2_Stage_Musselforge_Fitness.png",
"New Albacore Hotel":"S2_Stage_New_Albacore_Hotel.png",
"Piranha Pit":"S2_Stage_Piranha_Pit.png",
"Port Mackerel":"S2_Stage_Port_Mackerel.png",
"Shellendorf Institute":"S2_Stage_Shellendorf_Institute.png",
"Shifty Station":"S2_Stage_Shifty_Station.png",
"Snapper Canal":"S2_Stage_Snapper_Canal.png",
"Starfish Mainstage":"S2_Stage_Starfish_Mainstage.png",
"Sturgeon Shipyard":"S2_Stage_Sturgeon_Shipyard.png",
"The Reef":"S2_Stage_The_Reef.png",
"Wahoo World":"S2_Stage_Wahoo_World.png",
"Walleye Warehouse":"S2_Stage_Walleye_Warehouse.png",
"Skipper Pavilion":"S2_Stage_Skipper_Pavilion.png",
"Unknown Map":"unnamed-unknown-map.png"};

const maplists = nodecg.Replicant('maplists', 'ipl-overlay-controls');

const currentMaplistID = nodecg.Replicant('currentMaplistID', 'ipl-overlay-controls');

const mapWinners = nodecg.Replicant('mapWinners', 'ipl-overlay-controls');

const SBData = nodecg.Replicant('SBData', 'ipl-overlay-controls');

function createMapListElems(maplist) {
	let stagesGrid = document.querySelector('.stagesGrid');
	gsap.to(stagesGrid, {duration: 0.5, opacity: 0, onComplete: function() {
		stagesGrid.innerHTML = '';
		stagesGrid.style.gridTemplateColumns = `repeat(${maplist.length - 1}, 1fr)`;

		let mapsHTML = '';
		let elemWidth = '260';
		let fontSize = '2.25em';
		let elemOpacity = '1';

		if (maplist.length === 4) {
			elemWidth = '380';
			stagesGrid.style.width = '1200px';
		} else if (maplist.length === 6) {
			elemWidth = '260';
			stagesGrid.style.width = '1400px';
			fontSize = '2.05em;'
		} else if (maplist.length === 8) { 
			elemWidth = '200';
			stagesGrid.style.width = '1600px';
			fontSize = '2em';
		}

		if (currentBreakScene.value === 'nextUp') { elemOpacity = '0'; }

		for (let i = 1; i < maplist.length; i++) {
			const element = maplist[i];
			let elem = `
			<div class="stageElem" style="opacity: ${elemOpacity}">
				<div class="stageImage" style="background-image: url('img/stages/${mapNameToImagePath[element.map]}');">
					<div class="stageWinner" id="stageWinner_${i}" style="opacity: 0"></div>
				</div>
				<div class="stageInfo">
					<div class="stageMode">
						<fitted-text text="${element.mode}" max-width="${elemWidth}" align="center"></fitted-text>
					</div>
					<div class="stageName" style="font-size: ${fontSize}">${element.map}</div>
				</div>
			</div>`

			mapsHTML += elem;
		}

		stagesGrid.innerHTML = mapsHTML;
		setWinners(mapWinners.value)		
	}});

	gsap.to(stagesGrid, {duration: 0.5, opacity: 1, delay: 0.5});
}

// returns true if there is a difference
function compareMapLists(val1, val2) {
	if (val1[0].id !== val2[0].id || val1[0].name !== val2[0].name) return true;
	if (val1.length !== val2.length) return true;
	for (let i = 1; i < val1.length; i++) {
		if (val1[i].map !== val2[i].map || val1[i].mode !== val2[i].mode) return true;
	}
	return false;
}

NodeCG.waitForReplicants(maplists, currentMaplistID, mapWinners).then(() => {
	currentMaplistID.on('change', newValue => {
		let maplist = maplists.value.filter(list => list[0].id == newValue)[0];

		createMapListElems(maplist);
	});

	maplists.on('change', (newValue, oldValue) => {
		if (!oldValue) return;
		let newCurrentList = newValue.filter(list => list[0].id == currentMaplistID.value)[0];
		let oldCurrentList = oldValue.filter(list => list[0].id == currentMaplistID.value)[0];

		if (compareMapLists(newCurrentList, oldCurrentList)) {
			createMapListElems(newCurrentList);
		}
	});
});

window.addEventListener('load', () => {
	NodeCG.waitForReplicants(mapWinners, SBData).then(() => {
		mapWinners.on('change', (newValue, oldValue) => {
			setWinners(newValue);
		});
		
		SBData.on('change', newValue => {
			setWinners(mapWinners.value);

			document.querySelector('#teamAName').setAttribute('text', newValue.teamAInfo.name);
			document.querySelector('#teamBName').setAttribute('text', newValue.teamBInfo.name);
		});
	});
});

function setWinners(val) {
	for (let i = 0; i < val.length; i++) {
		const element = val[i];
		if (element === 0) {
			setWinner(i+1, '', false);
		} else if (element === 1) {
			setWinner(i+1, SBData.value.teamAInfo.name, true);
		} else {
			setWinner(i+1, SBData.value.teamBInfo.name, true);
		}
	}
}

function setWinner(index, name, shown) {
	let winnerElem = document.querySelector(`#stageWinner_${index}`);
	if (!winnerElem) return;
	let opacity;

	if (shown) { opacity = 1; }
	else { opacity = 0 };
	
	if (shown) {
		winnerElem.innerText = name;
	}

	gsap.to(winnerElem, {opacity: opacity, duration: 0.5});
}

// Scoreboard on maps page

const teamScores = nodecg.Replicant('teamScores', 'ipl-overlay-controls');

teamScores.on('change', newValue => {
	document.querySelector('#teamAScore').setAttribute('text', newValue.teamA);
	document.querySelector('#teamBScore').setAttribute('text', newValue.teamB);
});

// Particles

function getRandomInt(min, max) {
	return Math.random() * (max - min) + min;
}

function makeParticles(count) {
	// Create particle and animate it
	let container = document.querySelector('.particles');
	for (let i = 0; i < count; i++) {
		let element = document.createElement('div');
		element.classList.add('particle');
		element.id = `particle_${i}`
		container.appendChild(element);
		makeParticleAnim(`particle_${i}`);
	}
}

makeParticles(25);

function makeParticleAnim(id) {
	// Animate particle with random position and size
	let size = getRandomInt(25, 100);
	let particle = document.querySelector(`#${id}`);
	particle.style.width = size + 'px';
	particle.style.height = size + 'px';
	particle.style.left = getRandomInt(0, 1920) + 'px';
	particle.style.opacity = '1';
	particle.style.transform = 'translate3d(0px, 0px, 0px)';
	let animDur = getRandomInt(5, 10);
	let opacDelay = animDur - 1.1;
	let XMovement = getRandomInt(25, 50);
	let wobbleSpeed = getRandomInt(3, 5);
	let repeatCount = Math.floor(animDur / wobbleSpeed);
	let wobbleTL = gsap.timeline({repeat: repeatCount});
	wobbleTL.fromTo(particle, {x: (XMovement * -1)}, {duration: wobbleSpeed, x: XMovement, ease: 'sine.inOut'});
	wobbleTL.to(particle, {duration: wobbleSpeed, x: (XMovement * -1), ease: 'sine.inOut'});
	gsap.fromTo(particle, {opacity: 1}, {duration: 1, opacity: 0, delay: opacDelay, ease: 'none'});
	gsap.fromTo(particle, {bottom: (size * -1), opacity: 1}, {duration: animDur, bottom: 980, ease: 'none', onComplete: () => {
		repeatParticleAnim(id);
	}});
}

function repeatParticleAnim(id) {
	makeParticleAnim(id);
}

// Hide team image

const teamImageHidden = nodecg.Replicant('teamImageHidden', 'ipl-overlay-controls');

teamImageHidden.on('change', newValue => {
	gsap.to('#teamAImage', {duration: 0.5, opacity: (newValue.teamA ? 0.25 : 0)});
	gsap.to('#teamBImage', {duration: 0.5, opacity: (newValue.teamB ? 0.25 : 0)});
});
