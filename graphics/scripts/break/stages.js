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
	"Unknown Stage":"unnamed-unknown-map.png"};

function createMapListElems(maplist) {
	let stagesGrid = document.querySelector('.stagesGrid');
	gsap.to(stagesGrid, {duration: 0.5, opacity: 0, onComplete: function() {
			stagesGrid.innerHTML = '';
			stagesGrid.style.gridTemplateColumns = `repeat(${maplist.length}, 1fr)`;

			let mapsHTML = '';
			let elemWidth = '260';
			let fontSize = '2.25em';
			let elemOpacity = '1';

			if (maplist.length === 3) {
				elemWidth = '380';
				stagesGrid.style.width = '1200px';
			} else if (maplist.length === 5) {
				elemWidth = '260';
				stagesGrid.style.width = '1400px';
				fontSize = '2.05em;'
			} else if (maplist.length === 7) {
				elemWidth = '200';
				stagesGrid.style.width = '1600px';
				fontSize = '2em';
			}

			if (activeBreakScene.value === 'teams') { elemOpacity = '0'; }

			for (let i = 0; i < maplist.length; i++) {
				const element = maplist[i];
				let elem = `
			<div class="stageElem" style="opacity: ${elemOpacity}">
				<div class="stageImage" style="background-image: url('img/stages/${mapNameToImagePath[element.stage]}');">
					<div class="stageWinner" id="stageWinner_${i}" style="opacity: 0"></div>
				</div>
				<div class="stageInfo">
					<div class="stageMode">
						<fitted-text text="${element.mode}" max-width="${elemWidth}" align="center"></fitted-text>
					</div>
					<div class="stageName" style="font-size: ${fontSize}">${element.stage}</div>
				</div>
			</div>`

				mapsHTML += elem;
			}

			stagesGrid.innerHTML = mapsHTML;
			setWinners(gameWinners.value)
		}});

	gsap.to(stagesGrid, {duration: 0.5, opacity: 1, delay: 0.5});
}

// returns true if there is a difference
function roundsDiffer(val1, val2) {
	if (val1.length !== val2.length) return true;
	for (let i = 0; i < val1.length; i++) {
		if (val1[i].stage !== val2[i].stage || val1[i].mode !== val2[i].mode) return true;
	}
	return false;
}

NodeCG.waitForReplicants(rounds, activeRound, gameWinners).then(() => {
	activeRound.on('change', newValue => {
		let maplist = rounds.value[newValue]['games']

		createMapListElems(maplist);
	});

	rounds.on('change', (newValue, oldValue) => {
		if (!oldValue) return;

		let newCurrentList = newValue[activeRound.value]['games'];
		let oldCurrentList = oldValue[activeRound.value]['games'];

		console.log(roundsDiffer(newCurrentList, oldCurrentList))
		if (roundsDiffer(newCurrentList, oldCurrentList)) {
			createMapListElems(newCurrentList);
		}
	});
});

window.addEventListener('load', () => {
	NodeCG.waitForReplicants(gameWinners, scoreboardData).then(() => {
		gameWinners.on('change', (newValue, oldValue) => {
			setWinners(newValue);
		});

		scoreboardData.on('change', newValue => {
			setWinners(gameWinners.value);

			document.querySelector('#teamAName').setAttribute('text', newValue.teamAInfo.name);
			document.querySelector('#teamBName').setAttribute('text', newValue.teamBInfo.name);
		});
	});
});

function setWinners(val) {
	for (let i = 0; i < val.length; i++) {
		const element = val[i];
		if (element === 0) {
			setWinner(i, '', false);
		} else if (element === 1) {
			setWinner(i, scoreboardData.value.teamAInfo.name, true);
		} else {
			setWinner(i, scoreboardData.value.teamBInfo.name, true);
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
