// Scene switching

const currentBreakScene = nodecg.Replicant('currenBreakScene', { defaultValue: 'mainScene' });

currentBreakScene.on('change', (newValue, oldValue) => {
	var bgMarginLeft, scenesLeft;
	var animDuration = 1;

	if (oldValue === 'maps' && newValue === 'nextUp' || oldValue === 'nextUp' && newValue === 'maps') {
		animDuration = 2;
	}

	switch(newValue) {
		case 'mainScene':
			toggleTopBar(0, false);
			bgMarginLeft = -2320;
			scenesLeft = -1920;
			break;
		case 'nextUp':
			toggleTopBar(0, true);
			showTeamsScene(animDuration);
			break;
		case 'maps':
			toggleTopBar(0, true);
			bgMarginLeft = -200;
			scenesLeft = 0;
	}

	gsap.to('.background', {left: bgMarginLeft, ease: 'power2.inOut', duration: animDuration});
	gsap.to('.breakScenes', {left: scenesLeft, ease: 'power2.inOut', duration: animDuration});
});

function showTeamsScene(animDuration) {
	let teamAPlayers = document.querySelectorAll('.nextTeamAPlayer');
	let teamBPlayers = document.querySelectorAll('.nextTeamBPlayer');

	for (let i = 0; i < teamAPlayers.length; i++) {
		element = teamAPlayers[i];

		element.style.opacity = '0';
		gsap.to(element, {opacity: 1, duration: 0.25, delay: (i * 0.05) + (animDuration * 0.9)});
	};

	for (let j = 0; j < teamBPlayers.length; j++) {
		element = teamBPlayers[j];

		element.style.opacity = '0';
		gsap.to(element, {opacity: 1, duration: 0.25, delay: (j * 0.05) + (animDuration * 0.9)});
	};

	var bgMarginLeft = -4440;
	var scenesLeft = -3840;

	gsap.to('.background', {left: bgMarginLeft, ease: 'power2.inOut', duration: animDuration});
	gsap.to('.breakScenes', {left: scenesLeft, ease: 'power2.inOut', duration: animDuration});
};

// INSANE background animation
// generate background elements

for (let i = 1; i <= 6; i++) {
	const bgTile = document.createElement('div');
	bgTile.classList.add('bgTextContainer');

	var tileTextValue, textLineClass, reverseTextLineClass;

	if (i % 2 === 1) {
		bgTile.classList.add('blueBgText');
		tileTextValue = 'UNNAMED ';
		textLineClass = 'textAnimUnnamed';
		reverseTextLineClass = 'reverseTextAnimUnnamed';
	} else {
		bgTile.classList.add('greenBgText');
		tileTextValue = 'TOURNAMENT ';
		textLineClass = 'textAnimTournament';
		reverseTextLineClass = 'reverseTextAnimTournament';
	}

	for (let j = 1; j <= 8; j++) {
		const textLine = document.createElement('p');
		textLine.innerText = tileTextValue.repeat(5);
		if (j % 2 === 1) {
			textLine.classList.add(textLineClass);
		} else {
			textLine.classList.add(reverseTextLineClass);
		}
		bgTile.appendChild(textLine);
	}

	document.querySelector('.background').appendChild(bgTile);
}

// animate

let bgTextAnimTL = gsap.timeline({repeat: -1});

const bgTextAnimDuration = 30;

bgTextAnimTL.to('.textAnimUnnamed', {marginLeft: -300, ease: 'none', duration: bgTextAnimDuration}, 'woo');
bgTextAnimTL.to('.reverseTextAnimUnnamed', {marginLeft: -700, ease: 'none', duration: bgTextAnimDuration}, 'woo');

bgTextAnimTL.to('.textAnimTournament', {marginLeft: -960, ease: 'none', duration: bgTextAnimDuration}, 'woo');
bgTextAnimTL.to('.reverseTextAnimTournament', {marginLeft: -40, ease: 'none', duration: bgTextAnimDuration}, 'woo');

// Informative texts on main scene

function measureText(text, fontFamily, fontSize, maxWidth) {
	const measurer = document.createElement('div');
	measurer.classList.add('measurer');
	measurer.innerText = text;
	measurer.style.fontFamily = fontFamily;
	measurer.style.fontSize = fontSize;

	document.body.appendChild(measurer);
	let width = measurer.getBoundingClientRect().width;
	measurer.parentNode.removeChild(measurer);
	if (width > maxWidth) { return maxWidth; }
	else { return width; }
}

const breakMainTextProps = {
	fontFamily: 'Roboto Condensed',
	fontSize: '45px',
	maxWidth: 650
}

