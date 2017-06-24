export class RegisterValue {
    public register;
    public emulator;

    public constructor(_register) {
        this.register = _register;
        this.emulator = _register.emulator;
    }

    public getA() {
        return this.emulator.RAM[this.register.get()] || 0;
    }

    public getB() {
        return this.getA();
    }

    public get() {
        return this.getA();
    }

    public set(val) {
        this.emulator.RAM[this.register.get()] = val;
    }
}