"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Emulator_1 = require("./Emulator");
var Monitor_1 = require("./Device/Monitor");
var Keyboard_1 = require("./Device/Keyboard");
var Clock_1 = require("./Device/Clock");
var testProgram = [
    31776, 243, 33889, 36993, 33793, 31777, 325, 31776, 277, 33889, 49281, 34817, 31777, 358, 31776, 277, 33985, 6145, 35842, 34515, 737, 31776, 265, 35010, 50387, 32641, 17, 32064, 186, 31745, 46082, 31777, 4816, 31809, 733, 31776, 77, 33746, 733, 32641, 46, 31777, 60, 33793, 31296, 733, 31745, 19630, 31777, 29946, 31809, 734, 31776, 77, 33746, 734, 32641, 67, 36865, 35873, 31296, 734, 38913, 31777, 19630, 31296, 734, 33747, 733, 31776, 96, 33747, 734, 31776, 118, 32641, 67, 4865, 5889, 33089, 31905, 737, 33985, 13441, 402, 1682, 1, 6465, 35010, 34978, 50390, 32641, 83, 24737, 24705, 25473, 34817, 31296, 733, 30802, 736, 25473, 2049, 3009, 736, 31777, 391, 47138, 31776, 298, 30721, 732, 35842, 31777, 391, 31776, 277, 25473, 33793, 31296, 734, 34866, 31776, 154, 33842, 32705, 500, 520, 32722, 490, 520, 31776, 166, 31905, 424, 49314, 30913, 520, 14753, 35010, 34978, 34259, 32641, 138, 30721, 732, 36866, 31777, 424, 33889, 49281, 31776, 277, 25473, 32769, 31296, 734, 33810, 32705, 490, 520, 33811, 32705, 510, 520, 25473, 35794, 735, 25473, 36818, 735, 25473, 35777, 735, 31873, 545, 31776, 223, 50177, 50209, 50241, 31841, 8264, 31296, 734, 25473, 31762, 19630, 31776, 191, 352, 1793, 2817, 6913, 7937, 3841, 4865, 5889, 37889, 31296, 734, 34866, 34753, 735, 35891, 32641, 215, 33810, 31873, 521, 33811, 31873, 533, 31776, 223, 24737, 24705, 24673, 24801, 24769, 24641, 24609, 25473, 31905, 457, 49314, 4289, 14753, 35010, 34978, 34259, 32641, 227, 30721, 732, 37890, 31777, 457, 33889, 49281, 31776, 277, 25473, 6656, 35011, 6688, 31969, 557, 33953, 15378, 23602, 1, 7873, 737, 31970, 35, 34978, 30899, 732, 32641, 249, 34002, 25473, 32641, 244, 22561, 737, 35874, 6305, 34978, 31906, 48, 5665, 2, 31776, 277, 25473, 3841, 4865, 769, 31748, 32, 30722, 324, 42095, 46223, 4203, 9473, 3339, 34850, 34818, 34099, 32641, 287, 24577, 24705, 24673, 25473, 769, 1793, 3841, 7937, 34017, 97, 44136, 3841, 44038, 35042, 33812, 32641, 303, 24865, 32034, 48, 35043, 34850, 34036, 32641, 311, 24801, 24673, 24609, 24577, 25473, 32768, 61, 61, 61, 61, 61, 32, 68, 67, 80, 85, 45, 49, 54, 32, 68, 105, 97, 103, 110, 111, 115, 116, 105, 99, 115, 32, 61, 61, 61, 61, 61, 61, 0, 32, 68, 105, 115, 99, 111, 118, 101, 114, 101, 100, 32, 104, 97, 114, 100, 119, 97, 114, 101, 58, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 0, 32, 67, 108, 111, 99, 107, 32, 116, 105, 109, 101, 58, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 0, 32, 77, 101, 100, 105, 97, 32, 115, 116, 97, 116, 117, 115, 58, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 0, 32, 77, 101, 100, 105, 97, 32, 116, 101, 115, 116, 58, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 0, 97, 118, 97, 105, 108, 97, 98, 108, 101, 0, 110, 111, 110, 101, 32, 32, 32, 32, 32, 0, 69, 82, 82, 79, 82, 32, 32, 32, 32, 0, 65535, 115, 117, 99, 99, 101, 115, 115, 32, 32, 32, 32, 0, 102, 97, 105, 108, 101, 100, 32, 32, 32, 32, 32, 0, 105, 110, 32, 112, 114, 111, 103, 114, 101, 115, 115, 0, 62997, 29513, 32, 32, 88, 46, 32, 76, 69, 77, 45, 49, 56, 48, 50, 32, 77, 111, 110, 105, 116, 111, 114, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 0, 29702, 12495, 32, 32, 88, 46, 32, 71, 101, 110, 101, 114, 105, 99, 32, 75, 101, 121, 98, 111, 97, 114, 100, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 0, 46082, 4816, 32, 32, 88, 46, 32, 71, 101, 110, 101, 114, 105, 99, 32, 67, 108, 111, 99, 107, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 0, 19630, 29946, 32, 32, 88, 46, 32, 72, 77, 68, 50, 48, 52, 51, 32, 72, 97, 114, 111, 108, 100, 32, 77, 101, 100, 105, 97, 32, 68, 114, 105, 118, 101, 32, 0, 48956, 17082, 32, 32, 88, 46, 32, 83, 80, 69, 68, 51, 32, 68, 105, 115, 112, 108, 97, 121, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 0, 5, 65535, 65535, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
];
var emulator = new Emulator_1.Emulator();
emulator.async = true;
emulator.verbose = false;
emulator.paused = true;
emulator.devices.push(new Monitor_1.Monitor(emulator));
emulator.devices.push(new Clock_1.Clock(emulator));
emulator.devices.push(new Keyboard_1.Keyboard(emulator));
emulator.reboot();
emulator.paused = true;
emulator.run(testProgram);
//# sourceMappingURL=TestApp.js.map