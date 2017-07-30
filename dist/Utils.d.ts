export declare class Utils {
    static to32BitSigned(val: any): any;
    static to16BitSigned(val: any): number;
    static byteTo32BitSigned(val: any): any;
    static roundTowardsZero(val: any): any;
    static makeInstruction(opcode: any, a: any, b: any): any;
    static makeSpecialInstruction(opcode: any, a: any): number;
    static parseInstruction(instruction: any): {
        opcode: number;
        b: number;
        a: number;
    };
    static parseSpecialInstruction(instruction: any): {
        a: number;
        opcode: number;
        b: number;
    };
    static hex(num: any): string;
    static hex2(num: any): string;
    static makeVideoCell(glyph: any, blink: any, bg: any, fg: any): number;
    static unpackColor16(c: number): UtilsColor;
    static createImage(src: any): HTMLImageElement;
}
export declare class UtilsColor {
    r: number;
    g: number;
    b: number;
    constructor(r: number, g: number, b: number);
}
