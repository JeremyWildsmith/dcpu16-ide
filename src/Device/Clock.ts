// https://raw.github.com/gibbed/0x10c-Notes/master/hardware/clock.txt

import { Device } from "./Device";

export class Clock extends Device {
    public interruptsOn = false;
    public elapsed = 0;
    public interval = 0;
    public interruptMessage = 0;
    private running: boolean = false;
    private duration: number;
    private elapsedTicks = 0;

    public constructor(_emulator) {
        super(0x12d0b402, 1, 0x90099009, _emulator);
    }

    public init() {
        this.stop();
    }

    public interrupt() {
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
    }

    private start(duration) {
        this.stop();
        this.elapsed = 0;
        this.elapsedTicks = 0;
        this.duration = duration;
        this.running = true;
    }

    private stop() {
        this.running = false;
        this.elapsed = 0;
    }

    private tick() {
        if (this.interruptsOn)
            this.emulator.interrupt(this.interruptMessage);

        this.elapsedTicks = (this.elapsedTicks + 1) & 0xffff;
    }

    public update(deltaTime: number) {
        if (!this.running)
            return;

        this.elapsed += deltaTime;

        for (; this.elapsed >= this.duration; this.elapsed -= this.duration) {
            this.tick();
        }
    }
}