function setMainSceneText(text, elem) {
	let textWidth = measureText(text, breakMainTextProps.fontFamily, breakMainTextProps.fontSize, breakMainTextProps.maxWidth) + 20;

	let textElem = elem.querySelector('fitted-text');
	let bgElem = elem.querySelector('div.mainInfoBG');

	if (textElem.getAttribute('text') == text) return;

	let textTL = gsap.timeline();

	textTL.to(textElem, {duration: 0.5, opacity: 0, onComplete: function() {
		textElem.setAttribute('text', text);
	}});
	textTL.to([bgElem, elem], {duration: 0.5, width: textWidth, ease: 'power2.inOut'});
	textTL.to(textElem, {duration: 0.5, opacity: 1});
}

const mainFlavorText = nodecg.Replicant('mainFlavorText', { defaultValue: 'Be right back!' });
mainFlavorText.on('change', newValue => {
	setMainSceneText(newValue, document.querySelector('#mainFlavorText'));
	setMainSceneText(newValue, document.querySelector('#breakTopLeftInfo'));
});

const casterNames = nodecg.Replicant('casterNames', { defaultValue: "We don't know." });
casterNames.on('change', newValue => {
	setMainSceneText(newValue, document.querySelector('#mainCasters'));
});

const nowPlaying = nodecg.Replicant('nowPlaying');
const nowPlayingManual = nodecg.Replicant('nowPlayingManual', {
    defaultValue: {
        artist: '',
        song: ''
    }
});
const mSongEnabled = nodecg.Replicant('mSongEnabled', {defaultValue: false});

function getSongNameString(rep) {
	if (rep.artist === '' || rep.artist === undefined) { return rep.song; }
	else if (rep.song === '' || rep.song === undefined) { return rep.artist; }

	if (rep.artist === '' || rep.artist === undefined && rep.song === '' || rep.song === undefined) {return 'No song is playing.'}
	else { return rep.artist + ' - ' + rep.song; }	
}

NodeCG.waitForReplicants(nowPlaying, nowPlayingManual, mSongEnabled).then(() => {
	nowPlaying.on('change', newValue => {
		if (!mSongEnabled.value) {
			setMainSceneText(getSongNameString(newValue), document.querySelector('#mainMusic'));
		}
	});
	mSongEnabled.on('change', newValue => {
		var value;

		if (newValue) { value = nowPlayingManual.value; }
		else { value = nowPlaying.value; }

		setMainSceneText(getSongNameString(value), document.querySelector('#mainMusic'));
	});
	nowPlayingManual.on('change', newValue => {
		if (mSongEnabled.value) {
			setMainSceneText(getSongNameString(newValue), document.querySelector('#mainMusic'));
		}
	});
});

const nextStageTime = nodecg.Replicant('nextStageTime', {defaultValue: {
    hour: 0,
    minute: 0,
    day: 1,
    month: 0
}});

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
		setMainSceneText(newText, document.querySelector('#mainTimer'));
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

// hiding stuff

function hideMainElem(elem) {
	let elemWidth = elem.getBoundingClientRect().width + 80;
	elem = elem.parentNode;
	elem.style.maxWidth = elemWidth + 'px';
	gsap.to(elem, {opacity: 0, duration: 0.75, ease: 'power2.inOut'});
	gsap.to(elem, {maxWidth: 0, duration: 0.75, ease: 'power2.inOut', delay: 0.6});
}

function showMainElem(elem) {
	// SCARY overcomplicated code that took me HOURS
	// ensures that the animation is always smooth no matter how the element moves
	let elemWidth = elem.getBoundingClientRect().width + 80;
	let proxy = {progress: 0};
	gsap.to(elem.parentNode, {opacity: 1, duration: 0.75, ease: 'power2.inOut', delay: 0.6});
	gsap.to(proxy, {progress: 1, duration: 0.75, ease: 'power2.inOut', onComplete: function() {
		elem.parentNode.style.maxWidth = '1000px';
	}, onUpdate: function() {
		elemWidth = elem.getBoundingClientRect().width + 80;
		elem.parentNode.style.maxWidth = elemWidth * proxy.progress + 'px';
	}});
}

const NSTimerShown = nodecg.Replicant('NSTimerShown', {defaultValue: false});
const musicShown = nodecg.Replicant('musicShown', { defaultValue: true });

musicShown.on('change', newValue => {
	if (newValue) {
		showMainElem(document.querySelector('#mainMusic'));
	} else {
		hideMainElem(document.querySelector('#mainMusic'));
	}
});

NSTimerShown.on('change', newValue => {
	if (newValue) {
		showMainElem(document.querySelector('#mainTimer'));
	} else {
		hideMainElem(document.querySelector('#mainTimer'));
	}
});

// teams

