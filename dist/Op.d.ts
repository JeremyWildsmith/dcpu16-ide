export declare class Op {
    private emulator;
    private name;
    private value;
    private cycles;
    private _exec;
    constructor(_emulator: any, _name: any, _value: any, _cycles: any, __exec: any, _set?: any);
    exec(a: any, b: any): void;
}
