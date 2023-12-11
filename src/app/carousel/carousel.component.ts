import html from "./carousel.component.html"
import css from "./carousel.component.scss";

export default class MyCarousel extends HTMLElement {
    carouselContainer: HTMLElement;
    carouselPagination: HTMLElement;
    carouselSlides: Array<Element> | undefined;
    interval: number = 5000;
    intervalID: any;
    currentSlideIndex: number | undefined = 1;
    activeTransition: boolean | undefined;
    startTranslatePosition: number | undefined;
    currentTranslatePosition: number | undefined;
    isDragging: boolean = false;
    grabbing: boolean = false;

    constructor() {
        super();

        // Create a shadow root element and append html template and css to it
        const shadowRoot: ShadowRoot = this.attachShadow({ mode: 'open' });
        const template: HTMLTemplateElement = document.createElement('template');
        template.innerHTML = `<style>${css}</style>${html}`;
        shadowRoot.appendChild(template.content.cloneNode(true));

        // Create carousel container
        this.carouselContainer = shadowRoot.querySelector('.carousel__slides')!;
        this.carouselPagination = shadowRoot.querySelector('.carousel__pagination')!;

        // Add child nodes to carousel slides
        this.carouselSlides = Array.from(this.children);
        this.carouselSlides.forEach((slide) => {
            this.carouselContainer.append(slide);
            const pagination = document.createElement('div');
            pagination.classList.add('carousel__pagination__item');
            const paginationProgress = document.createElement('div');
            paginationProgress.classList.add('carousel__pagination__progress');
            const paginationProgressBar = document.createElement('div');
            paginationProgressBar.classList.add('carousel__pagination__progress__bar');
            paginationProgress.append(paginationProgressBar);
            pagination.append(paginationProgress);
            this.carouselPagination.append(pagination);
        });

        // Add event listener for mobile and desktop touch events
        this.carouselContainer?.addEventListener('touchstart', (event) => this.touchStart(event));
        this.carouselContainer?.addEventListener('touchend', () => this.touchEnd());
        this.carouselContainer?.addEventListener('touchmove', (event) => this.touchMove(event));
        this.carouselContainer?.addEventListener('mousedown', (event) => this.touchStart(event));
        this.carouselContainer?.addEventListener('mouseup', () => this.touchEnd());
        this.carouselContainer?.addEventListener('mouseleave', () => this.touchEnd());
        this.carouselContainer?.addEventListener('mousemove', (event) => this.touchMove(event));

        // Add event listener for prev/next buttons
        shadowRoot.querySelector('.carousel__button--prev')?.addEventListener('click', this.prevSlide.bind(this));
        shadowRoot.querySelector('.carousel__button--next')?.addEventListener('click', this.nextSlide.bind(this));

        // Disable context menu
        document.addEventListener('contextmenu', event => {
            event.preventDefault();
            event.stopPropagation();
        });
    }

    connectedCallback() {
        this.updatePagination();
        this.updateCarousel(true);
        this.resetCarouselInterval();
    }

    // Transition to the next slide
    nextSlide() {
        if (!this.activeTransition) {
            this.resetCarouselInterval();

            // increase slide id and update pagination
            this.increaseSlideID();
            this.updatePagination();

            // Start transition
            this.activeTransition = true;
            this.carouselContainer.style.transition = 'transform 0.5s cubic-bezier(.6,0,.4,1)';
            this.carouselContainer.style.transform = `translateX(-200%)`;

            setTimeout(() => {
                // Reset the transition
                this.carouselContainer.style.transition = 'none';
                this.carouselContainer.style.transform = `translateX(-100%)`;

                // Move first element to last position in DOM tree
                const firstElem = this.carouselContainer.firstElementChild;
                this.carouselContainer.append(firstElem!);
                this.activeTransition = false;
                this.updateCarousel(false);
            }, 500);
        }
    }

