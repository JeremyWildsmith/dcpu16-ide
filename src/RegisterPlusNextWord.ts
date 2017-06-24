export class RegisterPlusNextWord {
    public register;
    public emulator;
    public cachedResult = null;

    public constructor(_register) {
        this.register = _register;
        this.emulator = _register.emulator;
        this.cachedResult = null;
    }

    public getA(): any {
        var nw = this.emulator.nextWord();
        
        this.cachedResult = (this.register.get() + nw) & 0xFFFF;
        return this.emulator.RAM[this.cachedResult] || 0;
    }

    public getB(): any {
        return this.getA();
    }

    public get(): any {
        return this.getA();
    }

    public set(val) {
        this.emulator.RAM[this.cachedResult] = val;
    }
}