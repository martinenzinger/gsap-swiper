## gsap-swiper
<br><br>
depends on gsap v3 and the Draggable plugin (included in [free license](https://greensock.com/standard-license/))
<br>
```bash
npm install --save gsap # yarn add gsap
```
<br><br>

![gsap-swiper](https://github.com/martinenzinger/gsap-swiper/raw/main/images/gsap-swiper.png "gsap-swiper")

<br><br>

```bash
npm install --save gsap-swiper # yarn add gsap-swiper
```

<br>

```js
import { Swiper } from "gsap-swiper";

const swiper = new Swiper('.swiper-container', true, 2);
swiper.initSwiper();
```

<br>

>new Swiper(<br>
>&emsp;&emsp;**container** = '.swiper-container',<br>
>&emsp;&emsp;**autoPlay** = true,<br>
>&emsp;&emsp;**slideDelay** = 3,<br>
>&emsp;&emsp;**slideDuration** = 0.3,<br>
>&emsp;&emsp;**wrapper** = '.swiper-inner',<br>
>&emsp;&emsp;**slide** = '.swiper-slide',<br>
>&emsp;&emsp;**pagination** = '.swiper-pagination',<br>
>&emsp;&emsp;**paginationBullet** = '.swiper-pagination-bullet',<br>
>&emsp;&emsp;**paginationBulletSVG** = ''  // SVG string<br>
>&emsp;)


<br>

```css
.section--swiper {
    position: relative;
    margin: 10% auto;
    width: 80%;
    height: 220px;
    max-width: 900px;
    box-shadow: 0 10px 20px 0 rgb(0 0 0 / 5%);
}

.swiper-container {
    position: relative;
    width: 100%;
    height: 100%;
    background: #000;
    background-image: linear-gradient(30deg, #000, #222);
    box-shadow: 0 10px 20px 0 rgb(0 0 0 / 5%);
    border-radius: 12px;
    overflow: hidden;
}

.swiper-inner {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.swiper-inner .swiper-slide {
    position: absolute;
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
}

.swiper-pagination {
    position: absolute;
    left: 20px;
    bottom: 10px;
    display: inline-block;
    width: auto;
}

.swiper-pagination-bullet {
    display: inline-block;
    animation-play-state: paused;
    stroke-dasharray: 0 100%;
}

.swiper-pagination-bullet svg {
    pointer-events: none;
}

.swiper-pagination-bullet svg circle {
    pointer-events: none;
}

.swiper-pagination-bullet.path {
    stroke-dasharray: 0 100%;
    stroke-dashoffset: 0;
    animation-iteration-count: 1;
    animation-play-state: running;
    animation-name: dash;
}

@keyframes dash {
    from {
        stroke-dasharray: 0 100%;
    }

    to {
        stroke-dasharray: 100% 0;
    }
}
```

<br><br>

### If you can use the Inertia plugin: [Codepen - Draggable Auto-Slider](https://codepen.io/GreenSock/pen/GRJwLNP)

<br><br><br><br><br>
