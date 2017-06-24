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
    Utils.color16To32 = function (c) {
        var r = (((c & 0xf00) >> 8) * 16) << 16;
        var g = (((c & 0x0f0) >> 4) * 16) << 8;
        var b = (c & 0x00f) * 16;
        return Utils.makeColor(r | g | b);
    };
    Utils.makeColor = function (d) {
        var hex = Number(d).toString(16);
        hex = "000000".substr(0, 6 - hex.length) + hex;
        return "#" + hex;
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
//# sourceMappingURL=Utils.js.map