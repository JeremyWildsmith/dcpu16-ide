import { Device } from "./Device";
export declare class Keyboard extends Device {
    downKeys: any;
    keys: any[];
    interruptsOn: boolean;
    interruptMessage: number;
    constructor(_emulator: any);
    init(): void;
    keyDown(event: any): boolean;
    keyUp(event: any): boolean;
    private convert(code, event);
    interrupt(): void;
}
