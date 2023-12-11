import '@testing-library/jest-dom';
import MyCarousel from './carousel.component';

describe('MyApp', () => {
    it('Carousel should start with slider index 1', () => {
        let myCarousel: MyCarousel = new MyCarousel();
        expect(myCarousel.currentSlideIndex).toBe(1);
    });
});