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

	if (textElem.getAttribute('text') === text) return;

	let textTL = gsap.timeline();

	textTL.to(textElem, {duration: 0.5, opacity: 0, onComplete: function() {
			textElem.setAttribute('text', text);
		}});
	textTL.to(bgElem, {duration: 0.5, width: textWidth, ease: 'power2.inOut'}, 'a');
	textTL.to(elem, {duration: 0.5, width: bgWidth, ease: 'power2.inOut'}, 'a');
	textTL.to(textElem, {duration: 0.5, opacity: 1});
}

mainFlavorText.on('change', newValue => {
	setMainSceneText(newValue, document.querySelector('#breakFlavorText'), false);
});

casters.on('change', newValue => {
	let finalElem = ''
	// Form new casters line from objects
	Object.keys(newValue).forEach((item, index, arr) => {
		const element = newValue[item];  // Get caster from object
		if (index > 0 && index < (arr.length-1)){ finalElem += ` , ` }
		else if(index > 0){ finalElem += ` & ` }
		finalElem += `${element.twitter}<span class="pronoun">${element.pronouns}</span>`
	});
	setMainSceneText(finalElem, document.querySelector('#breakCasters'), true, true);
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
