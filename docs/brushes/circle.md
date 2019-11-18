# Circle

<brush-circle></brush-circle>
  
## Javascript
```js
const scContainer = document.getElementById('js--sc--container')
const scInfos = document.querySelector('.sc__infos');
const sc = new ScratchCard('#js--sc--container', {
  scratchType: SCRATCH_TYPE.CIRCLE,
  containerWidth: scContainer.offsetWidth,
  containerHeight: 300,
  imageForwardSrc: '/images/scratchcard.jpg',
  imageBackgroundSrc: '/images/result.png',
  htmlBackground: '<p class="test"><strong>Hello i am HTML content !</strong></p>',
  clearZoneRadius: 20,
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
    let percent = sc.getPercent().toFixed(0);
    scInfos.innerHTML = percent + '%';
    console.log(percent)
  })
}).catch((error) => {
  // image not loaded
  alert(error.message);
});
```
