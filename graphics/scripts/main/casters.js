// Caster names

casters.on('change', newValue => {
	const castersHeight = Object.keys(newValue).length * 40;
	gsap.set('div.castersWrapper > .castersBG', {height: castersHeight});

	let bg = document.querySelector('.castersBG');
	let elemHtml = '';

	Object.keys(newValue).forEach((item, index, arr) => {
		const element = newValue[item];  // Get caster from object
		// Build new object and append to list
		elemHtml += `
		<div class="caster">
			<div class="caster-name">
				<fitted-text text="${element.name} <span class=&quot;pronoun&quot;>${element.pronouns}</span>" useInnerHTML max-width="235"></fitted-text>
			</div>
			<div class="caster-twitter">
				<fitted-text text="${element.twitter} <span class=&quot;pronoun&quot;>${element.pronouns}</span>" useInnerHTML max-width="235"></fitted-text>
			</div>
		</div>`
	});

	bg.innerHTML = elemHtml;
});

// Caster name animation
const castersShowTl = gsap.timeline();

nodecg.listenFor('mainShowCasters', DASHBOARD_BUNDLE_NAME, () => {
	const showDuration = 20;
	castersShowTl.add(gsap.set('.caster > .caster-twitter', {opacity: 0}))
		.add(gsap.set('.caster > .caster-name', {opacity: 1}))
		.add(gsap.fromTo('.castersWrapper', {opacity: 0, y: -15}, {duration: 0.35, y: 0, opacity: 1, ease: 'power2.out'}))
		.add(gsap.to({}, {duration: showDuration}))
		.add(gsap.to('.caster > .caster-twitter', {opacity: 1, duration: 0.35}), `-=${showDuration / 2}`)
		.add(gsap.to('.caster > .caster-name', {opacity: 0, duration: 0.35}), `-=${showDuration / 2}`)
		.add(gsap.to('.castersWrapper', {duration: 0.5, y: 15, opacity: 0, delay: 10.65, ease: 'power2.in'}));
});
