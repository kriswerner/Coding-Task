import '@testing-library/jest-dom';
import MyApp from './app.component';

describe('MyAppComponent', () => {
    it('Should have carousel data from json file', () => {
        expect(new MyApp().carouselData).not.toBeNull();
    });
});

describe('MyAppComponent', () => {
    it('Should build carousel slides and test child count', async () => {
        let myApp: MyApp = new MyApp();
        myApp.buildCarouselSlides(myApp.carouselData);
        expect(myApp.template!.content.querySelector('my-carousel')?.childElementCount).toBe(4);
    });
});