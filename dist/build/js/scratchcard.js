(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["ScratchCard"] = factory();
	else
		root["ScratchCard"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = __webpack_require__(1);
var ScratchEvent;
(function (ScratchEvent) {
    ScratchEvent[ScratchEvent["ScratchStart"] = 0] = "ScratchStart";
    ScratchEvent[ScratchEvent["Scratch"] = 1] = "Scratch";
    ScratchEvent[ScratchEvent["ScratchEnd"] = 2] = "ScratchEnd";
})(ScratchEvent || (ScratchEvent = {}));
var ScratchCard = /** @class */ (function () {
    function ScratchCard(selector, config) {
        var self = this;
        this.config = Object.assign({}, config);
        this.scratchType = this.config.scratchType;
        this.container = document.querySelector(selector);
        this.position = [0, 0]; // init position
        this.readyToClear = false;
        // Add canvas in container
        this.init();
        // debug
        var cursorDebug = document.getElementById('js-debug-cursor');
        var scratching = utils_1.throttle(function (event) {
            self.position = self.mousePosition(event);
            self.scratch();
            // calculate the percent of area scratched.
            self.percent = self.getPercent();
            if (self.percent >= 50) {
                self.clear();
                self.canvas.style.pointerEvents = 'none';
                if (self.config.callback !== undefined) {
                    self.config.callback();
                }
            }
        }, 16);
        this.canvas.addEventListener('mousedown', function (event) {
            self.canvas.addEventListener('mousemove', scratching);
            document.body.addEventListener('mouseup', function _func() {
                self.canvas.removeEventListener('mousemove', scratching);
                this.removeEventListener('mouseup', _func);
            });
        });
    }
    ScratchCard.prototype.init = function () {
        var _this = this;
        this.generateCanvas();
        this.ctx = this.canvas.getContext('2d');
        this.zone = this.canvas.getBoundingClientRect();
        console.log(this.zone);
        utils_1.loadImage(this.config.imageForwardSrc).then(function (img) {
            _this.ctx.drawImage(img, 0, 0);
            _this.setBackground();
        }, function (event) {
            // Stop all script here
            console.log(event);
        });
    };
    ScratchCard.prototype.generateCanvas = function () {
        this.canvas = document.createElement('canvas');
        this.canvas.classList.add('sc__canvas');
        // Add canvas into container
        this.container.appendChild(this.canvas);
        this.canvas.width = this.container.clientWidth;
        this.canvas.height = this.container.clientHeight;
    };
    ScratchCard.prototype.setBackground = function () {
        var _this = this;
        var image = document.createElement('img');
        utils_1.loadImage(this.config.imageBackgroundSrc).then(function (img) {
            image.src = img.src;
            _this.container.insertBefore(image, _this.canvas);
        }, function (event) {
            // Stop all script here
            console.log(event);
        });
    };
    ;
    ScratchCard.prototype.mousePosition = function (event) {
        var posX, posY;
        switch (event.type) {
            case 'touchmove':
                posX = event.touches[0].clientX - (this.config.clearZoneRadius / 2) - window.pageXOffset - this.zone.left;
                posY = event.touches[0].clientY - (this.config.clearZoneRadius / 2) - window.pageYOffset - this.zone.top;
            case 'mousemove':
                posX = event.clientX - this.config.clearZoneRadius - window.pageXOffset - this.zone.left;
                posY = event.clientY - this.config.clearZoneRadius - window.pageYOffset - this.zone.top;
                break;
        }
        return [posX, posY];
    };
    ScratchCard.prototype.clearPoint = function (posX, posY) {
        var radius = this.config.clearZoneRadius;
        var x = Math.random() * 2 * radius - radius;
        var ylim = Math.sqrt(radius * radius - x * x);
        var y = Math.random() * 2 * ylim - ylim;
        x += radius;
        y += radius;
        x += posX;
        y += posY;
        return [x, y];
    };
    ScratchCard.prototype.scratch = function () {
        var x = this.position[0];
        var y = this.position[1];
        var i = 0;
        var len = this.config.nPoints;
        for (i; i < len; i++) {
            var points = this.clearPoint(x, y);
            this.ctx.clearRect(points[0], points[1], this.config.pointSize[0], this.config.pointSize[1]);
        }
    };
    ScratchCard.prototype.brush = function () {
    };
    ScratchCard.prototype.getPercent = function () {
        var percent;
        var counter = 0; // number of pixels clear
        var imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        var imageDataLength = imageData.data.length;
        for (var i = 0; i < imageDataLength; i += 4) {
            if (imageData.data[i] === 0 && imageData.data[i + 1] === 0 && imageData.data[i + 2] === 0 && imageData.data[i + 3] === 0) {
                counter++;
            }
        }
        if (counter >= 1) {
            percent = (counter / (this.canvas.width * this.canvas.height)) * 100;
        }
        else {
            percent = 0;
        }
        return percent;
    };
    /**
     * Just clear the canvas
     */
    ScratchCard.prototype.clear = function () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };
    return ScratchCard;
}());
exports.default = ScratchCard;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Return a random number in range
 * @param min {Number}
 * @param max {Number}
 */
function randomPoint(min, max) {
    var random = Math.abs(Math.random() * (max - min) + min);
    return parseInt(random.toFixed(0), 10);
}
exports.randomPoint = randomPoint;
function dispatchCustomEvent(target, type, detail) {
    var customEvent = new CustomEvent(type, {
        bubbles: true,
        cancelable: true,
        detail: detail
    });
    target.dispatchEvent(customEvent);
}
exports.dispatchCustomEvent = dispatchCustomEvent;
/**
 *
 * @param src {String}
 */
function loadImage(src) {
    return new Promise(function (resolve, reject) {
        var image = new Image();
        image.onload = function () {
            resolve(image);
        };
        image.src = src;
        image.onerror = function (event) {
            reject(event.type);
        };
    });
}
exports.loadImage = loadImage;
function throttle(callback, delay) {
    var last;
    var timer;
    return function () {
        var context = this;
        var now = +new Date();
        var args = arguments;
        if (last && now < last + delay) {
            // le délai n'est pas écoulé on reset le timer
            clearTimeout(timer);
            timer = setTimeout(function () {
                last = now;
                callback.apply(context, args);
            }, delay);
        }
        else {
            last = now;
            callback.apply(context, args);
        }
    };
}
exports.throttle = throttle;


/***/ })
/******/ ]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCAyYTJjY2ZkMDgyOWIxNDIwNzQ3NCIsIndlYnBhY2s6Ly8vLi9TY3JhdGNoQ2FyZC50cyIsIndlYnBhY2s6Ly8vLi91dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTztBQ1ZBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7O0FDNURBLHFDQUE4RTtBQUU5RSxJQUFLLFlBSUo7QUFKRCxXQUFLLFlBQVk7SUFDZiwrREFBWTtJQUNaLHFEQUFPO0lBQ1AsMkRBQVU7QUFDWixDQUFDLEVBSkksWUFBWSxLQUFaLFlBQVksUUFJaEI7QUFFRDtJQVlFLHFCQUFhLFFBQWdCLEVBQUUsTUFBaUI7UUFDOUMsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDeEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQztRQUMzQyxJQUFJLENB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QUM7UUFDOUIsSUFBSSxJQUFJLEdBQUcsU0FBUyxDQUFDO1FBQ3JCLEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxHQUFHLEdBQUcsSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDN0IsOENBQThDO1lBQzlDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNwQixLQUFLLEdBQUcsVUFBVSxDQUFDO2dCQUNmLElBQUksR0FBRyxHQUFHLENBQUM7Z0JBQ1gsUUFBUSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDbEMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ2QsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osSUFBSSxHQUFHLEdBQUcsQ0FBQztZQUNYLFFBQVEsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2xDLENBQUM7SUFDTCxDQUFDLENBQUM7QUFDSixDQUFDO0FBbkJELDRCQW1CQyIsImZpbGUiOiJzY3JhdGNoY2FyZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIlNjcmF0Y2hDYXJkXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIlNjcmF0Y2hDYXJkXCJdID0gZmFjdG9yeSgpO1xufSkodGhpcywgZnVuY3Rpb24oKSB7XG5yZXR1cm4gXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDJhMmNjZmQwODI5YjE0MjA3NDc0IiwiaW1wb3J0IHtTQ19DT05GSUcsIFNjcmF0Y2hUeXBlfSBmcm9tICcuL1NjcmF0Y2hDYXJkQ29uZmlnJztcclxuaW1wb3J0IHtyYW5kb21Qb2ludCwgbG9hZEltYWdlLCB0aHJvdHRsZSwgZGlzcGF0Y2hDdXN0b21FdmVudH0gZnJvbSAnLi91dGlscyc7XHJcblxyXG5lbnVtIFNjcmF0Y2hFdmVudCB7XHJcbiAgU2NyYXRjaFN0YXJ0LFxyXG4gIFNjcmF0Y2gsXHJcbiAgU2NyYXRjaEVuZFxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTY3JhdGNoQ2FyZCB7XHJcbiAgcmVhZG9ubHkgY29uZmlnOiBTQ19DT05GSUc7XHJcbiAgcHVibGljIHBlcmNlbnQ6IG51bWJlcjsgXHJcbiAgcHJpdmF0ZSBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcclxuICBwcml2YXRlIGNvbnRhaW5lcjogSFRNTEVsZW1lbnQ7XHJcbiAgcHJpdmF0ZSBiZ0ltYWdlOiBIVE1MSW1hZ2VFbGVtZW50O1xyXG4gIHByaXZhdGUgem9uZTogQ2xpZW50UmVjdDtcclxuICBwcml2YXRlIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgcHJpdmF0ZSBwb3NpdGlvbjogbnVtYmVyW107XHJcbiAgcHVibGljIHNjcmF0Y2hUeXBlOiBTY3JhdGNoVHlwZTtcclxuICBwdWJsaWMgcmVhZHlUb0NsZWFyOiBCb29sZWFuO1xyXG4gIFxyXG4gIGNvbnN0cnVjdG9yIChzZWxlY3Rvcjogc3RyaW5nLCBjb25maWc6IFNDX0NPTkZJRykge1xyXG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XHJcbiAgICB0aGlzLmNvbmZpZyA9IE9iamVjdC5hc3NpZ24oe30sIGNvbmZpZyk7XHJcbiAgICB0aGlzLnNjcmF0Y2hUeXBlID0gdGhpcy5jb25maWcuc2NyYXRjaFR5cGU7XHJcbiAgICB0aGlzLmNvbnRhaW5lciA9IDxIVE1MRWxlbWVudD4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XHJcbiAgICB0aGlzLnBvc2l0aW9uID0gWzAsIDBdOyAvLyBpbml0IHBvc2l0aW9uXHJcbiAgICB0aGlzLnJlYWR5VG9DbGVhciA9IGZhbHNlO1xyXG4gICAgLy8gQWRkIGNhbnZhcyBpbiBjb250YWluZXJcclxuICAgIHRoaXMuaW5pdCgpO1xyXG4gICAgXHJcbiAgICAvLyBkZWJ1Z1xyXG4gICAgY29uc3QgY3Vyc29yRGVidWcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnanMtZGVidWctY3Vyc29yJyk7XHJcblxyXG4gICAgbGV0IHNjcmF0Y2hpbmcgPSB0aHJvdHRsZSgoZXZlbnQ6IEV2ZW50KSA9PiB7XHJcbiAgICAgIHNlbGYucG9zaXRpb24gPSBzZWxmLm1vdXNlUG9zaXRpb24oZXZlbnQpO1xyXG4gICAgICBzZWxmLnNjcmF0Y2goKTtcclxuICAgICAgLy8gY2FsY3VsYXRlIHRoZSBwZXJjZW50IG9mIGFyZWEgc2NyYXRjaGVkLlxyXG4gICAgICBzZWxmLnBlcmNlbnQgPSBzZWxmLmdldFBlcmNlbnQoKTtcclxuICAgICAgXHJcbiAgICAgIGlmIChzZWxmLnBlcmNlbnQgPj0gNTApIHtcclxuICAgICAgICBzZWxmLmNsZWFyKCk7XHJcbiAgICAgICAgc2VsZi5jYW52YXMuc3R5bGUucG9pbnRlckV2ZW50cyA9ICdub25lJztcclxuICAgICAgICBpZiAoc2VsZi5jb25maWcuY2FsbGJhY2sgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgc2VsZi5jb25maWcuY2FsbGJhY2soKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0sIDE2KTtcclxuXHJcbiAgICB0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgc2VsZi5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgc2NyYXRjaGluZyk7XHJcblxyXG4gICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIGZ1bmN0aW9uIF9mdW5jICgpIHtcclxuICAgICAgIHNlbGYuY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHNjcmF0Y2hpbmcpO1xyXG4gICAgICAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgX2Z1bmMpO1xyXG4gICAgIH0pO1xyXG4gICB9KTtcclxuXHJcbiAgfVxyXG5cclxuICBpbml0ICgpOiB2b2lkIHtcclxuICAgIHRoaXMuZ2VuZXJhdGVDYW52YXMoKTtcclxuICAgIHRoaXMuY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgIHRoaXMuem9uZSA9IHRoaXMuY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgY29uc29sZS5sb2codGhpcy56b25lKTtcclxuXHJcbiAgICBsb2FkSW1hZ2UodGhpcy5jb25maWcuaW1hZ2VGb3J3YXJkU3JjKS50aGVuKChpbWc6IEhUTUxJbWFnZUVsZW1lbnQpID0+IHtcclxuICAgICAgdGhpcy5jdHguZHJhd0ltYWdlKGltZywgMCwgMCk7XHJcbiAgICAgIHRoaXMuc2V0QmFja2dyb3VuZCgpO1xyXG4gICAgfSwgKGV2ZW50KSA9PiB7XHJcbiAgICAgIC8vIFN0b3AgYWxsIHNjcmlwdCBoZXJlXHJcbiAgICAgIGNvbnNvbGUubG9nKGV2ZW50KTtcclxuICAgIH0pO1xyXG4gIH1cclxuICBcclxuICBwcml2YXRlIGdlbmVyYXRlQ2FudmFzICgpOiB2b2lkIHtcclxuICAgIHRoaXMuY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XHJcbiAgICB0aGlzLmNhbnZhcy5jbGFzc0xpc3QuYWRkKCdzY19fY2FudmFzJyk7XHJcbiAgICAvLyBBZGQgY2FudmFzIGludG8gY29udGFpbmVyXHJcbiAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmNhbnZhcyk7XHJcbiAgICB0aGlzLmNhbnZhcy53aWR0aCA9IHRoaXMuY29udGFpbmVyLmNsaWVudFdpZHRoO1xyXG4gICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gdGhpcy5jb250YWluZXIuY2xpZW50SGVpZ2h0O1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzZXRCYWNrZ3JvdW5kICgpOiB2b2lkIHtcclxuICAgIGxldCBpbWFnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xyXG4gICAgbG9hZEltYWdlKHRoaXMuY29uZmlnLmltYWdlQmFja2dyb3VuZFNyYykudGhlbigoaW1nOiBIVE1MSW1hZ2VFbGVtZW50KSA9PiB7ICAgIFxyXG4gICAgICBpbWFnZS5zcmMgPSBpbWcuc3JjO1xyXG4gICAgICB0aGlzLmNvbnRhaW5lci5pbnNlcnRCZWZvcmUoaW1hZ2UsIHRoaXMuY2FudmFzKTtcclxuICAgIH0sIChldmVudCkgPT4ge1xyXG4gICAgICAvLyBTdG9wIGFsbCBzY3JpcHQgaGVyZVxyXG4gICAgICBjb25zb2xlLmxvZyhldmVudCk7XHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICBtb3VzZVBvc2l0aW9uIChldmVudDogYW55KTogbnVtYmVyW10ge1xyXG5cdFx0bGV0IHBvc1g6IG51bWJlciwgcG9zWTogbnVtYmVyO1xyXG5cdFx0c3dpdGNoIChldmVudC50eXBlKSB7XHJcblx0XHRcdGNhc2UgJ3RvdWNobW92ZSc6XHJcblx0XHRcdFx0cG9zWCA9IGV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WCAtICh0aGlzLmNvbmZpZy5jbGVhclpvbmVSYWRpdXMgLyAyKSAtIHdpbmRvdy5wYWdlWE9mZnNldCAtIHRoaXMuem9uZS5sZWZ0O1xyXG5cdFx0XHRcdHBvc1kgPSBldmVudC50b3VjaGVzWzBdLmNsaWVudFkgLSAodGhpcy5jb25maWcuY2xlYXJab25lUmFkaXVzIC8gMikgLSB3aW5kb3cucGFnZVlPZmZzZXQgLSB0aGlzLnpvbmUudG9wO1xyXG4gICAgICBjYXNlICdtb3VzZW1vdmUnOlxyXG5cdFx0XHRcdHBvc1ggPSBldmVudC5jbGllbnRYIC0gdGhpcy5jb25maWcuY2xlYXJab25lUmFkaXVzIC0gd2luZG93LnBhZ2VYT2Zmc2V0IC0gdGhpcy56b25lLmxlZnQ7XHJcblx0XHRcdFx0cG9zWSA9IGV2ZW50LmNsaWVudFkgLSB0aGlzLmNvbmZpZy5jbGVhclpvbmVSYWRpdXMgLSB3aW5kb3cucGFnZVlPZmZzZXQgLSB0aGlzLnpvbmUudG9wO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBbcG9zWCwgcG9zWV07XHJcbiAgfVxyXG5cclxuICBjbGVhclBvaW50IChwb3NYOiBudW1iZXIsIHBvc1k6IG51bWJlcik6IG51bWJlcltdIHtcclxuICAgIGxldCByYWRpdXM6IG51bWJlciA9IHRoaXMuY29uZmlnLmNsZWFyWm9uZVJhZGl1cztcclxuICAgIGxldCB4OiBudW1iZXIgPSBNYXRoLnJhbmRvbSgpICogMiAqIHJhZGl1cyAtIHJhZGl1cztcclxuICAgIGxldCB5bGltOiBudW1iZXIgPSBNYXRoLnNxcnQocmFkaXVzICogcmFkaXVzIC0geCAqIHgpO1xyXG4gICAgbGV0IHk6IG51bWJlciA9IE1hdGgucmFuZG9tKCkgKiAyICogeWxpbSAtIHlsaW07XHJcbiAgICB4ICs9IHJhZGl1cztcclxuICAgIHkgKz0gcmFkaXVzO1xyXG4gXHJcbiAgICB4ICs9IHBvc1g7XHJcbiAgICB5ICs9IHBvc1k7XHJcbiBcclxuICAgIHJldHVybiBbeCwgeV07XHJcbiAgfVxyXG5cclxuICBzY3JhdGNoICgpOiB2b2lkIHtcclxuICAgIGxldCB4ID0gdGhpcy5wb3NpdGlvblswXTtcclxuICAgIGxldCB5ID0gdGhpcy5wb3NpdGlvblsxXTtcclxuICAgIGxldCBpID0gMDtcclxuICAgIGxldCBsZW4gPSB0aGlzLmNvbmZpZy5uUG9pbnRzO1xyXG5cclxuICAgIGZvciAoaTsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgIGxldCBwb2ludHMgPSB0aGlzLmNsZWFyUG9pbnQoeCwgeSk7XHJcbiAgICAgIHRoaXMuY3R4LmNsZWFyUmVjdChwb2ludHNbMF0sIHBvaW50c1sxXSwgdGhpcy5jb25maWcucG9pbnRTaXplWzBdLCB0aGlzLmNvbmZpZy5wb2ludFNpemVbMV0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYnJ1c2ggKCk6IHZvaWQge1xyXG5cclxuICB9XHJcblxyXG4gIGdldFBlcmNlbnQgKCk6IG51bWJlciB7XHJcbiAgICBsZXQgcGVyY2VudDtcclxuICAgIGxldCBjb3VudGVyID0gMDsgLy8gbnVtYmVyIG9mIHBpeGVscyBjbGVhclxyXG4gICAgbGV0IGltYWdlRGF0YSA9IHRoaXMuY3R4LmdldEltYWdlRGF0YSgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcclxuICAgIGxldCBpbWFnZURhdGFMZW5ndGggPSBpbWFnZURhdGEuZGF0YS5sZW5ndGg7XHJcblxyXG4gICAgZm9yKGxldCBpID0gMDsgaSA8IGltYWdlRGF0YUxlbmd0aDsgaSArPSA0KSB7XHJcbiAgICAgIGlmIChpbWFnZURhdGEuZGF0YVtpXSA9PT0gMCAmJiBpbWFnZURhdGEuZGF0YVtpKzFdID09PSAwICYmIGltYWdlRGF0YS5kYXRhW2krMl0gPT09IDAgJiYgaW1hZ2VEYXRhLmRhdGFbaSszXSA9PT0gMCkge1xyXG4gICAgICAgIGNvdW50ZXIrKztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChjb3VudGVyID49IDEpIHtcclxuICAgICAgcGVyY2VudCA9IChjb3VudGVyIC8gKHRoaXMuY2FudmFzLndpZHRoICogdGhpcy5jYW52YXMuaGVpZ2h0KSkgKiAxMDA7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBwZXJjZW50ID0gMDtcclxuICAgIH1cclxuICAgIHJldHVybiBwZXJjZW50O1xyXG4gIH1cclxuICBcclxuICAvKipcclxuICAgKiBKdXN0IGNsZWFyIHRoZSBjYW52YXNcclxuICAgKi9cclxuICBjbGVhciAoKTogdm9pZCB7XHJcbiAgICB0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5jYW52YXMud2lkdGgsIHRoaXMuY2FudmFzLmhlaWdodCk7XHJcbiAgfVxyXG5cclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL1NjcmF0Y2hDYXJkLnRzIiwiLyoqXHJcbiAqIFJldHVybiBhIHJhbmRvbSBudW1iZXIgaW4gcmFuZ2VcclxuICogQHBhcmFtIG1pbiB7TnVtYmVyfVxyXG4gKiBAcGFyYW0gbWF4IHtOdW1iZXJ9XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gcmFuZG9tUG9pbnQgKG1pbjogbnVtYmVyLCBtYXg6IG51bWJlcikge1xyXG4gIGxldCByYW5kb20gPSBNYXRoLmFicyhNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbikgKyBtaW4pO1xyXG4gIHJldHVybiBwYXJzZUludChyYW5kb20udG9GaXhlZCgwKSwgMTApO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZGlzcGF0Y2hDdXN0b21FdmVudCAodGFyZ2V0OiBIVE1MRWxlbWVudCwgdHlwZTogc3RyaW5nLCBkZXRhaWw6IGFueSkge1xyXG4gIGxldCBjdXN0b21FdmVudCA9IG5ldyBDdXN0b21FdmVudCh0eXBlLCB7XHJcbiAgICBidWJibGVzOiB0cnVlLFxyXG4gICAgY2FuY2VsYWJsZTogdHJ1ZSxcclxuICAgIGRldGFpbDogZGV0YWlsXHJcbiAgfSk7XHJcbiAgdGFyZ2V0LmRpc3BhdGNoRXZlbnQoY3VzdG9tRXZlbnQpO1xyXG59XHJcblxyXG4vKipcclxuICogXHJcbiAqIEBwYXJhbSBzcmMge1N0cmluZ31cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBsb2FkSW1hZ2Uoc3JjOiBzdHJpbmcpIHtcclxuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgbGV0IGltYWdlID0gbmV3IEltYWdlKCk7XHJcbiAgICBpbWFnZS5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgIHJlc29sdmUoaW1hZ2UpO1xyXG4gICAgfVxyXG4gICAgaW1hZ2Uuc3JjID0gc3JjO1xyXG4gICAgaW1hZ2Uub25lcnJvciA9IChldmVudDogRXZlbnQpID0+IHtcclxuICAgICAgcmVqZWN0KGV2ZW50LnR5cGUpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG4gIFxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdGhyb3R0bGUgKGNhbGxiYWNrOiBGdW5jdGlvbiwgZGVsYXk6IG51bWJlcikge1xyXG4gIHZhciBsYXN0OiBudW1iZXI7XHJcbiAgdmFyIHRpbWVyOiBudW1iZXI7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcclxuICAgICAgdmFyIGNvbnRleHQgPSB0aGlzO1xyXG4gICAgICB2YXIgbm93OiBudW1iZXIgPSArbmV3IERhdGUoKTtcclxuICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XHJcbiAgICAgIGlmIChsYXN0ICYmIG5vdyA8IGxhc3QgKyBkZWxheSkge1xyXG4gICAgICAgICAgLy8gbGUgZMOpbGFpIG4nZXN0IHBhcyDDqWNvdWzDqSBvbiByZXNldCBsZSB0aW1lclxyXG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVyKTtcclxuICAgICAgICAgIHRpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgbGFzdCA9IG5vdztcclxuICAgICAgICAgICAgICBjYWxsYmFjay5hcHBseShjb250ZXh0LCBhcmdzKTtcclxuICAgICAgICAgIH0sIGRlbGF5KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxhc3QgPSBub3c7XHJcbiAgICAgICAgICBjYWxsYmFjay5hcHBseShjb250ZXh0LCBhcmdzKTtcclxuICAgICAgfVxyXG4gIH07XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi91dGlscy50cyJdLCJzb3VyY2VSb290IjoiIn0=