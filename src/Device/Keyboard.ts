﻿// https://raw.github.com/gibbed/0x10c-Notes/master/hardware/keyboard.txt

import { Device } from "./Device";

export class Keyboard extends Device {
    public downKeys: any = {};
    public keys = [];
    public interruptsOn = false;
    public interruptMessage = 0;

    public constructor(_emulator) {
        super(0x30cf7406, 1, 0x90099009, _emulator);
    }

    public init() {
        this.interruptsOn = false;
        this.interruptMessage = 0;
        this.keys = [];
        this.downKeys = {};
    }

    public keyDown(event) {
        var code = this.convert(event.keyCode, event);
        if (code == 0)
            return true;

        this.downKeys["" + code] = true;

        this.keys.push(code);

        if (this.interruptsOn)
            this.emulator.interrupt(this.interruptMessage);

        return event.keyCode == 8 ? false : true;
    }

    public keyUp(event) {
        var code = this.convert(event.keyCode, event);
        this.downKeys["" + code] = false;

        return event.keyCode == 8 ? false : true;
    }

    private convert(code, event): any {
        // TODO: convert key codes
        switch (code) {
            // backspace
            case 8:
                return 0x10;
            // tab
            case 9:
                return 0x09;
            // return
            case 13:
                return 0x11;
            // insert
            case 45:
                return 0x12;
            // delete
            case 46:
                return 0x13;
            // up arrow
            case 38:
                return 0x80;
            // down arrow
            case 40:
                return 0x81;
            // left arrow
            case 37:
                return 0x82;
            // right arrow
            case 39:
                return 0x83;
            // shift
            case 16:
                return 0x90;
            //ctrl
            case 17:
                return 0x91;
            // space
            case 32:
                return 0x20;
            // semicolon
            case 186:
                return 0x3B;
            // equal sign
            case 187:
                return 0x3D;
            // comma
            case 188:
                return 0x2C;
            // dash
            case 189:
                return 0x2D;
            // period
            case 190:
                return 0x2E;
            // forward slash
            case 191:
                return 0x2F;
            // grave accent
            case 192:
                return 0x60;
            // open bracket
            case 219:
                return 0x5B;
            // backslash
            case 220:
                return 0x5C;
            // close bracket
            case 221:
                return 0x5D;
            // single quote
            case 222:
                return 0x27;

            default:
                if (code >= 0x20 && code <= 0x7f) {
                    var str = String.fromCharCode(code);
                    if (!event.shiftKey)
                        str = str.toLowerCase()
                    return str.charCodeAt(0);
                }

                return 0;
        }
    }

    public interrupt() {
        var aVal = this.emulator.Registers.A.get();
        switch (aVal) {
            case 0:
                this.keys = [];
                break;

            case 1:
                var val = 0;
                if (this.keys.length > 0) {
                    val = this.keys[0];
                    this.keys.splice(0, 1);
                }
                this.emulator.Registers.C.set(val);
                break;

            case 2:
                var bVal = this.emulator.Registers.B.get();
                if (this.downKeys["" + bVal])
                    this.emulator.Registers.C.set(1);
                else
                    this.emulator.Registers.C.set(0);
                break;

            case 3: {
                var bVal = this.emulator.Registers.B.get();
                if (bVal != 0) {
                    this.interruptsOn = true;
                    this.interruptMessage = bVal;
                }
                else {
                    this.interruptsOn = false;
                }
                break;
            }
        }

    }
}