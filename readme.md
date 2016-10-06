#Work in progress...

# ScratchCard
ScratchCard is a library javascript to generate scratch card (HTML5, canvas)
in modern browsers with touch events support. Here the demo page: [https://masth0.github.io/ScratchCard/] (https://masth0.github.io/ScratchCard/)

## Options
- **canvasId :** Id string of canvas
- **imageBackground :** Path to background image
- **pictureOver :** Path to foreground image
- **sceneWidth :** Canvas width
- **sceneHeight :** Canvas height
- **radius :** Radius of clear zone 
- **nPoints :** Number of points generate inside the clear zone
- **pointSize :** {  
	**x :** Number,  
	**y :** Number  
	} 
- **percent :** When clear the canvas after 'mouseup' event
- **callback :** Function executed after canvas clearing
- **cursor :** {  
	        **png :** // Path to the .png for modern browsers  
	        **x :** // Move position x  
	        **y :** // Move position y  
	        **cur :** // Path to the .cur for internet explorer  
    }
    
## Jvascript init

```
var scratch = new Scratch({
	canvasId: 'js-scratch-canvas',
	imageBackground: '/path/to/image',
	pictureOver: '/path/to/image',
	sceneWidth: 250,
	sceneHeight: 250,
	cursor: {
		png: '/path/to/cursor.png',
		cur: '/path/to/cursor.cur',
		x: '20',
		y: '17'
	},
	radius: 20,
	nPoints: 100,
	percent: 50,
	callback: function () {
		alert('I am Callback.');
	},
	pointSize: { x: 3, y: 3}
});
```
