"use strict";
class FittedText extends HTMLElement {
    constructor() {
        super();
        this.fittedContent = document.createElement('div');
        this.maxWidth = -1;
        this.text = '';
    }
    connectedCallback() {
        const align = this.getAttribute('align') || 'left';
        this.maxWidth = parseInt(this.getAttribute('max-width') || '-1');
        this.innerHTML = '';
        this.setAttribute('style', this.removeLineBreaks(`
			display: flex;
			position: relative;
			white-space: nowrap;
			max-width: ${this.maxWidth > 0 ? this.maxWidth + 'px' : 'unset'};
			justify-content: ${this.getJustify(align)}
		`));
        this.fittedContent.setAttribute('style', this.removeLineBreaks(`
			transform-origin: ${align} center;
			text-align: ${align};
		`));
        this.appendChild(this.fittedContent);
        this.setTransform();
    }
    static get observedAttributes() { return ['text', 'max-width', 'align']; }
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'text':
                this.fittedContent.innerText = newValue;
                this.setTransform();
                return;
            case 'max-width':
                if (oldValue) {
                    this.maxWidth = newValue;
                    this.style.maxWidth = `${this.maxWidth > 0 ? this.maxWidth + 'px' : 'unset'}`;
                    this.setTransform();
                }
                return;
            case 'align':
                this.style.justifyContent = this.getJustify(newValue);
                this.fittedContent.style.textAlign = newValue;
                this.fittedContent.style.transformOrigin = `${newValue} center`;
                return;
        }
    }
    setTransform() {
        if (this.maxWidth <= 0)
            return;
        const scrollWidth = this.fittedContent.scrollWidth;
        if (scrollWidth > this.maxWidth) {
            this.fittedContent.style.transform = `scaleX(${this.maxWidth / scrollWidth})`;
        }
        else {
            this.fittedContent.style.transform = 'scaleX(1)';
        }
    }
    getJustify(align) {
        switch (align) {
            case 'center':
                return 'center';
            case 'right':
                return 'flex-end';
            default:
                return 'unset';
        }
    }
    removeLineBreaks(input) {
        return input.replace(/\s+/g, ' ').trim();
    }
}
customElements.define('fitted-text', FittedText);
