import html from "./app.component.html";
import css from "./app.component.scss";
import "./carousel/carousel.component";

class AppComponent extends HTMLElement {

    constructor() {
        super();

        // Create a shadow root element and append html template and css to it
        const shadowRoot: ShadowRoot = this.attachShadow({ mode: 'open' });
        const template: HTMLTemplateElement = document.createElement('template');
        template.innerHTML = `<style>${css}</style>${html}`;
        shadowRoot.appendChild(template.content.cloneNode(true));
    }
}

customElements.define('my-app', AppComponent);