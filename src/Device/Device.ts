export abstract class Device {
    public readonly id: any;
    public readonly version: any;
    public readonly manufacturer: any;
    public readonly emulator: any;

    public constructor(id: any, version: any, manufacturer: any, emulator: any) {
        this.id = id;
        this.version = version;
        this.manufacturer = manufacturer;
        this.emulator = emulator;
    }

    public abstract interrupt(): void;
    public abstract init(): void;
}