const nextTeams = nodecg.Replicant('nextTeams', {defaultValue: {
	teamAInfo: {
		name: "Placeholder Team 1",
		players: [
			{name:"You should fix this before going live."}
		]
	},
	teamBInfo: {
		name: "Placeholder Team 2",
		players: [
			{name:"You should fix this before going live."}
		]
	}
}});

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

const maplists = nodecg.Replicant('maplists', {
    defaultValue: [
        [
            { id: 0, name: "Default map list" },
            { map: "Ancho-V Games", mode: "Clam Blitz" },
            { map: "Ancho-V Games", mode: "Tower Control" },
            { map: "Wahoo World", mode: "Rainmaker" }
        ]
    ]
});

const currentMaplistID = nodecg.Replicant('currentMaplistID', { defaultValue: '0' });

const mapWinners = nodecg.Replicant('mapWinners', { defaultValue: [0, 0, 0, 0, 0, 0, 0] });

const SBData = nodecg.Replicant('SBData', {defaultValue: {
	flavorText: 'Flavor Text',
	teamAInfo: {
		name: "Placeholder Team 1",
		players: [
			{name:"You should fix this before going live."}
		]
	},
	teamAColor: 'Green',
	teamBInfo: {
		name: "Placeholder Team 2",
		players: [
			{name:"You should fix this before going live."}
		]
	},
	teamBcolor: 'Purple'
}});

function createMapListElems(maplist) {
	let stagesGrid = document.querySelector('.stagesGrid');
	gsap.to(stagesGrid, {duration: 0.5, opacity: 0, onComplete: function() {
		stagesGrid.innerHTML = '';
		stagesGrid.style.gridTemplateColumns = `repeat(${maplist.length - 1}, 1fr)`;
		
		let mapsHTML = '';
		let elemWidth = '260';
		if (maplist.length === 4) { elemWidth = '496'; }
		else if (maplist.length === 6) { elemWidth = '260'; }
		else if (maplist.length === 8) { elemWidth = '187'; }

		for (let i = 1; i < maplist.length; i++) {
			const element = maplist[i];
			let elem = `
			<div class="stageElem">
				<div class="stageImage" style="background-image: url('img/stages/${mapNameToImagePath[element.map]}')">
					<div class="stageWinner" id="stageWinner_${i}" style="opacity: 0"></div>
				</div>
				<div class="stageInfo">
					<div class="stageMode">
						<fitted-text text="${element.mode}" max-width="${elemWidth}" align="center"></fitted-text>
					</div>
					<div class="stageName">${element.map}</div>
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

		console.log(newCurrentList);
		console.log(oldCurrentList);
		console.log(compareMapLists(newCurrentList, oldCurrentList));

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

// top bar

const topBarTL = gsap.timeline();

function setTopBarTextLoop() {
	for (let i = 0; i < 2; i++) {
		if (i === 0) {
			setTopBarText(casterNames.value, document.querySelector('#breakTopRightInfo'), 'img/microphone.svg', false);
		} else if (i === 1) {
			var songName;

			if (mSongEnabled.value) {
				songName = getSongNameString(nowPlayingManual.value);
			} else {
				songName = getSongNameString(nowPlaying.value);
			}

			setTopBarText(songName, document.querySelector('#breakTopRightInfo'), 'img/music.svg', true);
		}
	}
}

function setTopBarText(text, elem, icon, repeat) {
	let textWidth = measureText(text, breakMainTextProps.fontFamily, breakMainTextProps.fontSize, 800) + 20;

	let textElem = elem.querySelector('fitted-text');
	let bgElem = elem.querySelector('div.mainInfoBG');
	let iconElem = elem.querySelector('div.mainInfoIcon img');

	topBarTL.add(gsap.to([textElem, iconElem], {duration: 0.5, opacity: 0, onComplete: function() {
		textElem.setAttribute('text', text);
		iconElem.src = icon;
	}}, 'hide'))
	.add(gsap.to([bgElem, elem], {duration: 0.5, width: textWidth, ease: 'power2.inOut'}))
	.add(gsap.to([textElem, iconElem], {duration: 0.5, opacity: 1}, 'show'))
	.add(gsap.to({}, 10, {}));
	if (repeat) {
		topBarTL.to({}, {duration: 0.01, onComplete: function() {
			setTopBarTextLoop();
		}});
	}
}

NodeCG.waitForReplicants(nowPlaying, nowPlayingManual, mSongEnabled).then(() => {
	setTopBarTextLoop();
});

function toggleTopBar(delay, shown) {
	var styleTop;

	if (shown) { styleTop = 15; }
	else { styleTop = -100; }

	gsap.to('.breakTopBar', {top: styleTop, duration: 0.5, ease: 'power2.inOut', delay: delay});
}
