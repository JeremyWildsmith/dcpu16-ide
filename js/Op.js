"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Op = (function () {
    function Op(_emulator, _name, _value, _cycles, __exec, _set) {
        if (_set === void 0) { _set = function () { }; }
        this.emulator = _emulator;
        this.name = _name;
        this.value = _value;
        this.cycles = _cycles;
        this._exec = __exec;
        _set = _set || this.emulator.OpSet;
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
//# sourceMappingURL=Op.js.map