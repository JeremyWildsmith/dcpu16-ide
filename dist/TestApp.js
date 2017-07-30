"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Emulator_1 = require("./Emulator");
var Monitor_1 = require("./Device/Monitor");
var Keyboard_1 = require("./Device/Keyboard");
var Clock_1 = require("./Device/Clock");
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
//# sourceMappingURL=TestApp.js.map