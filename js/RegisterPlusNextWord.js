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
        if ((nw & 0x8000) !== 0) {
            nw = -((nw ^ 0xFFFF) + 1);
        }
        this.cachedResult = this.register.get() + nw;
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
//# sourceMappingURL=RegisterPlusNextWord.js.map