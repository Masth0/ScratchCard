# Scratchcard-js

ScratchCard is a js lib to simulate a scratchcard in browser with html5 and canvas.

## Install
You can install ScratchCard with npm:
```
npm install --save scratchcard-js
```
or just copy the file [scratchard.min.js](https://raw.githubusercontent.com/Masth0/ScratchCard/master/build/scratchcard.min.js)

## Import ScratchCard

```js
import { ScratchCard, SCRATCH_TYPE } from 'scratchcard-js';
// or
import 'scratchcard-js'; 
```

## Configuration
::: Tip
The first argument of the ScratchCard instance can be a string or an HTMLElement.
:::

```js{2}
const scContainer = document.getElementById('js--sc--container');
const sc = new ScratchCard(scContainer, {
    scratchType: SCRATCH_TYPE.LINE,
    containerWidth: scContainer.offsetWidth,
    containerHeight: 300,
    imageForwardSrc: '/images/scratchcard.jpg',
    imageBackgroundSrc: '/images/result.png',
    htmlBackground: '', // '<p>Html-content<p>'
    clearZoneRadius: 20,
    nPoints: 0,
    pointSize: 0,
    enabledPercentUpdate: true,
    percentToFinish: 50, // enabledPercentUpdate must to be true
    callback: function () {}
})
```

See the SCRATCH_TYPES in action: [Line](/brushes/line), [Spray](/brushes/spray), [Circle](/brushes/circle), [Brush](/brushes/brush)
| Name  | Type | Default value | Comment |
|---|---|---|---|
| **scratchType** | SCRATCH_TYPE | LINE | Possibles values : LINE, SPRAY, CIRCLE, BRUSH |
| **containerWidth** | number | 100 |  |
| **containerHeight** | number | 100 |  |
| **brushSrc** | string | "" | For SCRATCH_TYPE.BRUSH |
| **imageForwardSrc** | string | "" |  |
| **imageBackgroundSrc** | string | "" |  |
| **htmlBackground** | string | "" | <br> ``` `<p>Html-content<p>` ``` |
| **callback** | function | function() { alert('done.'); } |  |
| **clearZoneRadius** | number | 0 | For SCRATCH_TYPE.CIRCLE and SCRATCH_TYPE.LINE |
| **nPoints** | number | 30 | For SCRATCH_TYPE.SPRAY |
| **pointSize** | number | 4 | For SCRATCH_TYPE.SPRAY |
| **enabledPercentUpdate** | boolean | true | See **percentToFinish**|
| **percentToFinish** | number | 50 | Percentage of pixels to erase before clearing the canvas on mouseup |

## Initialization method
```js
sc.init().then(() => {
  // Do what you want
  // ex: listen scratch.move event
}).catch((error) => {
  // image not loaded
});
```

## Event:  scratch.move
```js
sc.canvas.addEventListener('scratch.move', () => {
  let percent = sc.getPercent();
  // ...
});
```
