import { Device } from "./Device";
import { UtilsColor } from "../Utils";
export declare class Monitor extends Device {
    static readonly SCREEN_WIDTH: number;
    static readonly SCREEN_HEIGHT: number;
    private blinkGlyphsOn;
    private refreshCount;
    private fontOffset;
    private memOffset;
    private palette;
    private defaultPalette;
    private defaultFont;
    private readonly monitorFillRect;
    constructor(_emulator: any, canvas: MonitorFillRect);
    init(): void;
    interrupt(): void;
    private memMapScreen(offset);
    private drawCell(x, y, word);
    private drawGlyph(x, y, glyph, fg, bg, blink);
    refresh(): void;
    disconnect(): void;
    private memMapFont(offset);
    private memMapPalette(offset);
    private memDumpFont(offset);
    private memDumpPalette(offset);
}
export interface MonitorFillRect {
    (x: number, y: number, width: number, height: number, color: UtilsColor): any;
}
