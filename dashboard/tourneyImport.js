const tourneyData = nodecg.Replicant('tourneyData', {
	defaultValue: [
		{tourneySlug: "none", tourneyName: 'none'},
		{
			name: "Placeholder Team 1",
			players: [
				{name:"You should fix this before going live."}
			]
		},
		{
			name: "Placeholder Team 2",
			players: [
				{name:"You should fix this before going live."}
			]
		}
	]
});

tourneyData.on('change', newValue => {
	// fill out tourney info thing
	if (newValue[0].tourneySlug && newValue[0].tourneyName) {
		document.querySelector('#nowLoadedSlug').innerText = newValue[0].tourneySlug;
		document.querySelector('#nowLoadedName').innerText = newValue[0].tourneyName;
	}
});

const query = `query Entrants($slug: String!, $page: Int!, $perPage: Int!) {
	tournament(slug: $slug) {
	id
	name
	teams(query: {
		page: $page
		perPage: $perPage
	}) {
		pageInfo {
		total
		totalPages
		}
		nodes {
		id
		name
		entrant {
			id
			participants {
			id
			gamerTag
			}
		}
		}
	}
	}
}`

document.querySelector('#tourneySubmit').onclick = async () => {
	setStatusLoading();
	var slug = document.querySelector('#tourneySlugInput').value;
	let page = '1';
	let perPage = '50';

	if (!nodecg.bundleConfig || typeof nodecg.bundleConfig.smashgg === 'undefined') {
		console.error('Api key is not defined in bundle config.');
		setStatusFailure();
		return;
	}

	let token = nodecg.bundleConfig.smashgg.apiKey;

	fetch('https://api.smash.gg/gql/alpha', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			'Authorization': `Bearer ${token}`
		},
		body: JSON.stringify({
			query,
			variables: {slug, page, perPage}
		})
	})
	.then(r => r.json())
	.then(async (data) => {
		// Create initial tournament array with tourney info
		let tourneyInfo = [{
			tourneySlug: slug, tourneyName: data.data.tournament.name
		}];
		
		// Add info of teams to array
		for (let i = 0; i < data.data.tournament.teams.nodes.length; i++) {
			let teamPlayers = [];
			const element = data.data.tournament.teams.nodes[i];

			// if 'entrant' is null, the team's registration is incomplete... they are dead to us
			if (!element.entrant) continue;

			for (let j = 0; j < element.entrant.participants.length; j++) {
				const teamPlayer = element.entrant.participants[j];
				teamPlayers.push({
					name: teamPlayer.gamerTag
				});
			}
			tourneyInfo.push({
				name: element.name,
				players: teamPlayers,
			});
		}

		// if there are more pages, add them to our data set
		if (data.data.tournament.teams.pageInfo.totalPages > 1) {
			console.log(data.data.tournament.teams.pageInfo.totalPages);
			for (let i = 2; i <= data.data.tournament.teams.pageInfo.totalPages; i++) {
				let pageInfo = await getAdditionalPage(i);
				tourneyInfo = tourneyInfo.concat(pageInfo);
			}
		}

		// we did it
		tourneyData.value = tourneyInfo;
		setStatusSuccess();
	})
	.catch(err => {
		setStatusFailure();
		console.error(err);
	});
};

async function getAdditionalPage(page) {
	var slug = document.querySelector('#tourneySlugInput').value;
	let perPage = '50';
	let token = nodecg.bundleConfig.smashgg.apiKey;

	return new Promise((resolve, reject) => {
		fetch('https://api.smash.gg/gql/alpha', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': `Bearer ${token}`
			},
			body: JSON.stringify({
				query,
				variables: {slug, page, perPage}
			})
		})
		.then(r => r.json())
		.then(data => {
			let pageInfo = [];
			for (let i = 0; i < data.data.tournament.teams.nodes.length; i++) {
				let teamPlayers = [];
				const element = data.data.tournament.teams.nodes[i];

				if (!element.entrant) continue;

				for (let j = 0; j < element.entrant.participants.length; j++) {
					const teamPlayer = element.entrant.participants[j];
					teamPlayers.push({
						name: teamPlayer.gamerTag
					});
				}
				pageInfo.push({
					name: element.name,
					players: teamPlayers,
				});
			}
			resolve(pageInfo);
		})
		.catch(e => {
			console.error(e);
			reject(e)
			setStatusFailure();
		});
	});
}

document.querySelector('#tourneySlugInput').addEventListener('input', (event) => {
	if (event.target.value === tourneyData.value[0].tourneySlug) {
		loadedDisplay.style.backgroundColor = "var(--green)";
	} else {
		loadedDisplay.style.backgroundColor = "#181E29";
	}
})

function setStatusLoading() {
	let status = document.querySelector('#submitStatus');
	status.style.backgroundColor = "var(--yellow)";
	status.style.color = "#000";
	status.innerText = "LOADING";
}

function setStatusSuccess() {
	let status = document.querySelector('#submitStatus');
	status.style.backgroundColor = "var(--green)";
	status.style.color = "#fff";
	status.innerText = "SUCCESS";
}

function setStatusFailure() {
	let status = document.querySelector('#submitStatus');
	status.style.backgroundColor = "var(--red)";
	status.style.color = "#fff";
	status.innerText = "FAIL";
}