    // Transition to the previous slide
    prevSlide() {
        if (!this.activeTransition) {
            this.resetCarouselInterval();

            // decrease slide id and update pagination
            this.decreaseSlideID();
            this.updatePagination();

            // Start transition
            this.activeTransition = true;
            this.carouselContainer.style.transition = 'transform 0.5s cubic-bezier(.6,0,.4,1)';
            this.carouselContainer.style.transform = `translateX(0%)`;

            setTimeout(() => {
                // Reset the transition
                this.carouselContainer.style.transition = 'none';
                this.carouselContainer.style.transform = `translateX(-100%)`;

                // Move last element to first position in DOM tree
                const lastElem = this.carouselContainer.lastElementChild;
                this.carouselContainer.prepend(lastElem!);
                this.activeTransition = false;
                this.updateCarousel(true);
            }, 500);
        }
    }

    // Transition back to current slide
    private resetSlide() {
        // Start transition
        this.activeTransition = true;
        this.carouselContainer.style.transition = 'transform 0.4s cubic-bezier(.6,0,.4,1)';
        this.carouselContainer.style.transform = `translateX(-100%)`;

        setTimeout(() => {
            // Reset transition
            this.carouselContainer.style.transition = 'none';
            this.activeTransition = false;
        }, 400);
    }

    // Update cloned slide positions depending on previous slide direction
    private updateCarousel(prev: boolean) {
        this.carouselContainer.querySelectorAll('.cloned').forEach(el => el.remove());
        if (prev) {
            const cloneElem = this.carouselContainer.lastElementChild!.cloneNode(true) as HTMLElement;
            cloneElem.classList.add('cloned');
            this.carouselContainer.prepend(cloneElem);
        } else {
            const cloneElem = this.carouselContainer.firstElementChild!.cloneNode(true) as HTMLElement;
            this.carouselContainer.append(cloneElem);
            this.carouselContainer.firstElementChild!.classList.add('cloned');
        }
    }

    // Update carousel pagination state
    private updatePagination() {
        setTimeout(() => {
            Array.from(this.carouselPagination.children).forEach((elem) => {
                elem.classList.remove('active');
            });
            this.carouselPagination.children[this.currentSlideIndex!-1].classList.add('active');
        }, 0);
    }

    private increaseSlideID() {
        if (this.currentSlideIndex! < this.carouselSlides!.length) {
            this.currentSlideIndex!++;
        } else {
            this.currentSlideIndex = 1;
        }
    }

    private decreaseSlideID() {
        if (this.currentSlideIndex == 1) {
            this.currentSlideIndex = this.carouselSlides?.length;
        } else {
            this.currentSlideIndex!--;
        }
    }

    // Reset the carousel interval
    private resetCarouselInterval() {
        clearInterval(this.intervalID);
        this.intervalID = setInterval(() => {
            this.nextSlide();
        }, this.interval);
    }

    // TouchStart event handling
    private touchStart(event: any) {
        this.isDragging = true;
        this.startTranslatePosition = this.getPositionX(event);
    }

    // TouchMove event handling
    private touchMove(event: any) {
        if (this.isDragging) {
            this.grabbing = true;
            
            // calculate current translate position and apply it to carousel slides container
            this.currentTranslatePosition = this.getPositionX(event) - this.startTranslatePosition! - this.clientWidth;
            this.carouselContainer.style.transform = `translateX(${this.currentTranslatePosition}px)`;
        }
    }

    // TouchEnd event handling
    private touchEnd() {
        this.isDragging = false;
        if (this.grabbing) {
            let offsetX = this.clientWidth + this.currentTranslatePosition!;
            if (offsetX < 0) {
                // if offset is greater then 1/3 of the screen width make
                // transiton to next slide else reset to the current one
                if (offsetX*-1 > this.clientWidth/3) {
                    this.nextSlide();
                } else {
                    this.resetSlide();
                }
            }
            if (offsetX > 0) {
                // if offset is greater then 1/3 of the screen width make
                // transiton to previous slide else reset to the current one
                if (offsetX > this.clientWidth/3) {
                    this.prevSlide();
                } else {
                    this.resetSlide();
                }
            }
            this.grabbing = false;
        }
    }

    // get position x from touch event depending on input type
    private getPositionX(event: any) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }
}

customElements.define('my-carousel', MyCarousel);