export class StackPointerValue {
    public emulator;

    public constructor(emulator: any) {
        this.emulator = emulator;
    }

    public get() {
        return this.emulator.Registers.SP.get();
    }

    public getB() {
        return this.get();
    }

    public getA() {
        return this.emulator.Registers.SP.pop();
    }

    public set(val) {
        this.emulator.Registers.SP.push(val);
    }
}