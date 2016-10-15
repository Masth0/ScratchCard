# ScratchCard
ScratchCard is a library javascript to generate scratch card (HTML5, canvas)
in modern browsers with touch events support. Here the demo page: [**DEMO**] (https://masth0.github.io/ScratchCard/)

## Options
- **canvasId :** Id string of canvas
- **canvasWidth :** Canvas width
- **canvasHeight :** Canvas height
- **imageBackground :** Path to background image
- **pictureOver :** Path to foreground image
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
    
## Javascript init

```
var scratch = new Scratch({
	canvasId: 'js-scratch-canvas',
	imageBackground: '/path/to/image',
	pictureOver: '/path/to/image',
	canvasWidth: 250,
	canvasHeight: 250,
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

[MIT License](LICENSE.md). © Masth0 *(Thomas Wallerich)*