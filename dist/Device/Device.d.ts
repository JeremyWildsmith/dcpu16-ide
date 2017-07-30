export declare abstract class Device {
    readonly id: any;
    readonly version: any;
    readonly manufacturer: any;
    readonly emulator: any;
    constructor(id: any, version: any, manufacturer: any, emulator: any);
    abstract interrupt(): void;
    abstract init(): void;
}
