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
