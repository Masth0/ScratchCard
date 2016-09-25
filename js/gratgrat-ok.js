/*========================================================================
    Variables
========================================================================*/
var gratStart = ('ontouchstart' in document.documentElement) ? 'touchstart' : 'mousedown';
var gratMove = ('ontouchmove' in document.documentElement) ? 'touchmove' : 'mousemove';
var gratEnd = ('ontouchend' in document.documentElement) ? 'touchend' : 'mouseup';
var container = document.getElementById('js-game-container');
var image = document.getElementById('js-gratgrat-media');
var canvas = document.getElementById('js-gratgrat'),
    ctx = canvas.getContext('2d'),
    zone,
    timer,
    counter = 0,
    img = new Image();
img.src = './images/game/grat-base.png';


var containerOffsetLeft = getOffsetLeft(container);
var containerOffsetTop = getOffsetTop(container);

zone = canvas.getBoundingClientRect();

var won = document.body.getAttribute('data-won');

// On génère un nombre aléatoire selon une valeur minimum ou maximum
function randomPoint(min, max) {
  var random = Math.abs(Math.random()*(max - min) + min);
	return random = parseInt(random.toFixed(0), 10);
}

function getOffsetLeft( elem ) {
  var offsetLeft = 0;
  do {
    if ( !isNaN( elem.offsetLeft ) )
    {
      offsetLeft += elem.offsetLeft;
    }
  } while( elem = elem.offsetParent );
  return offsetLeft;
}

function getOffsetTop( elem ) {
  var offsetTop = 0;
  do {
    if ( !isNaN( elem.offsetTop ) )
    {
      offsetTop += elem.offsetTop;
    }
  } while( elem = elem.offsetParent );
  return offsetTop;
}
// On detecte le nombre de pixel éffacé pour savoir si le grattage est fini
function isFinish(value) {
  var finish = (value >= 400)? true: false ;
  return finish;
}

// On éfface par un pixel de façon aléatoire dans un périmètre voulu
function clearPoints(x1, y1) {
  var radius = 30;
  var x = Math.random() * 2 * radius - radius;
  var ylim = Math.sqrt(radius * radius - x * x);
  var y = Math.random() * 2 * ylim - ylim;
  x += 30;
  y += 30;

  x = parseInt(x);
  y = parseInt(y);

  return {
    x: x+x1,
    y: y+y1
  }
}

function setImage() {
  if(won) {
    image.setAttribute('src','./images/game/image-0.png');
  }else {
    var random = randomPoint(1,3);
    //console.log('random image === ' + random);
    image.setAttribute('src','images/game/image-'+ random +'.png');
  }
}

function getPosition(e) {

  if (gratStart === 'touchstart') {
    var posX = e.touches[0].clientX - 100 - 30;
    var posY =  e.touches[0].clientY - 139 - 30;
  } else {
    var posX = e.clientX - 100 - 30;
    var posY = e.clientY - 105 - 30;
  }

  return {
    x : posX,
    y : posY
  }
}
// On recupère la position et on applique la function clear
var grat = function(e) {
	e.preventDefault();

  containerOffsetLeft = getOffsetLeft(container);
  containerOffsetTop = getOffsetTop(container);
  var position = getPosition(e);
  var x = position.x - containerOffsetLeft;
  var y = position.y - containerOffsetTop + window.pageYOffset + 100;


  if(window.innerWidth <= 768) {
    var x = position.x - containerOffsetLeft;
    console.log(position.x, y);
  }


	var i = 0,
		len = 50;
	for(i; i<len; i++) {

    var points = clearPoints(x, y);
    var clearData = ctx.getImageData(points.x,points.y,5,5);
    ctx.clearRect(points.x, points.y, 10, 10);

    if(clearData.data[3] != 0) {
      counter++;
    }
  }

};

// Au chargement de la page on initialise
img.onload = function() {
  zone = canvas.getBoundingClientRect();
  // On dessine l'image une fois le DOM chargé
  ctx.drawImage(img, 0, 0);
  setImage();
};


document.addEventListener('DOMContentLoaded', function() {

  canvas.addEventListener(gratStart, function(e) {
    e.preventDefault();
    clearTimeout(timer);
    this.addEventListener(gratMove, grat, false);
  }, false);
  window.addEventListener(gratEnd, function() {
    canvas.removeEventListener(gratMove, grat);

    var finish = isFinish(counter);
    if(finish) {
      timer = setTimeout(function () {
        canvas.style.opacity = '0';
      }, 2000);
    }

  }, false);

}, false);

window.addEventListener('resize', function() {
  containerOffsetLeft = getOffsetLeft(container);
  containerOffsetTop = getOffsetTop(container);
}, false);

window.addEventListener('scroll', function() {
  containerOffsetLeft = getOffsetLeft(container);
  containerOffsetTop = getOffsetTop(container);
}, false);

