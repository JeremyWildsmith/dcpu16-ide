import { Device } from "./Device";
export declare class Clock extends Device {
    interruptsOn: boolean;
    elapsed: number;
    interval: number;
    interruptMessage: number;
    private running;
    private duration;
    private elapsedTicks;
    constructor(_emulator: any);
    init(): void;
    interrupt(): void;
    private start(duration);
    private stop();
    private tick();
    update(deltaTime: number): void;
}
