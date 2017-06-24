/******/ (function(modules) { // webpackBootstrap
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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
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
/******/ 	return __webpack_require__(__webpack_require__.s = 14);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Device = (function () {
    function Device(id, version, manufacturer, emulator) {
        this.id = id;
        this.version = version;
        this.manufacturer = manufacturer;
        this.emulator = emulator;
    }
    return Device;
}());
exports.Device = Device;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Utils = (function () {
    function Utils() {
    }
    Utils.to32BitSigned = function (val) {
        if ((val & 0x8000) > 0) {
            return (((~val) + 1) & 0xffff) * -1; // two's complement
        }
        return val;
    };
    Utils.to16BitSigned = function (val) {
        if (val < 0) {
            //return ((~val) + 1) & 0xffff;	// two's complement
            return ((val & 0x7fff) | 0x8000);
        }
        return val & 0xffff;
    };
    Utils.byteTo32BitSigned = function (val) {
        if ((val & 0x80) > 0) {
            return (((~val) + 1) & 0xff) * -1; // two's complement
        }
        return val;
    };
    Utils.roundTowardsZero = function (val) {
        if (val < 0)
            val = Math.ceil(val);
        else
            val = Math.floor(val);
        return val;
    };
    Utils.makeInstruction = function (opcode, a, b) {
        var instruction = opcode;
        instruction |= (b << 5);
        instruction |= (a << 10);
        return instruction;
    };
    Utils.makeSpecialInstruction = function (opcode, a) {
        var instruction = 0;
        instruction |= (a << 10);
        instruction |= (opcode << 5);
        return instruction;
    };
    Utils.parseInstruction = function (instruction) {
        return {
            opcode: instruction & 0x001f,
            b: (instruction & 0x03e0) >> 5,
            a: (instruction & 0xfc00) >> 10
        };
    };
    Utils.parseSpecialInstruction = function (instruction) {
        return {
            a: (instruction & 0xfc00) >> 10,
            opcode: (instruction & 0x03e0) >> 5,
            b: 0
        };
    };
    Utils.hex = function (num) {
        return "0x" + Utils.to16BitSigned(num).toString(16);
    };
    Utils.hex2 = function (num) {
        //var str = Utils.to16BitSigned(num).toString(16);
        var str = (num).toString(16);
        return "0x" + "0000".substr(str.length) + str;
    };
    Utils.makeVideoCell = function (glyph, blink, bg, fg) {
        var result = glyph & 0x7f;
        result |= (blink & 0x1) << 7;
        result |= (bg & 0xf) << 8;
        result |= (fg & 0xf) << 12;
        return result;
    };
    Utils.unpackColor16 = function (c) {
        var r = ((c & 0xf00) >> 8) * 16;
        var g = ((c & 0x0f0) >> 4) * 16;
        var b = (c & 0x00f) * 16;
        return new UtilsColor(r, g, b);
    };
    Utils.createImage = function (src) {
        var img = new Image();
        img.src = src;
        return img;
    };
    return Utils;
}());
exports.Utils = Utils;
;
var UtilsColor = (function () {
    function UtilsColor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
    return UtilsColor;
}());
exports.UtilsColor = UtilsColor;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://raw.github.com/gibbed/0x10c-Notes/master/hardware/clock.txt
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Device_1 = __webpack_require__(0);
var Clock = (function (_super) {
    __extends(Clock, _super);
    function Clock(_emulator) {
        var _this = _super.call(this, 0x12d0b402, 1, 0x90099009, _emulator) || this;
        _this.interruptsOn = false;
        _this.elapsed = 0;
        _this.interval = 0;
        _this.interruptMessage = 0;
        _this.running = false;
        _this.elapsedTicks = 0;
        return _this;
    }
    Clock.prototype.init = function () {
        this.stop();
    };
    Clock.prototype.interrupt = function () {
        var aVal = this.emulator.Registers.A.get();
        var bVal = this.emulator.Registers.B.get();
        switch (aVal) {
            case 0:
                if (bVal != 0)
                    this.start(Math.round(bVal / 60 * 1000));
                else
                    this.stop();
                break;
            case 1:
                this.emulator.Registers.C.set(this.elapsedTicks);
                break;
            case 2:
                if (bVal != 0) {
                    this.interruptsOn = true;
                    this.interruptMessage = bVal;
                }
                else {
                    this.interruptsOn = false;
                }
                break;
        }
    };
    Clock.prototype.start = function (duration) {
        this.stop();
        this.elapsed = 0;
        this.elapsedTicks = 0;
        this.duration = duration;
        this.running = true;
    };
    Clock.prototype.stop = function () {
        this.running = false;
        this.elapsed = 0;
    };
    Clock.prototype.tick = function () {
        if (this.interruptsOn)
            this.emulator.interrupt(this.interruptMessage);
        this.elapsedTicks = (this.elapsedTicks + 1) & 0xffff;
    };
    Clock.prototype.update = function (deltaTime) {
        if (!this.running)
            return;
        this.elapsed += deltaTime;
        for (; this.elapsed >= this.duration; this.elapsed -= this.duration) {
            this.tick();
        }
    };
    return Clock;
}(Device_1.Device));
exports.Clock = Clock;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://raw.github.com/gibbed/0x10c-Notes/master/hardware/keyboard.txt
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Device_1 = __webpack_require__(0);
var Keyboard = (function (_super) {
    __extends(Keyboard, _super);
    function Keyboard(_emulator) {
        var _this = _super.call(this, 0x30cf7406, 1, 0x90099009, _emulator) || this;
        _this.downKeys = {};
        _this.keys = [];
        _this.interruptsOn = false;
        _this.interruptMessage = 0;
        return _this;
    }
    Keyboard.prototype.init = function () {
        this.interruptsOn = false;
        this.interruptMessage = 0;
        this.keys = [];
        this.downKeys = {};
    };
    Keyboard.prototype.keyDown = function (event) {
        var code = this.convert(event.keyCode, event);
        if (code == 0)
            return true;
        this.downKeys["" + code] = true;
        this.keys.push(code);
        if (this.interruptsOn)
            this.emulator.interrupt(this.interruptMessage);
        return event.keyCode == 8 ? false : true;
    };
    Keyboard.prototype.keyUp = function (event) {
        var code = this.convert(event.keyCode, event);
        this.downKeys["" + code] = false;
        return event.keyCode == 8 ? false : true;
    };
    Keyboard.prototype.convert = function (code, event) {
        // TODO: convert key codes
        switch (code) {
            // backspace
            case 8:
                return 0x10;
            // tab
            case 9:
                return 0x09;
            // return
            case 13:
                return 0x11;
            // insert
            case 45:
                return 0x12;
            // delete
            case 46:
                return 0x13;
            // up arrow
            case 38:
                return 0x80;
            // down arrow
            case 40:
                return 0x81;
            // left arrow
            case 37:
                return 0x82;
            // right arrow
            case 39:
                return 0x83;
            // shift
            case 16:
                return 0x90;
            //ctrl
            case 17:
                return 0x91;
            // space
            case 32:
                return 0x20;
            // semicolon
            case 186:
                return 0x3B;
            // equal sign
            case 187:
                return 0x3D;
            // comma
            case 188:
                return 0x2C;
            // dash
            case 189:
                return 0x2D;
            // period
            case 190:
                return 0x2E;
            // forward slash
            case 191:
                return 0x2F;
            // grave accent
            case 192:
                return 0x60;
            // open bracket
            case 219:
                return 0x5B;
            // backslash
            case 220:
                return 0x5C;
            // close bracket
            case 221:
                return 0x5D;
            // single quote
            case 222:
                return 0x27;
            default:
                if (code >= 0x20 && code <= 0x7f) {
                    var str = String.fromCharCode(code);
                    if (!event.shiftKey)
                        str = str.toLowerCase();
                    return str.charCodeAt(0);
                }
                return 0;
        }
    };
    Keyboard.prototype.interrupt = function () {
        var aVal = this.emulator.Registers.A.get();
        switch (aVal) {
            case 0:
                this.keys = [];
                break;
            case 1:
                var val = 0;
                if (this.keys.length > 0) {
                    val = this.keys[0];
                    this.keys.splice(0, 1);
                }
                this.emulator.Registers.C.set(val);
                break;
            case 2:
                var bVal = this.emulator.Registers.B.get();
                if (this.downKeys["" + bVal])
                    this.emulator.Registers.C.set(1);
                else
                    this.emulator.Registers.C.set(0);
                break;
            case 3: {
                var bVal = this.emulator.Registers.B.get();
                if (bVal != 0) {
                    this.interruptsOn = true;
                    this.interruptMessage = bVal;
                }
                else {
                    this.interruptsOn = false;
                }
                break;
            }
        }
    };
    return Keyboard;
}(Device_1.Device));
exports.Keyboard = Keyboard;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Device_1 = __webpack_require__(0);
var Utils_1 = __webpack_require__(1);
var Monitor = (function (_super) {
    __extends(Monitor, _super);
    function Monitor(_emulator, canvas) {
        var _this = _super.call(this, 0x7349f615, 0x1802, 0x1c6c8b36, _emulator) || this;
        _this.defaultFont = [];
        _this.monitorFillRect = canvas;
        _this.defaultFont = [
            0x000f, 0x0808, 0x080f, 0x0808, 0x08f8, 0x0808, 0x00ff, 0x0808,
            0x0808, 0x0808, 0x08ff, 0x0808, 0x00ff, 0x1414, 0xff00, 0xff08,
            0x1f10, 0x1714, 0xfc04, 0xf414, 0x1710, 0x1714, 0xf404, 0xf414,
            0xff00, 0xf714, 0x1414, 0x1414, 0xf700, 0xf714, 0x1417, 0x1414,
            0x0f08, 0x0f08, 0x14f4, 0x1414, 0xf808, 0xf808, 0x0f08, 0x0f08,
            0x001f, 0x1414, 0x00fc, 0x1414, 0xf808, 0xf808, 0xff08, 0xff08,
            0x14ff, 0x1414, 0x080f, 0x0000, 0x00f8, 0x0808, 0xffff, 0xffff,
            0xf0f0, 0xf0f0, 0xffff, 0x0000, 0x0000, 0xffff, 0x0f0f, 0x0f0f,
            0x0000, 0x0000, 0x005f, 0x0000, 0x0300, 0x0300, 0x3e14, 0x3e00,
            0x266b, 0x3200, 0x611c, 0x4300, 0x3629, 0x7650, 0x0002, 0x0100,
            0x1c22, 0x4100, 0x4122, 0x1c00, 0x2a1c, 0x2a00, 0x083e, 0x0800,
            0x4020, 0x0000, 0x0808, 0x0800, 0x0040, 0x0000, 0x601c, 0x0300,
            0x3e41, 0x3e00, 0x427f, 0x4000, 0x6259, 0x4600, 0x2249, 0x3600,
            0x0f08, 0x7f00, 0x2745, 0x3900, 0x3e49, 0x3200, 0x6119, 0x0700,
            0x3649, 0x3600, 0x2649, 0x3e00, 0x0024, 0x0000, 0x4024, 0x0000,
            0x0814, 0x2241, 0x1414, 0x1400, 0x4122, 0x1408, 0x0259, 0x0600,
            0x3e59, 0x5e00, 0x7e09, 0x7e00, 0x7f49, 0x3600, 0x3e41, 0x2200,
            0x7f41, 0x3e00, 0x7f49, 0x4100, 0x7f09, 0x0100, 0x3e49, 0x3a00,
            0x7f08, 0x7f00, 0x417f, 0x4100, 0x2040, 0x3f00, 0x7f0c, 0x7300,
            0x7f40, 0x4000, 0x7f06, 0x7f00, 0x7f01, 0x7e00, 0x3e41, 0x3e00,
            0x7f09, 0x0600, 0x3e41, 0xbe00, 0x7f09, 0x7600, 0x2649, 0x3200,
            0x017f, 0x0100, 0x7f40, 0x7f00, 0x1f60, 0x1f00, 0x7f30, 0x7f00,
            0x7708, 0x7700, 0x0778, 0x0700, 0x7149, 0x4700, 0x007f, 0x4100,
            0x031c, 0x6000, 0x0041, 0x7f00, 0x0201, 0x0200, 0x8080, 0x8000,
            0x0001, 0x0200, 0x2454, 0x7800, 0x7f44, 0x3800, 0x3844, 0x2800,
            0x3844, 0x7f00, 0x3854, 0x5800, 0x087e, 0x0900, 0x4854, 0x3c00,
            0x7f04, 0x7800, 0x447d, 0x4000, 0x2040, 0x3d00, 0x7f10, 0x6c00,
            0x417f, 0x4000, 0x7c18, 0x7c00, 0x7c04, 0x7800, 0x3844, 0x3800,
            0x7c14, 0x0800, 0x0814, 0x7c00, 0x7c04, 0x0800, 0x4854, 0x2400,
            0x043e, 0x4400, 0x3c40, 0x7c00, 0x1c60, 0x1c00, 0x7c30, 0x7c00,
            0x6c10, 0x6c00, 0x4c50, 0x3c00, 0x6454, 0x4c00, 0x0836, 0x4100,
            0x0077, 0x0000, 0x4136, 0x0800, 0x0201, 0x0201, 0x704c, 0x7000
        ];
        _this.defaultPalette = _this.palette = [
            0x000, 0x00a, 0x0a0, 0x0aa, 0xa00, 0xa0a, 0xa50, 0xaaa,
            0x555, 0x55f, 0x5f5, 0x5ff, 0xf55, 0xf5f, 0xff5, 0xfff
        ];
        _this.memOffset = 0x8000;
        _this.fontOffset = 0x8180;
        _this.refreshCount = 0;
        _this.blinkGlyphsOn = true;
        return _this;
    }
    Monitor.prototype.init = function () {
        this.disconnect();
        this.refreshCount = 0;
        this.memOffset = 0x8000;
        this.fontOffset = 0x8180;
        // map font
        for (var i = 0; i < this.defaultFont.length; i++) {
            this.emulator.RAM[this.fontOffset + i] = this.defaultFont[i];
        }
        this.palette = this.defaultPalette;
    };
    Monitor.prototype.interrupt = function () {
        var aVal = this.emulator.Registers.A.get();
        var bVal = this.emulator.Registers.B.get();
        switch (aVal) {
            case 0:
                if (bVal === 0)
                    this.disconnect();
                else
                    this.memMapScreen(bVal);
                break;
            case 1:
                this.memMapFont(bVal);
                break;
            case 2:
                this.memMapPalette(bVal);
                break;
            case 3:
                break;
            case 4:
                this.memDumpFont(bVal);
                break;
            case 5:
                this.memDumpPalette(bVal);
                break;
        }
    };
    Monitor.prototype.memMapScreen = function (offset) {
        this.memOffset = offset;
    };
    Monitor.prototype.drawCell = function (x, y, word) {
        var glyph = word & 0x7f;
        var blink = (word & 0x80) >> 7;
        var bg = (word & 0xf00) >> 8;
        var fg = (word & 0xf000) >> 12;
        this.drawGlyph(x, y, glyph, this.palette[fg], this.palette[bg], blink);
    };
    Monitor.prototype.drawGlyph = function (x, y, glyph, fg, bg, blink) {
        var color = Utils_1.Utils.unpackColor16(bg);
        this.monitorFillRect(x * 4, y * 8, 4, 8, color);
        if (blink && !this.blinkGlyphsOn)
            return;
        color = Utils_1.Utils.unpackColor16(fg);
        var cols = [];
        glyph *= 2;
        cols[0] = this.emulator.RAM[this.fontOffset + glyph] >> 8;
        cols[1] = this.emulator.RAM[this.fontOffset + glyph] & 0xff;
        cols[2] = this.emulator.RAM[this.fontOffset + glyph + 1] >> 8;
        cols[3] = this.emulator.RAM[this.fontOffset + glyph + 1] & 0xff;
        for (var row = 0; row < 8; row++) {
            for (var col = 0; col < 4; col++) {
                var bit = (cols[col] >> row) & 0x01;
                if (bit == 1)
                    this.monitorFillRect((x * 4 + col), (y * 8 + row), 1, 1, color);
            }
        }
    };
    Monitor.prototype.refresh = function () {
        this.refreshCount++;
        if (this.refreshCount > 10) {
            this.blinkGlyphsOn = !this.blinkGlyphsOn;
            this.refreshCount = 0;
        }
        for (var y = 0; y < 12; y++) {
            for (var x = 0; x < 32; x++) {
                this.drawCell(x, y, this.emulator.RAM[this.memOffset + x + y * 32]);
            }
        }
    };
    Monitor.prototype.disconnect = function () {
        this.monitorFillRect(0, 0, 128, 96, new Utils_1.UtilsColor(119, 119, 119));
    };
    Monitor.prototype.memMapFont = function (offset) {
        if (offset == 0) {
            this.fontOffset = 0x8180;
            for (var i = 0; i < this.defaultFont.length; i++) {
                this.emulator.RAM[this.fontOffset + i] = this.defaultFont[i];
            }
        }
        else
            this.fontOffset = offset;
    };
    Monitor.prototype.memMapPalette = function (offset) {
        if (offset === 0)
            this.palette = this.defaultPalette;
        else {
            this.palette = [];
            for (var i = 0; i < 16; i++) {
                this.palette[i] = this.emulator.RAM[offset + i];
            }
        }
    };
    Monitor.prototype.memDumpFont = function (offset) {
        for (var i = 0; i < 256; i++) {
            this.emulator.RAM[offset + i] = this.defaultFont[i];
        }
        this.emulator.CPU_CYCLE += 256;
    };
    Monitor.prototype.memDumpPalette = function (offset) {
        for (var i = 0; i < 16; i++) {
            this.emulator.RAM[offset + i] = this.defaultPalette[i];
        }
        this.emulator.CPU_CYCLE += 16;
    };
    return Monitor;
}(Device_1.Device));
Monitor.SCREEN_WIDTH = 128;
Monitor.SCREEN_HEIGHT = 96;
exports.Monitor = Monitor;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// http://pastebin.com/raw.php?i=Q4JvQvnM
// https://github.com/gibbed/0x10c-Notes
Object.defineProperty(exports, "__esModule", { value: true });
var RegisterCode_1 = __webpack_require__(10);
var Utils_1 = __webpack_require__(1);
var OpCode_1 = __webpack_require__(8);
var Register_1 = __webpack_require__(9);
var RegisterValue_1 = __webpack_require__(12);
var RegisterPlusNextWord_1 = __webpack_require__(11);
var StackPointerValue_1 = __webpack_require__(13);
var Literal_1 = __webpack_require__(6);
var Op_1 = __webpack_require__(7);
var Emulator = (function () {
    function Emulator(verboseLogging) {
        if (verboseLogging === void 0) { verboseLogging = false; }
        this.verbose = false;
        this.RAM = [];
        this.OpSet = [];
        this.SpecialOpSet = [];
        this.Values = [];
        this.devices = [];
        this.interruptQueue = [];
        this.verbose = verboseLogging;
        this.initRegisters();
        this.initValues();
        this.initOperations();
    }
    Emulator.prototype.initRegisters = function () {
        this.Registers = {
            A: new Register_1.Register("A", RegisterCode_1.RegisterCode.REGISTER_A, this),
            B: new Register_1.Register("B", RegisterCode_1.RegisterCode.REGISTER_B, this),
            C: new Register_1.Register("C", RegisterCode_1.RegisterCode.REGISTER_C, this),
            X: new Register_1.Register("X", RegisterCode_1.RegisterCode.REGISTER_X, this),
            Y: new Register_1.Register("Y", RegisterCode_1.RegisterCode.REGISTER_Y, this),
            Z: new Register_1.Register("Z", RegisterCode_1.RegisterCode.REGISTER_Z, this),
            I: new Register_1.Register("I", RegisterCode_1.RegisterCode.REGISTER_I, this),
            J: new Register_1.Register("J", RegisterCode_1.RegisterCode.REGISTER_J, this),
            SP: new Register_1.Register("SP", RegisterCode_1.RegisterCode.REGISTER_SP, this),
            PC: new Register_1.Register("PC", RegisterCode_1.RegisterCode.REGISTER_PC, this),
            EX: new Register_1.Register("EX", RegisterCode_1.RegisterCode.REGISTER_EX, this),
            IA: new Register_1.Register("IA", 0xffff, this),
        };
        this.Registers.PC.inc = function () {
            var v = this.get();
            this.set(v + 1);
            return v;
        };
        this.PC = this.Registers.PC;
        this.Registers.SP.push = function (val) {
            this.contents = Utils_1.Utils.to16BitSigned(this.contents - 1);
            this.emulator.RAM[this.contents] = val;
        };
        this.Registers.SP.pop = function () {
            if (this.contents == 0)
                console.log("Warning: stack underflow");
            var val = this.emulator.RAM[this.contents] || 0;
            this.emulator.RAM[this.contents] = 0; // TODO: should the emualtor alter the memory location when it is POPed?
            this.contents = (this.contents + 1) & 0xffff;
            return val;
        };
    };
    Emulator.prototype.initValues = function () {
        this.Values[0x00] = this.Registers.A;
        this.Values[0x01] = this.Registers.B;
        this.Values[0x02] = this.Registers.C;
        this.Values[0x03] = this.Registers.X;
        this.Values[0x04] = this.Registers.Y;
        this.Values[0x05] = this.Registers.Z;
        this.Values[0x06] = this.Registers.I;
        this.Values[0x07] = this.Registers.J;
        this.Values[0x08] = new RegisterValue_1.RegisterValue(this.Registers.A);
        this.Values[0x09] = new RegisterValue_1.RegisterValue(this.Registers.B);
        this.Values[0x0a] = new RegisterValue_1.RegisterValue(this.Registers.C);
        this.Values[0x0b] = new RegisterValue_1.RegisterValue(this.Registers.X);
        this.Values[0x0c] = new RegisterValue_1.RegisterValue(this.Registers.Y);
        this.Values[0x0d] = new RegisterValue_1.RegisterValue(this.Registers.Z);
        this.Values[0x0e] = new RegisterValue_1.RegisterValue(this.Registers.I);
        this.Values[0x0f] = new RegisterValue_1.RegisterValue(this.Registers.J);
        this.Values[0x10] = new RegisterPlusNextWord_1.RegisterPlusNextWord(this.Registers.A);
        this.Values[0x11] = new RegisterPlusNextWord_1.RegisterPlusNextWord(this.Registers.B);
        this.Values[0x12] = new RegisterPlusNextWord_1.RegisterPlusNextWord(this.Registers.C);
        this.Values[0x13] = new RegisterPlusNextWord_1.RegisterPlusNextWord(this.Registers.X);
        this.Values[0x14] = new RegisterPlusNextWord_1.RegisterPlusNextWord(this.Registers.Y);
        this.Values[0x15] = new RegisterPlusNextWord_1.RegisterPlusNextWord(this.Registers.Z);
        this.Values[0x16] = new RegisterPlusNextWord_1.RegisterPlusNextWord(this.Registers.I);
        this.Values[0x17] = new RegisterPlusNextWord_1.RegisterPlusNextWord(this.Registers.J);
        this.Values[0x18] = new StackPointerValue_1.StackPointerValue(this);
        this.Values[0x19] = new RegisterValue_1.RegisterValue(this.Registers.SP);
        this.Values[0x1a] = new RegisterPlusNextWord_1.RegisterPlusNextWord(this.Registers.SP);
        this.Values[0x1b] = this.Registers.SP;
        this.Values[0x1c] = this.Registers.PC;
        this.Values[0x1d] = this.Registers.EX;
        this.Values[0x1e] = {
            emulator: this,
            getA: function () { return this.get(); },
            getB: function () { return this.get(); },
            get: function () {
                this.cachedResult = this.emulator.nextWord();
                return this.emulator.RAM[this.cachedResult] || 0;
            },
            set: function (val) {
                this.emulator.RAM[this.cachedResult] = val;
            }
        };
        this.Values[0x1f] = {
            emulator: this,
            getA: function () { return this.get(); },
            getB: function () { return this.get(); },
            get: function () { return this.emulator.nextWord(); },
            set: function (val) { }
        };
        this.Values[0x20] = new Literal_1.Literal(0xffff); // -1
        for (var i = 0x21, literalVal = 0; i < 0x40; i++, literalVal++) {
            this.Values[i] = new Literal_1.Literal(literalVal);
        }
    };
    Emulator.prototype.initOperations = function () {
        this.BasicOperations = {
            SET: new Op_1.Op(this, "SET", OpCode_1.OpCode.OPERATION_SET, 1, function (a, b) {
                var aVal = a.getA(), bVal = b.getB();
                if (a.name === "PC")
                    aVal = a.getA();
                if (b.name === "PC")
                    bVal = b.getB();
                b.set(aVal);
                // TODO: some applications assume that setting PC to itself should terminate the application
                //if(a == this.emulator.Registers.PC && b == this.emulator.Registers.PC) {
                //	this.emulator.Registers.PC.contents = Number.MAX_VALUE;
                //}
            }),
            ADD: new Op_1.Op(this, "ADD", OpCode_1.OpCode.OPERATION_ADD, 2, function (a, b) {
                var aVal = a.getA();
                var bVal = b.getB();
                if (a.name === "PC")
                    aVal = a.getA();
                if (b.name === "PC")
                    bVal = b.getB();
                var res = aVal + bVal;
                if ((res & 0xffff0000) > 0)
                    this.emulator.Registers.EX.set(0x0001);
                else
                    this.emulator.Registers.EX.set(0);
                b.set(res & 0xffff);
            }),
            SUB: new Op_1.Op(this, "SUB", OpCode_1.OpCode.OPERATION_SUB, 2, function (a, b) {
                var aVal = a.getA(), bVal = b.getB();
                if (a.name === "PC")
                    aVal = a.getA();
                if (b.name === "PC")
                    bVal = b.getB();
                var res = bVal - aVal;
                if ((res) < 0)
                    this.emulator.Registers.EX.set(0xffff);
                else
                    this.emulator.Registers.EX.set(0);
                b.set(res & 0xffff);
            }),
            MUL: new Op_1.Op(this, "MUL", OpCode_1.OpCode.OPERATION_MUL, 2, function (a, b) {
                var aVal = a.getA(), bVal = b.getB();
                if (a.name === "PC")
                    aVal = a.getA();
                if (b.name === "PC")
                    bVal = b.getB();
                var res = aVal * bVal;
                this.emulator.Registers.EX.set((res >> 16) & 0xffff);
                b.set(res & 0xffff);
            }),
            MLI: new Op_1.Op(this, "MLI", OpCode_1.OpCode.OPERATION_MLI, 2, function (a, b) {
                var aVal = a.getA(), bVal = b.getB();
                if (a.name === "PC")
                    aVal = a.getA();
                if (b.name === "PC")
                    bVal = b.getB();
                aVal = Utils_1.Utils.to32BitSigned(aVal);
                bVal = Utils_1.Utils.to32BitSigned(bVal);
                var res = bVal * aVal;
                this.emulator.Registers.EX.set((res >> 16) & 0xffff);
                b.set(Utils_1.Utils.to16BitSigned(res));
            }),
            DIV: new Op_1.Op(this, "DIV", OpCode_1.OpCode.OPERATION_DIV, 3, function (a, b) {
                var aVal = a.getA(), bVal = b.getB();
                if (a.name === "PC")
                    aVal = a.getA();
                if (b.name === "PC")
                    bVal = b.getB();
                if (aVal === 0) {
                    this.emulator.Registers.EX.set(0);
                    b.set(0);
                }
                else {
                    var res = Math.floor(bVal / aVal);
                    var properShift = (bVal << 16) >>> 0;
                    this.emulator.Registers.EX.set(Math.floor((properShift / aVal)) & 0xffff);
                    b.set(res & 0xffff);
                }
            }),
            DVI: new Op_1.Op(this, "DVI", OpCode_1.OpCode.OPERATION_DVI, 3, function (a, b) {
                var aVal = a.getA(), bVal = b.getB();
                if (a.name === "PC")
                    aVal = a.getA();
                if (b.name === "PC")
                    bVal = b.getB();
                aVal = Utils_1.Utils.to32BitSigned(aVal);
                bVal = Utils_1.Utils.to32BitSigned(bVal);
                if (aVal === 0) {
                    this.emulator.Registers.EX.set(0);
                    b.set(0);
                }
                else {
                    var res = Utils_1.Utils.roundTowardsZero(bVal / aVal);
                    this.emulator.Registers.EX.set(Utils_1.Utils.roundTowardsZero(((bVal << 16) / aVal)) & 0xffff);
                    b.set(Utils_1.Utils.to16BitSigned(res));
                }
            }),
            MOD: new Op_1.Op(this, "MOD", OpCode_1.OpCode.OPERATION_MOD, 3, function (a, b) {
                var aVal = a.getA(), bVal = b.getB();
                if (a.name === "PC")
                    aVal = a.getA();
                if (b.name === "PC")
                    bVal = b.getB();
                if (aVal === 0)
                    b.set(0);
                else
                    b.set(bVal % aVal);
            }),
            MDI: new Op_1.Op(this, "MDI", OpCode_1.OpCode.OPERATION_MDI, 3, function (a, b) {
                var aVal = a.getA(), bVal = b.getB();
                if (a.name === "PC")
                    aVal = a.getA();
                if (b.name === "PC")
                    bVal = b.getB();
                aVal = Utils_1.Utils.to32BitSigned(aVal);
                bVal = Utils_1.Utils.to32BitSigned(bVal);
                if (aVal === 0)
                    b.set(0);
                else
                    b.set(Utils_1.Utils.to16BitSigned(bVal % aVal));
            }),
            AND: new Op_1.Op(this, "AND", OpCode_1.OpCode.OPERATION_AND, 1, function (a, b) {
                var aVal = a.getA(), bVal = b.getB();
                if (a.name === "PC")
                    aVal = a.getA();
                if (b.name === "PC")
                    bVal = b.getB();
                b.set(bVal & aVal);
            }),
            BOR: new Op_1.Op(this, "BOR", OpCode_1.OpCode.OPERATION_BOR, 1, function (a, b) {
                var aVal = a.getA(), bVal = b.getB();
                if (a.name === "PC")
                    aVal = a.getA();
                if (b.name === "PC")
                    bVal = b.getB();
                b.set(bVal | aVal);
            }),
            XOR: new Op_1.Op(this, "XOR", OpCode_1.OpCode.OPERATION_XOR, 1, function (a, b) {
                var aVal = a.getA(), bVal = b.getB();
                if (a.name === "PC")
                    aVal = a.getA();
                if (b.name === "PC")
                    bVal = b.getB();
                b.set(bVal ^ aVal);
            }),
            SHR: new Op_1.Op(this, "SHR", OpCode_1.OpCode.OPERATION_SHR, 1, function (a, b) {
                var aVal = a.getA(), bVal = b.getB();
                if (a.name === "PC")
                    aVal = a.getA();
                if (b.name === "PC")
                    bVal = b.getB();
                this.emulator.Registers.EX.set(((bVal << 16) >> aVal) & 0xffff);
                b.set(bVal >>> aVal);
            }),
            ASR: new Op_1.Op(this, "ASR", OpCode_1.OpCode.OPERATION_ASR, 1, function (a, b) {
                var aVal = a.getA(), bVal = b.getB();
                if (a.name === "PC")
                    aVal = a.getA();
                if (b.name === "PC")
                    bVal = b.getB();
                bVal = Utils_1.Utils.to32BitSigned(bVal);
                this.emulator.Registers.EX.set(((bVal << 16) >>> aVal) & 0xffff);
                b.set((bVal >> aVal) & 0xffff);
            }),
            SHL: new Op_1.Op(this, "SHL", OpCode_1.OpCode.OPERATION_SHL, 1, function (a, b) {
                var aVal = a.getA(), bVal = b.getB();
                if (a.name === "PC")
                    aVal = a.getA();
                if (b.name === "PC")
                    bVal = b.getB();
                this.emulator.Registers.EX.set(((bVal << aVal) >> 16) & 0xffff);
                b.set((bVal << aVal) & 0xffff);
            }),
            IFB: new Op_1.Op(this, "IFB", OpCode_1.OpCode.OPERATION_IFB, 2, function (a, b) {
                var aVal = a.getA(), bVal = b.getB();
                if (a.name === "PC")
                    aVal = a.getA();
                if (b.name === "PC")
                    bVal = b.getB();
                if ((bVal & aVal) != 0) { }
                else
                    this.emulator.skipInstruction();
            }),
            IFC: new Op_1.Op(this, "IFC", OpCode_1.OpCode.OPERATION_IFC, 2, function (a, b) {
                var aVal = a.getA(), bVal = b.getB();
                if (a.name === "PC")
                    aVal = a.getA();
                if (b.name === "PC")
                    bVal = b.getB();
                if ((bVal & aVal) === 0) { }
                else
                    this.emulator.skipInstruction();
            }),
            IFE: new Op_1.Op(this, "IFE", OpCode_1.OpCode.OPERATION_IFE, 2, function (a, b) {
                var aVal = a.getA(), bVal = b.getB();
                if (a.name === "PC")
                    aVal = a.getA();
                if (b.name === "PC")
                    bVal = b.getB();
                if (bVal === aVal) { }
                else
                    this.emulator.skipInstruction();
            }),
            IFN: new Op_1.Op(this, "IFN", OpCode_1.OpCode.OPERATION_IFN, 2, function (a, b) {
                var aVal = a.getA(), bVal = b.getB();
                if (a.name === "PC")
                    aVal = a.getA();
                if (b.name === "PC")
                    bVal = b.getB();
                if (bVal !== aVal) { }
                else
                    this.emulator.skipInstruction();
            }),
            IFG: new Op_1.Op(this, "IFG", OpCode_1.OpCode.OPERATION_IFG, 2, function (a, b) {
                var aVal = a.getA(), bVal = b.getB();
                if (a.name === "PC")
                    aVal = a.getA();
                if (b.name === "PC")
                    bVal = b.getB();
                if (bVal > aVal) { }
                else
                    this.emulator.skipInstruction();
            }),
            IFA: new Op_1.Op(this, "IFA", OpCode_1.OpCode.OPERATION_IFA, 2, function (a, b) {
                var aVal = a.getA(), bVal = b.getB();
                if (a.name === "PC")
                    aVal = a.getA();
                if (b.name === "PC")
                    bVal = b.getB();
                aVal = Utils_1.Utils.to32BitSigned(aVal);
                bVal = Utils_1.Utils.to32BitSigned(bVal);
                if (bVal > aVal) { }
                else
                    this.emulator.skipInstruction();
            }),
            IFL: new Op_1.Op(this, "IFL", OpCode_1.OpCode.OPERATION_IFL, 2, function (a, b) {
                var aVal = a.getA(), bVal = b.getB();
                if (a.name === "PC")
                    aVal = a.getA();
                if (b.name === "PC")
                    bVal = b.getB();
                if (bVal < aVal) { }
                else
                    this.emulator.skipInstruction();
            }),
            IFU: new Op_1.Op(this, "IFU", OpCode_1.OpCode.OPERATION_IFU, 2, function (a, b) {
                var aVal = a.getA(), bVal = b.getB();
                if (a.name === "PC")
                    aVal = a.getA();
                if (b.name === "PC")
                    bVal = b.getB();
                aVal = Utils_1.Utils.to32BitSigned(aVal);
                bVal = Utils_1.Utils.to32BitSigned(bVal);
                if (bVal < aVal) { }
                else
                    this.emulator.skipInstruction();
            }),
            ADX: new Op_1.Op(this, "ADX", OpCode_1.OpCode.OPERATION_ADX, 3, function (a, b) {
                var aVal = a.getA(), bVal = b.getB();
                if (a.name === "PC")
                    aVal = a.getA();
                if (b.name === "PC")
                    bVal = b.getB();
                var res = aVal + bVal + this.emulator.Registers.EX.get();
                this.emulator.Registers.EX.set(res > 0xffff ? 1 : 0);
                b.set(res & 0xffff);
            }),
            SBX: new Op_1.Op(this, "SBX", OpCode_1.OpCode.OPERATION_SBX, 3, function (a, b) {
                var aVal = a.getA(), bVal = b.getB();
                if (a.name === "PC")
                    aVal = a.getA();
                if (b.name === "PC")
                    bVal = b.getB();
                var res = bVal - aVal + this.emulator.Registers.EX.get();
                this.emulator.Registers.EX.set(res < 0 ? 0xffff : 0);
                b.set(res & 0xffff);
            }),
            STI: new Op_1.Op(this, "STI", OpCode_1.OpCode.OPERATION_STI, 2, function (a, b) {
                var aVal = a.getA(), bVal = b.getB();
                if (a.name === "PC")
                    aVal = a.getA();
                if (b.name === "PC")
                    bVal = b.getB();
                b.set(aVal);
                //a.set(bVal);
                this.emulator.Registers.I.set((this.emulator.Registers.I.get() + 1) & 0xffff);
                this.emulator.Registers.J.set((this.emulator.Registers.J.get() + 1) & 0xffff);
            }),
            STD: new Op_1.Op(this, "STD", OpCode_1.OpCode.OPERATION_STD, 2, function (a, b) {
                var aVal = a.getA(), bVal = b.getB();
                if (a.name === "PC")
                    aVal = a.getA();
                if (b.name === "PC")
                    bVal = b.getB();
                b.set(aVal);
                //a.set(bVal);
                this.emulator.Registers.I.set((this.emulator.Registers.I.get() - 1) & 0xffff);
                this.emulator.Registers.J.set((this.emulator.Registers.J.get() - 1) & 0xffff);
            }),
            JSR: new Op_1.Op(this, "JSR", OpCode_1.OpCode.OPERATION_JSR, 3, function (a) {
                var aVal = a.getA();
                this.emulator.Registers.SP.push(this.emulator.Registers.PC.get());
                this.emulator.Registers.PC.set(aVal);
            }, this.SpecialOpSet),
            INT: new Op_1.Op(this, "INT", OpCode_1.OpCode.OPERATION_INT, 4, function (a) {
                var aVal = a.getA();
                this.emulator.interruptQueue.push(aVal);
            }, this.SpecialOpSet),
            IAG: new Op_1.Op(this, "IAG", OpCode_1.OpCode.OPERATION_IAG, 1, function (a) {
                var aVal = a.getA();
                a.set(this.emulator.Registers.IA.get());
            }, this.SpecialOpSet),
            IAS: new Op_1.Op(this, "IAS", OpCode_1.OpCode.OPERATION_IAS, 1, function (a) {
                this.emulator.Registers.IA.set(a.getA());
            }, this.SpecialOpSet),
            RFI: new Op_1.Op(this, "RFI", OpCode_1.OpCode.OPERATION_RFI, 3, function (a) {
                var aVal = a.getA();
                this.emulator.interruptQueueingEnabled = false;
                this.emulator.Registers.A.set(this.emulator.Registers.SP.pop());
                this.emulator.Registers.PC.set(this.emulator.Registers.SP.pop());
            }, this.SpecialOpSet),
            IAQ: new Op_1.Op(this, "IAQ", OpCode_1.OpCode.OPERATION_IAQ, 2, function (a) {
                var aVal = a.getA();
                if (aVal === 0)
                    this.emulator.interruptQueueingEnabled = false;
                else
                    this.emulator.interruptQueueingEnabled = true;
            }, this.SpecialOpSet),
            HWN: new Op_1.Op(this, "HWN", OpCode_1.OpCode.OPERATION_HWN, 2, function (a) {
                var aVal = a.getA();
                a.set(this.emulator.devices.length);
            }, this.SpecialOpSet),
            HWQ: new Op_1.Op(this, "HWQ", OpCode_1.OpCode.OPERATION_HWQ, 4, function (a) {
                var dev = this.emulator.devices[a.getA()];
                if (dev) {
                    this.emulator.Registers.A.set(dev.id & 0xffff);
                    this.emulator.Registers.B.set((dev.id >> 16) & 0xffff);
                    this.emulator.Registers.C.set(dev.version & 0xffff);
                    this.emulator.Registers.X.set(dev.manufacturer & 0xffff);
                    this.emulator.Registers.Y.set((dev.manufacturer >> 16) & 0xffff);
                }
            }, this.SpecialOpSet),
            HWI: new Op_1.Op(this, "HWI", OpCode_1.OpCode.OPERATION_HWI, 4, function (a) {
                var dev = this.emulator.devices[a.getA()];
                if (dev)
                    dev.interrupt();
            }, this.SpecialOpSet),
        };
    };
    Emulator.prototype.nextInstruction = function () {
        var data = this.RAM[this.PC.inc()];
        var instruction = Utils_1.Utils.parseInstruction(data);
        var op;
        if (instruction.opcode === 0) {
            instruction = Utils_1.Utils.parseSpecialInstruction(data);
            op = this.SpecialOpSet[instruction.opcode];
        }
        else
            op = this.OpSet[instruction.opcode];
        if (!op) {
            var err = "Invalid opcode " + instruction.opcode;
            console.warn(err);
            throw err;
        }
        if (this.verbose) {
            console.log(Utils_1.Utils.hex(this.Registers.PC.get()) + "\t" +
                op.name + "\t(" +
                Utils_1.Utils.hex(instruction.a) + ",\t" +
                Utils_1.Utils.hex(instruction.b) + ")");
        }
        op.exec(instruction.a, instruction.b);
    };
    Emulator.prototype.nextWord = function () {
        return this.RAM[this.Registers.PC.inc()];
    };
    Emulator.prototype.getParamValue = function (val) {
        return this.Values[val.toString()];
    };
    Emulator.prototype.skipInstruction = function () {
        var instruction = Utils_1.Utils.parseInstruction(this.RAM[this.PC.inc()]);
        // skip "next word" values by invoking get() on the params
        this.getParamValue(instruction.a).get();
        if (instruction.opcode != 0)
            this.getParamValue(instruction.b).get();
        if (instruction.opcode >= OpCode_1.OpCode.OPERATION_IFB && instruction.opcode <= OpCode_1.OpCode.OPERATION_IFU) {
            // if we have skipped a conditional instruction, skip additional instruction 
            // at cost of an additional cycle.  continue until a non-conditional instruction
            // has been skipped
            this.skipInstruction();
        }
    };
    Emulator.prototype.processInterrupt = function (message) {
        if (this.Registers.IA.get() != 0) {
            this.interruptQueueingEnabled = true;
            this.Registers.SP.push(this.Registers.PC.get()); // push PC onto the stack
            this.Registers.SP.push(this.Registers.A.get()); // followed by pusing A to the stack
            this.Registers.PC.set(this.Registers.IA.get()); // set PC to IA
            this.Registers.A.set(message); // set A to the interrupt message
        }
    };
    Emulator.prototype.interrupt = function (message) {
        this.interruptQueue.push(message);
        if (this.interruptQueue.length > 256) {
            // catch fire?
            console.warn("DCUP-16 is on fire");
            throw "Too many interrupts";
        }
    };
    /**
     * Reset DCPU
     */
    Emulator.prototype.reset = function () {
        console.log("--- DCPU-16 Emulator ---");
        this.PC.set(0);
        this.RAM = new Array(0x10000);
        this.interruptQueueingEnabled = false;
        this.interruptQueue = [];
        for (var r in this.Registers) {
            this.Registers[r].set(0);
        }
        for (var i = 0; i < this.devices.length; i++) {
            this.devices[i].init();
        }
    };
    /**
     * Loads a program into memory.
     * @ _program the program you want to load into memory, as an array of bytes.
     */
    Emulator.prototype.load = function (_program) {
        // load program into RAM
        for (var i = 0; i < _program.length; i++) {
            if (_program[i] != undefined)
                this.RAM[i] = _program[i];
        }
    };
    Emulator.prototype.step = function () {
        this.nextInstruction();
        // process one interrupt if we have one
        if (this.interruptQueueingEnabled == false && this.interruptQueue.length > 0) {
            this.processInterrupt(this.interruptQueue.shift());
        }
        return true;
    };
    Emulator.prototype.addDevice = function (device) {
        this.devices.push(device);
    };
    Emulator.prototype.removeDevice = function (device) {
        var index = this.devices.indexOf(device);
        if (index >= 0) {
            this.devices.splice(index, 1);
        }
    };
    return Emulator;
}());
exports.Emulator = Emulator;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Literal = (function () {
    function Literal(value) {
        this.value = value;
    }
    Literal.prototype.getA = function () {
        return this.value;
    };
    Literal.prototype.getB = function () {
        return this.value;
    };
    Literal.prototype.get = function () {
        return this.value;
    };
    Literal.prototype.set = function () { };
    return Literal;
}());
exports.Literal = Literal;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Op = (function () {
    function Op(_emulator, _name, _value, _cycles, __exec, _set) {
        if (_set === void 0) { _set = undefined; }
        this.emulator = _emulator;
        this.name = _name;
        this.value = _value;
        this.cycles = _cycles;
        this._exec = __exec;
        if (_set === undefined)
            _set = this.emulator.OpSet;
        _set[this.value] = this;
    }
    Op.prototype.exec = function (a, b) {
        var valA = this.emulator.getParamValue(a);
        var valB = this.emulator.getParamValue(b);
        if (!valA)
            throw new Error("Invalid 'a' value " + a);
        if (!valB)
            throw new Error("Invalid 'b' value " + b);
        this._exec(valA, valB);
        this.emulator.CPU_CYCLE += this.cycles;
    };
    return Op;
}());
exports.Op = Op;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var OpCode;
(function (OpCode) {
    OpCode[OpCode["OPERATION_SET"] = 1] = "OPERATION_SET";
    OpCode[OpCode["OPERATION_ADD"] = 2] = "OPERATION_ADD";
    OpCode[OpCode["OPERATION_SUB"] = 3] = "OPERATION_SUB";
    OpCode[OpCode["OPERATION_MUL"] = 4] = "OPERATION_MUL";
    OpCode[OpCode["OPERATION_MLI"] = 5] = "OPERATION_MLI";
    OpCode[OpCode["OPERATION_DIV"] = 6] = "OPERATION_DIV";
    OpCode[OpCode["OPERATION_DVI"] = 7] = "OPERATION_DVI";
    OpCode[OpCode["OPERATION_MOD"] = 8] = "OPERATION_MOD";
    OpCode[OpCode["OPERATION_MDI"] = 9] = "OPERATION_MDI";
    OpCode[OpCode["OPERATION_AND"] = 10] = "OPERATION_AND";
    OpCode[OpCode["OPERATION_BOR"] = 11] = "OPERATION_BOR";
    OpCode[OpCode["OPERATION_XOR"] = 12] = "OPERATION_XOR";
    OpCode[OpCode["OPERATION_SHR"] = 13] = "OPERATION_SHR";
    OpCode[OpCode["OPERATION_ASR"] = 14] = "OPERATION_ASR";
    OpCode[OpCode["OPERATION_SHL"] = 15] = "OPERATION_SHL";
    OpCode[OpCode["OPERATION_IFB"] = 16] = "OPERATION_IFB";
    OpCode[OpCode["OPERATION_IFC"] = 17] = "OPERATION_IFC";
    OpCode[OpCode["OPERATION_IFE"] = 18] = "OPERATION_IFE";
    OpCode[OpCode["OPERATION_IFN"] = 19] = "OPERATION_IFN";
    OpCode[OpCode["OPERATION_IFG"] = 20] = "OPERATION_IFG";
    OpCode[OpCode["OPERATION_IFA"] = 21] = "OPERATION_IFA";
    OpCode[OpCode["OPERATION_IFL"] = 22] = "OPERATION_IFL";
    OpCode[OpCode["OPERATION_IFU"] = 23] = "OPERATION_IFU";
    OpCode[OpCode["OPERATION_ADX"] = 26] = "OPERATION_ADX";
    OpCode[OpCode["OPERATION_SBX"] = 27] = "OPERATION_SBX";
    OpCode[OpCode["OPERATION_STI"] = 30] = "OPERATION_STI";
    OpCode[OpCode["OPERATION_STD"] = 31] = "OPERATION_STD";
    OpCode[OpCode["OPERATION_JSR"] = 1] = "OPERATION_JSR";
    OpCode[OpCode["OPERATION_INT"] = 8] = "OPERATION_INT";
    OpCode[OpCode["OPERATION_IAG"] = 9] = "OPERATION_IAG";
    OpCode[OpCode["OPERATION_IAS"] = 10] = "OPERATION_IAS";
    OpCode[OpCode["OPERATION_RFI"] = 11] = "OPERATION_RFI";
    OpCode[OpCode["OPERATION_IAQ"] = 12] = "OPERATION_IAQ";
    OpCode[OpCode["OPERATION_HWN"] = 16] = "OPERATION_HWN";
    OpCode[OpCode["OPERATION_HWQ"] = 17] = "OPERATION_HWQ";
    OpCode[OpCode["OPERATION_HWI"] = 18] = "OPERATION_HWI";
})(OpCode = exports.OpCode || (exports.OpCode = {}));


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Register = (function () {
    function Register(_name, _value, _emulator) {
        this.name = _name;
        this.value = _value;
        this.emulator = _emulator;
        this.contents = 0;
    }
    Register.prototype.getA = function () {
        return this.contents;
    };
    Register.prototype.getB = function () {
        return this.contents;
    };
    Register.prototype.get = function () {
        return this.contents;
    };
    Register.prototype.set = function (val) {
        this.contents = val & 0xFFFF;
    };
    return Register;
}());
exports.Register = Register;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var RegisterCode;
(function (RegisterCode) {
    RegisterCode[RegisterCode["REGISTER_A"] = 0] = "REGISTER_A";
    RegisterCode[RegisterCode["REGISTER_B"] = 1] = "REGISTER_B";
    RegisterCode[RegisterCode["REGISTER_C"] = 2] = "REGISTER_C";
    RegisterCode[RegisterCode["REGISTER_X"] = 3] = "REGISTER_X";
    RegisterCode[RegisterCode["REGISTER_Y"] = 4] = "REGISTER_Y";
    RegisterCode[RegisterCode["REGISTER_Z"] = 5] = "REGISTER_Z";
    RegisterCode[RegisterCode["REGISTER_I"] = 6] = "REGISTER_I";
    RegisterCode[RegisterCode["REGISTER_J"] = 7] = "REGISTER_J";
    RegisterCode[RegisterCode["REGISTER_SP"] = 27] = "REGISTER_SP";
    RegisterCode[RegisterCode["REGISTER_PC"] = 28] = "REGISTER_PC";
    RegisterCode[RegisterCode["REGISTER_EX"] = 29] = "REGISTER_EX";
})(RegisterCode = exports.RegisterCode || (exports.RegisterCode = {}));


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var RegisterPlusNextWord = (function () {
    function RegisterPlusNextWord(_register) {
        this.cachedResult = null;
        this.register = _register;
        this.emulator = _register.emulator;
        this.cachedResult = null;
    }
    RegisterPlusNextWord.prototype.getA = function () {
        var nw = this.emulator.nextWord();
        this.cachedResult = (this.register.get() + nw) & 0xFFFF;
        return this.emulator.RAM[this.cachedResult] || 0;
    };
    RegisterPlusNextWord.prototype.getB = function () {
        return this.getA();
    };
    RegisterPlusNextWord.prototype.get = function () {
        return this.getA();
    };
    RegisterPlusNextWord.prototype.set = function (val) {
        this.emulator.RAM[this.cachedResult] = val;
    };
    return RegisterPlusNextWord;
}());
exports.RegisterPlusNextWord = RegisterPlusNextWord;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var RegisterValue = (function () {
    function RegisterValue(_register) {
        this.register = _register;
        this.emulator = _register.emulator;
    }
    RegisterValue.prototype.getA = function () {
        return this.emulator.RAM[this.register.get()] || 0;
    };
    RegisterValue.prototype.getB = function () {
        return this.getA();
    };
    RegisterValue.prototype.get = function () {
        return this.getA();
    };
    RegisterValue.prototype.set = function (val) {
        this.emulator.RAM[this.register.get()] = val;
    };
    return RegisterValue;
}());
exports.RegisterValue = RegisterValue;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var StackPointerValue = (function () {
    function StackPointerValue(emulator) {
        this.emulator = emulator;
    }
    StackPointerValue.prototype.get = function () {
        return this.emulator.Registers.SP.get();
    };
    StackPointerValue.prototype.getB = function () {
        return this.get();
    };
    StackPointerValue.prototype.getA = function () {
        return this.emulator.Registers.SP.pop();
    };
    StackPointerValue.prototype.set = function (val) {
        this.emulator.Registers.SP.push(val);
    };
    return StackPointerValue;
}());
exports.StackPointerValue = StackPointerValue;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Emulator_1 = __webpack_require__(5);
var Monitor_1 = __webpack_require__(4);
var Keyboard_1 = __webpack_require__(3);
var Clock_1 = __webpack_require__(2);
/**
 * Setup a canvas where we can draw our LEM Monitor we will be attaching to the DCPU.
 */
var canvas = document.createElement("canvas");
canvas.width = 128;
canvas.height = 96;
canvas.style.backgroundColor = "#777777";
document.body.appendChild(canvas);
var context = canvas.getContext('2d');
/**
 * Initialize the emulator.
 */
var emulator = new Emulator_1.Emulator();
var clock = new Clock_1.Clock(emulator);
var keyboard = new Keyboard_1.Keyboard(emulator);
var monitor = new Monitor_1.Monitor(emulator, function (x, y, width, height, color) {
    context.fillStyle = "rgb(" + color.r + "," + color.g + "," + color.b + ")";
    context.fillRect(x, y, width, height);
});
emulator.addDevice(keyboard);
emulator.addDevice(clock);
emulator.addDevice(monitor);
document.body.onkeyup = function (event) {
    keyboard.keyUp(event);
};
document.body.onkeydown = function (event) {
    keyboard.keyDown(event);
};
var testProgram = [0x84c1, 0x86d2, 0x000d, 0x7f81, 0x001a, 0x5801, 0x000d, 0x7c0b,
    0xf000, 0x02c1, 0x8000, 0x88c2, 0x8b81, 0x0048, 0x0065, 0x006c,
    0x006c, 0x006f, 0x0020, 0x0077, 0x006f, 0x0072, 0x006c, 0x0064,
    0x0021, 0x0000, 0xef81];
emulator.reset();
emulator.load(testProgram);
/**
 * Not super accurate timing, but good enough for a demo.
 */
var lastUpdate = Date.now();
var exec = function () {
    var delta = Date.now() - lastUpdate;
    lastUpdate += delta;
    for (; delta >= 10; delta -= 10) {
        clock.update(10);
        //Step 10 time per ms = 10khz
        for (var i = 0; i < 1000; i++)
            emulator.step();
    }
    monitor.refresh();
    setTimeout(exec, 100);
};
exec();


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map