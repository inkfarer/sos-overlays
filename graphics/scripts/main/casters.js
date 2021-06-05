// Caster names

casters.on('change', newValue => {
	let bg = document.querySelector('.castersBG');
	bg.innerHTML = '';

	Object.keys(newValue).forEach((item, index, arr) => {
		const element = newValue[item];  // Get caster from object
		// Build new object and append to list
		let elem = document.createElement('fitted-text');
		let htmlText = `${element.twitter} <span class="pronoun">${element.pronouns}</span>`
		elem.setAttribute('text', htmlText);
		elem.setAttribute('max-width', '230');
		elem.setAttribute('align', 'left');
		elem.setAttribute('useInnerHTML', '');

		bg.appendChild(elem);
	});
});

// Caster name animation

nodecg.listenFor('mainShowCasters', DASHBOARD_BUNDLE_NAME, () => {
	gsap.fromTo('.castersWrapper', {opacity: 0, y: -25}, {duration: 0.5, y: 0, opacity: 1, ease: 'power2.out'});
	gsap.to('.castersWrapper', {duration: 0.5, y: 25, opacity: 0, delay: 15.5, ease: 'power2.in'});
});
