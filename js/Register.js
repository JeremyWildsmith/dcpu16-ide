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
        this.contents = val;
    };
    return Register;
}());
exports.Register = Register;
//# sourceMappingURL=Register.js.map