
export class Register {
    public name;
    public value;
    public emulator;
    public contents;

    public constructor(_name, _value, _emulator) {
        this.name = _name;
        this.value = _value;
        this.emulator = _emulator;
        this.contents = 0;
    }

    public getA() {
        return this.contents;
    }

    public getB() {
        return this.contents;
    }

    public get() {
        return this.contents;
    }

    public set(val) {
        this.contents = val & 0xFFFF;
    }
}