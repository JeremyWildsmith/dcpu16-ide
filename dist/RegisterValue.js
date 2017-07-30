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
//# sourceMappingURL=RegisterValue.js.map