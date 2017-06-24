import { Emulator } from "./Emulator";
import { Monitor } from "./Device/Monitor";
import { Keyboard } from "./Device/Keyboard";
import { UtilsColor } from "./Utils";
import { Clock } from "./Device/Clock";

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
var emulator = new Emulator();
var clock = new Clock(emulator);
var keyboard = new Keyboard(emulator);
var monitor = new Monitor(emulator, (x: number, y: number, width: number, height: number, color: UtilsColor) => {
    context.fillStyle = "rgb(" + color.r + "," + color.g + "," + color.b + ")";
    context.fillRect(x, y, width, height);
});

emulator.addDevice(keyboard);
emulator.addDevice(clock);
emulator.addDevice(monitor);

document.body.onkeyup = (event) => {
    keyboard.keyUp(event);
};

document.body.onkeydown = (event) => {
    keyboard.keyDown(event);
};

var testProgram = [0x84c1, 0x86d2, 0x000d, 0x7f81, 0x001a, 0x5801, 0x000d, 0x7c0b
    , 0xf000, 0x02c1, 0x8000, 0x88c2, 0x8b81, 0x0048, 0x0065, 0x006c
    , 0x006c, 0x006f, 0x0020, 0x0077, 0x006f, 0x0072, 0x006c, 0x0064
    , 0x0021, 0x0000, 0xef81];
emulator.reset();
emulator.load(testProgram);

/**
 * Not super accurate timing, but good enough for a demo.
 */
var lastUpdate = Date.now();

var exec = function () {
    let delta = Date.now() - lastUpdate;
    lastUpdate += delta;

    for (; delta >= 10; delta -= 10) {

        clock.update(10);

        //Step 10 time per ms = 10khz
        for (let i = 0; i < 1000; i++)
            emulator.step();
        
    }

    monitor.refresh();

    setTimeout(exec, 100);
}

exec();