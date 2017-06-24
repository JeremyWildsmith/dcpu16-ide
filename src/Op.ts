
export class Op {
    private emulator: any;
    private name: any;
    private value: any;
    private cycles: any;
    private _exec: any;

    public constructor(_emulator: any, _name: any, _value: any, _cycles: any, __exec: any, _set: any = undefined) {
        this.emulator = _emulator;
        this.name = _name;
        this.value = _value;
        this.cycles = _cycles;
        this._exec = __exec;

        if(_set === undefined)
            _set = this.emulator.OpSet;

        _set[this.value] = this;
    }

    public exec(a: any, b: any): void {
        var valA = this.emulator.getParamValue(a);
        var valB = this.emulator.getParamValue(b);

        if (!valA) throw new Error("Invalid 'a' value " + a);
        if (!valB) throw new Error("Invalid 'b' value " + b);

        this._exec(valA, valB);
        this.emulator.CPU_CYCLE += this.cycles;
    }
}