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
var Device_1 = require("./Device");
var Utils_1 = require("../Utils");
var Monitor = (function (_super) {
    __extends(Monitor, _super);
    function Monitor(_emulator) {
        var _this = _super.call(this, 0x7349f615, 0x1802, 0x1c6c8b36, _emulator) || this;
        _this.defaultFont = [];
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
        _this.borderColor = 8;
        _this.zoom = 2;
        _this.memOffset = 0x8000;
        _this.fontOffset = 0x8180;
        _this.drawInterval = 0;
        _this.refreshCount = 0;
        _this.canvas = document.createElement("canvas");
        _this.canvas.width = _this.zoom * 128;
        _this.canvas.height = _this.zoom * 96;
        _this.canvas.style.backgroundColor = "#777777";
        _this.canvas.className = "lem1820";
        _this.canvas.title = "LEM1802 Low Energy Monitor";
        _this.setBorderColor(_this.borderColor);
        document.body.appendChild(_this.canvas);
        _this.context = _this.canvas.getContext('2d');
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
        var this_ = this;
        setTimeout(function () {
            this_.drawInterval = setInterval(function () { this_.refresh(); }, 100);
        }, 1000);
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
                this.setBorderColor(bVal & 0xf);
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
        this.context.fillStyle = Utils_1.Utils.color16To32(bg);
        this.context.fillRect(x * 4 * this.zoom, y * 8 * this.zoom, 4 * this.zoom, 8 * this.zoom);
        if (blink && !this.blinkGlyphsOn)
            return;
        this.context.fillStyle = Utils_1.Utils.color16To32(fg);
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
                    this.context.fillRect((x * 4 + col) * this.zoom, (y * 8 + row) * this.zoom, this.zoom, this.zoom);
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
        this.context.fillStyle = "#777777";
        this.context.fillRect(0, 0, 128, 96);
        if (this.drawInterval != 0)
            clearInterval(this.drawInterval);
        this.drawInterval = 0;
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
    Monitor.prototype.setBorderColor = function (color) {
        this.borderColor = this.palette[color & 0xf];
        this.canvas.style.border = (3 * this.zoom) + "px solid " + Utils_1.Utils.color16To32(this.borderColor);
    };
    Monitor.prototype.getDOMElement = function () {
        return this.canvas;
    };
    Monitor.prototype.setZoom = function (_zoom) {
        this.zoom = _zoom;
        this.canvas.width = this.zoom * 128;
        this.canvas.height = this.zoom * 96;
        this.canvas.style.borderWidth = (3 * this.zoom) + "px";
    };
    return Monitor;
}(Device_1.Device));
exports.Monitor = Monitor;
//# sourceMappingURL=Monitor.js.map