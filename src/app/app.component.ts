import html from "./app.component.html";
import css from "./app.component.scss";
import data from "./../assets/carousel-data.json";
import "./carousel/carousel.component";

class MyApp extends HTMLElement {
    private template: HTMLTemplateElement | undefined;
    private carouselTemplate: HTMLTemplateElement;
    private carouselData = data;

    constructor() {
        super();

        // Create a shadow root element
        const shadowRoot: ShadowRoot = this.attachShadow({ mode: 'open' });

        // Create template element from imported html and transpiled scss
        this.template = document.createElement('template');
        this.template!.innerHTML = `<style>${css}</style>${html}`;

        // Load and remove carousel html template
        this.carouselTemplate = this.template!.content.querySelector("#carousel__slide")! as HTMLTemplateElement;
        this.template!.content.querySelector('template')!.remove();

        // build carousel slides and append them to the shadow root
        this.buildCarouselSlides(this.carouselData);
        shadowRoot.appendChild(this.template!.content.cloneNode(true));
    }

    // build the carousel slides using the html template and data from json object
    private buildCarouselSlides(data: any) {
        data.products.forEach((product: any) => {
            const carouselSlide = this.carouselTemplate!.content.cloneNode(true) as HTMLElement;
            carouselSlide.querySelector('img')!.src = product.images[0];
            carouselSlide.querySelector('h1')!.innerText = product.title;
            carouselSlide.querySelector('p')!.innerText = product.description;
            this.template!.content.querySelector('my-carousel')!.append(carouselSlide!);
        });
    }
}

customElements.define('my-app', MyApp);