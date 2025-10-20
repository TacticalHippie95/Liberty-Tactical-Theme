import 'slick-carousel';

let masterCarousel = [];
let mobileImgs = [];
let desktopImgs = [];
let resizeTimeout;
let isCurrentlyMobile = null;

export default function () {
    let defaultCarousel = null;

    window.addEventListener('load', () => {
        const carouselElement = document.querySelector('.heroCarousel');
        if (!carouselElement) {
            return;
        }
        defaultCarousel = carouselElement.cloneNode(true);
        setTimeout(checkAndBuildCarousel, 500);
    });

    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(checkAndBuildCarousel, 500);
    });

    function checkAndBuildCarousel() {
        if (!defaultCarousel) {
            return;
        }

        const isMobile = window.innerWidth < 800;

        if (isMobile !== isCurrentlyMobile) {
            isCurrentlyMobile = isMobile;
            buildCarousel(defaultCarousel, isMobile);
        }
    }

    const buildCarousel = (defaultCarousel, isMobile) => {
        const carousel = removeDuplicateSlides(defaultCarousel);
        masterCarousel = carousel;

        if (desktopImgs.length === 0 || mobileImgs.length === 0) {
            desktopImgs = getDesktopImages(carousel);
            mobileImgs = getMobileImages(defaultCarousel);
        }

        if (mobileImgs.length === 0) {
            return;
        }

        let finalCarousel;
        const carouselHTML = document.querySelector('.heroCarousel');
        const holder = document.querySelector('.heroCarousel-holder');

        if (!holder) {
            return;
        }

        if (isMobile) {
            finalCarousel = buildSlider(mobileImgs, masterCarousel);
        } else {
            finalCarousel = buildSlider(desktopImgs, masterCarousel);
        }

        if (carouselHTML && $(carouselHTML).hasClass('slick-initialized')) {
            $(carouselHTML).slick('unslick');
            carouselHTML.remove();
        }

        holder.appendChild(finalCarousel);
        $(finalCarousel).slick();
    };

    function removeDuplicateSlides(carousel) {
        const slides = carousel.querySelectorAll('.slick-slide:not(.slick-cloned)[data-hero-slide]');
        const newDiv = document.createElement('div');
        newDiv.classList.add('heroCarousel');

        slides.forEach(slide => {
            newDiv.appendChild(slide);
        });

        return newDiv;
    }

    function getMobileImages(carousel) {
        const mobileImgData = carousel.dataset.mobileimg;

        if (mobileImgData) {
            return mobileImgData.split('|').map(img => `/images/stencil/original/image-manager/${img}`);
        } else {
            return [];
        }
    }

    function getDesktopImages(carousel) {
        const images = [];
        const imgElements = carousel.querySelectorAll('img');

        imgElements.forEach(img => {
            img.removeAttribute('srcset');
            images.push(img.src);
        });

        return images;
    }

    function buildSlider(images, masterCarousel) {
        const slides = masterCarousel.querySelectorAll('.slick-slide:not(.slick-cloned) img');

        slides.forEach((slide, index) => {
            slide.removeAttribute('srcset');
            if (images[index]) {
                slide.src = images[index];
            }
        });

        return masterCarousel;
    }
}
