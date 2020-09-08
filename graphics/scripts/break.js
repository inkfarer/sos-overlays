// Scene switching

const currentBreakScene = nodecg.Replicant('currenBreakScene', { defaultValue: 'mainScene' });

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
	fontFamily: "'Dosis', 'Kosugi Maru', 'Roboto'",
	fontSize: '45px',
	maxWidth: 650
}

function setMainSceneText(text, elem, hasIcon = true) {
	let textWidth = measureText(text, breakMainTextProps.fontFamily, breakMainTextProps.fontSize, breakMainTextProps.maxWidth) + 20;

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

const mainFlavorText = nodecg.Replicant('mainFlavorText', { defaultValue: 'Be right back!' });

mainFlavorText.on('change', newValue => {
	setMainSceneText(newValue, document.querySelector('#breakFlavorText'), false);
});

const casterNames = nodecg.Replicant('casterNames', { defaultValue: "We don't know." });

casterNames.on('change', newValue => {
	setMainSceneText(newValue, document.querySelector('#breakCasters'));
});

const nowPlaying = nodecg.Replicant('nowPlaying');
const nowPlayingManual = nodecg.Replicant('nowPlayingManual', {
    defaultValue: {
        artist: '',
        song: ''
    }
});
const mSongEnabled = nodecg.Replicant('mSongEnabled', {defaultValue: false});

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

const NSTimerShown = nodecg.Replicant('NSTimerShown', {defaultValue: false});
const musicShown = nodecg.Replicant('musicShown', { defaultValue: true });

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

		
	});

	maplists.on('change', (newValue, oldValue) => {
		if (!oldValue) return;
		let newCurrentList = newValue.filter(list => list[0].id == currentMaplistID.value)[0];
		let oldCurrentList = oldValue.filter(list => list[0].id == currentMaplistID.value)[0];

		if (compareMapLists(newCurrentList, oldCurrentList)) {
			
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
			
		} else if (element === 1) {
			
		} else {
			
		}
	}
}

function setWinner(index, name, shown) {
	
}
