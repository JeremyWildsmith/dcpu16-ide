export class Utils {
    public static to32BitSigned(val) {
        if ((val & 0x8000) > 0) {
            return (((~val) + 1) & 0xffff) * -1;	// two's complement
        }
        return val;
    }

    public static to16BitSigned(val) {
        if (val < 0) {
            //return ((~val) + 1) & 0xffff;	// two's complement
            return ((val & 0x7fff) | 0x8000);
        }
        return val & 0xffff;
    }

    public static byteTo32BitSigned(val) {
        if ((val & 0x80) > 0) {
            return (((~val) + 1) & 0xff) * -1;	// two's complement
        }
        return val;
    }

    public static roundTowardsZero(val) {
        if (val < 0)
            val = Math.ceil(val);
        else
            val = Math.floor(val);
        return val;
    }

    public static makeInstruction(opcode, a, b) {
        var instruction = opcode;
        instruction |= (b << 5);
        instruction |= (a << 10);
        return instruction;
    }

    public static makeSpecialInstruction (opcode, a) {
        var instruction = 0;
        instruction |= (a << 10);
        instruction |= (opcode << 5);
        return instruction;
    }

    public static parseInstruction(instruction) {
        return {
            opcode: instruction & 0x001f,
            b: (instruction & 0x03e0) >> 5,
            a: (instruction & 0xfc00) >> 10
        }
    }

    public static parseSpecialInstruction(instruction) {
        return {
            a: (instruction & 0xfc00) >> 10,
            opcode: (instruction & 0x03e0) >> 5,
            b: 0
        }
    }

    public static hex(num) {
        return "0x" + Utils.to16BitSigned(num).toString(16);
    }

    public static hex2(num) {
        //var str = Utils.to16BitSigned(num).toString(16);
        var str = (num).toString(16);
        return "0x" + "0000".substr(str.length) + str;
    }

    public static makeVideoCell(glyph, blink, bg, fg) {
        var result = glyph & 0x7f;
        result |= (blink & 0x1) << 7;
        result |= (bg & 0xf) << 8;
        result |= (fg & 0xf) << 12;
        return result;
    }


    public static unpackColor16(c: number): UtilsColor {
        var r = ((c & 0xf00) >> 8) * 16;
        var g = ((c & 0x0f0) >> 4) * 16;
        var b = (c & 0x00f) * 16;

        return new UtilsColor(r, g, b);
    }

    public static createImage(src) {
        var img = new Image();
        img.src = src;
        return img;
    }
};

export class UtilsColor {
    public r: number;
    public g: number;
    public b: number;

    public constructor(r: number, g: number, b: number) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
}