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
//# sourceMappingURL=StackPointerValue.js.map