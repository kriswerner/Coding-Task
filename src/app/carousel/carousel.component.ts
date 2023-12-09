import html from "./carousel.component.html"
import css from "./carousel.component.scss";

class MyCarousel extends HTMLElement {

    constructor() {
        super();

        // Create a shadow root element and append html template and css to it
        const shadowRoot: ShadowRoot = this.attachShadow({ mode: 'open' });
        const template: HTMLTemplateElement = document.createElement('template');
        template.innerHTML = `<style>${css}</style>${html}`;
        shadowRoot.appendChild(template.content.cloneNode(true));
    }
}

customElements.define('my-carousel', MyCarousel);