import { gsap, Power1 } from "gsap";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(Draggable);

export class Swiper {

    container: string;
    autoPlay: boolean;
    slideDelay: number;
    slideDuration: number;
    wrapper: string;
    slide: string;
    pagination: string;
    paginationBullet: string;
    paginationBulletSVG: string;

    slideAnimation: gsap.core.Tween;
    animation: gsap.core.Tween;
    timer: gsap.core.Tween;
    draggable: Draggable;
    proxy: HTMLElement;
    slideWidth = 0;
    wrapWidth = 0;
    numSlides = 0;
    slides: Array<HTMLElement> = [];
    paginationBullets: Array<HTMLElement> = [];

    constructor(
        container = '.swiper-container',
        autoPlay = true,
        slideDelay = 3,
        slideDuration = 0.3,
        wrapper = '.swiper-inner',
        slide = '.swiper-slide',
        pagination = '.swiper-pagination',
        paginationBullet = '.swiper-pagination-bullet',
        paginationBulletSVG?: string
    ) {
        this.container = container;
        this.autoPlay = autoPlay;
        this.slideDelay = slideDelay;
        this.slideDuration = slideDuration;
        this.wrapper = wrapper;
        this.slide = slide;
        this.pagination = pagination;
        this.paginationBullet = paginationBullet;
        this.paginationBulletSVG = paginationBulletSVG || '<svg class="fp-arc-loader" width="16" height="16" viewBox="0 0 16 16">' +
            '<circle class="path" cx="8" cy="8" r="5.5" fill="none" transform="rotate(-90 8 8)" stroke="#FFF"' +
            'stroke-opacity="1" stroke-width="1.5px"></circle>' +
            '<circle cx="8" cy="8" r="3" fill="#FFF"></circle>' +
            '</svg>';
        this.slideAnimation = gsap.to({}, {});
        this.animation = gsap.to({}, {});
        this.timer = gsap.to({}, {});
        this.proxy = document.createElement("div");
        this.draggable = new Draggable(this.proxy, {});
    }

    public initSwiper(): void {
        this.slides = Array.from(document.querySelectorAll(this.slide));
        const pagination: HTMLElement | null = document.querySelector(this.pagination);
        this.numSlides = this.slides.length;
        for (let i = 0; i < this.numSlides; i++) {
            gsap.set(this.slides[i], {
                //backgroundColor: '#' + ((0.05 + 0.95 * Math.random()) * 0xFFFFFF << 0).toString(16),
                xPercent: i * 100
            });
            if (pagination) {
                pagination.appendChild(this.addPaginationBullet(i, this.paginationBullet.substr(1), this.slideDelay));
            }
        }
        this.paginationBullets = Array.from(document.querySelectorAll(this.paginationBullet));
        if (this.autoPlay) {
            this.timer = gsap.delayedCall(this.slideDelay, () => this.slideAutoPlay());
        }
        this.animation = gsap.to(this.slides, {
            duration: this.slideDuration,
            xPercent: "+=" + (this.numSlides * 100),
            ease: "none",
            paused: true,
            repeat: -1,
            modifiers: {
                xPercent: gsap.utils.wrap(-100, (this.numSlides - 1) * 100)
            }
        });
        gsap.set(this.proxy, { x: 0 });
        this.slideAnimation = gsap.to({}, { duration: 0.1 });
        this.resize();
        this.draggable = new Draggable(this.proxy, {
            trigger: ".swiper-container",
            throwProps: true,
            onPress: () => this.updateDraggable(),
            onDrag: () => this.updateProgress(),
            onDragEnd: () => this.updateThrow(),
            onThrowUpdate: () => this.updateProgress(),
            snap: {
                x: gsap.utils.snap(this.slideWidth)
            }
        });
        window.addEventListener("resize", () => this.resize);
    }

    public updateDraggable(): void {
        this.timer.restart(true);
        this.slideAnimation.kill();
        this.draggable.update();
    }

    public updateProgress(): void {
        this.animation.progress(gsap.utils.wrap(0, 1, Number(gsap.getProperty(this.proxy, "x")) / this.wrapWidth));
        gsap.set(this.proxy, { x: Number(gsap.getProperty(this.proxy, "x")) % this.wrapWidth });
    }

    public updateThrow(): void {
        switch (this.draggable.getDirection('velocity')) {
            case 'left':
                this.animateSlides(-1);
                break;
            case 'right':
                this.animateSlides(+1);
                break;
        }
    }

    public animateSlides(direction: number): void {
        const nr = this.slideNr(Number(gsap.getProperty(this.proxy, "x")) + direction * this.slideWidth);
        this.startBulletAnimation(nr);
        this.animateToSlide(nr);
    }

    public paginationToSlide(nr: number): void {
        this.startBulletAnimation(nr);
        this.animateToSlide(nr);
    }

    public startBulletAnimation(nr: number): void {
        if (this.paginationBullets) {
            [].forEach.call(this.paginationBullets, (el: HTMLElement) => {
                el.classList.remove('path');
            });
            this.paginationBullets[(nr <= 0 ? (-1 * nr) : (this.numSlides - nr)) % this.numSlides].classList.add('path');
        }
    }

    public animateToSlide(slideNr: number): void {
        this.timer.restart(true);
        this.slideAnimation.kill();
        const x = (slideNr * this.slideWidth);
        this.slideAnimation = gsap.to(this.proxy, {
            duration: this.slideDuration,
            x: x,
            onUpdate: () => this.updateProgress(),
            ease: Power1.easeOut
        });
    }

    public slideAutoPlay(): void {
        if (this.draggable.isDragging || this.draggable.isThrowing) {
            this.timer.restart(true);
        } else {
            this.animateSlides(-1);
        }
    }

    public resize(): void {
        const norm = (Number(gsap.getProperty(this.proxy, "x")) / this.wrapWidth) || 0;
        this.slideWidth = this.slides[0].offsetWidth;
        this.wrapWidth = this.slideWidth * this.numSlides;
        gsap.set(this.proxy, {
            x: norm * this.wrapWidth
        });
        this.animateSlides(0);
        this.slideAnimation.progress(1);
    }

    public slideNr(x: number): number {
        return Math.round(x / this.slideWidth);
    }

    public addPaginationBullet(index: number, className: string, delay: number): HTMLElement {
        const element: HTMLElement = document.createElement('span');
        element.className = className;
        element.dataset.nr = (-1 * index).toString();    // 3s linear 0s 1 normal none running dash
        element.style.animationDuration = delay + 's';
        const that = this;
        element.addEventListener('click', function (event) {
            if (event.target instanceof HTMLElement) {
                const slideNr = parseInt(event.target.dataset.nr || '');
                that.paginationToSlide(slideNr);
            }
        });
        element.innerHTML = this.paginationBulletSVG;
        return element;
    }
}

export default Swiper;
