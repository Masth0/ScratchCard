# Scratchcard-js 
![Build](https://travis-ci.org/Masth0/ScratchCard.svg?branch=v2)
![version](https://img.shields.io/npm/v/scratchcard-js.svg)

ScratchCard is a js lib to simulate a scratchcard in browser with html5 and canvas.

You can see the [**demo page**](https://masth0.github.io/ScratchCard/).

## Install
You can install ScratchCard with npm:
```
npm install --save scratchcard-js
```
or just clone this repo:
```
git clone https://github.com/Masth0/ScratchCard.git
```
and pick in the folder **./build** the file **scratchard.min.js**

## Getting started

```js
import {ScratchCard, SCRATCH_TYPE} from 'scratchcard-js'

const scContainer = document.getElementById('js--sc--container')
const sc = new ScratchCard('#js--sc--container', {
  scratchType: SCRATCH_TYPE.SPRAY,
  containerWidth: scContainer.offsetWidth,
  containerHeight: 300,
  imageForwardSrc: '/images/scratchcard.jpg',
  imageBackgroundSrc: '/images/result.png',
  htmlBackground: '<p class="test"><strong>Hello i am HTML content !</strong></p>',
  clearZoneRadius: 50,
  nPoints: 30,
  pointSize: 4,
  callback: function () {
    alert('Now the window will reload !')
    window.location.reload()
  }
})

// Init
sc.init().then(() => {
  sc.canvas.addEventListener('scratch.move', () => {
    let percent = sc.getPercent().toFixed(2)
    console.log(percent)
  })
}).catch((error) => {
  // image not loaded
  alert(error.message);
});
```

## Events
**'scratch.move'**
```js
sc.canvas.addEventListener('scratch.move', function() {
  let percent = sc.getPercent();
  console.log(percent);
});
```
