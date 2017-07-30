import { Device } from "./Device/Device";
export declare class Emulator {
    private verbose;
    private RAM;
    private OpSet;
    private SpecialOpSet;
    private Registers;
    private PC;
    private Values;
    private BasicOperations;
    private devices;
    private interruptQueueingEnabled;
    private interruptQueue;
    constructor(verboseLogging?: boolean);
    private initRegisters();
    private initValues();
    private initOperations();
    private nextInstruction();
    private nextWord();
    private getParamValue(val);
    private skipInstruction();
    private processInterrupt(message);
    interrupt(message: any): void;
    /**
     * Reset DCPU
     */
    reset(): void;
    /**
     * Loads a program into memory.
     * @ _program the program you want to load into memory, as an array of bytes.
     */
    load(_program: number[]): void;
    step(): boolean;
    addDevice(device: Device): void;
    removeDevice(device: Device): void;
}
