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
var Device_1 = require("./Device");
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
//# sourceMappingURL=Clock.js.map