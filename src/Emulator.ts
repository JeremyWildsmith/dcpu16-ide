
// http://pastebin.com/raw.php?i=Q4JvQvnM
// https://github.com/gibbed/0x10c-Notes


import { RegisterCode } from "./RegisterCode";
import { Utils } from "./Utils";
import { OpCode } from "./OpCode";
import { Register } from "./Register";
import { RegisterValue } from "./RegisterValue";
import { RegisterPlusNextWord } from "./RegisterPlusNextWord";
import { StackPointerValue } from "./StackPointerValue";
import { Literal } from "./Literal";
import { Op } from "./Op";
import { Device } from "./Device/Device";

export class Emulator {
    private verbose = false;
    private RAM = [];
    private OpSet = [];
    private SpecialOpSet = [];
    private Registers: any;
    private PC: any;
    private Values: any = [];
    private BasicOperations: any;
    private devices = [];
    private interruptQueueingEnabled;
    private interruptQueue = [];

    public constructor(verboseLogging = false) {
        this.verbose = verboseLogging;
        this.initRegisters();
        this.initValues();
        this.initOperations();
    }

    private initRegisters() {
        this.Registers = {
            A: new Register("A", RegisterCode.REGISTER_A, this),
            B: new Register("B", RegisterCode.REGISTER_B, this),
            C: new Register("C", RegisterCode.REGISTER_C, this),
            X: new Register("X", RegisterCode.REGISTER_X, this),
            Y: new Register("Y", RegisterCode.REGISTER_Y, this),
            Z: new Register("Z", RegisterCode.REGISTER_Z, this),
            I: new Register("I", RegisterCode.REGISTER_I, this),
            J: new Register("J", RegisterCode.REGISTER_J, this),
            SP: new Register("SP", RegisterCode.REGISTER_SP, this),
            PC: new Register("PC", RegisterCode.REGISTER_PC, this),
            EX: new Register("EX", RegisterCode.REGISTER_EX, this),
            IA: new Register("IA", 0xffff, this),
        };


        this.Registers.PC.inc = function () {
            var v = this.get();
            this.set(v + 1);
            return v;
        };

        this.PC = this.Registers.PC;

        this.Registers.SP.push = function (val) {
            this.contents = Utils.to16BitSigned(this.contents - 1);
            this.emulator.RAM[this.contents] = val;
        };

        this.Registers.SP.pop = function () {
            if (this.contents == 0)
                console.log("Warning: stack underflow");

            var val = this.emulator.RAM[this.contents] || 0;
            this.emulator.RAM[this.contents] = 0;	// TODO: should the emualtor alter the memory location when it is POPed?
            this.contents = (this.contents + 1) & 0xffff;
            return val;
        };
    }

    private initValues() {
        this.Values[0x00] = this.Registers.A;
        this.Values[0x01] = this.Registers.B;
        this.Values[0x02] = this.Registers.C;
        this.Values[0x03] = this.Registers.X;
        this.Values[0x04] = this.Registers.Y;
        this.Values[0x05] = this.Registers.Z;
        this.Values[0x06] = this.Registers.I;
        this.Values[0x07] = this.Registers.J;
        this.Values[0x08] = new RegisterValue(this.Registers.A);
        this.Values[0x09] = new RegisterValue(this.Registers.B);
        this.Values[0x0a] = new RegisterValue(this.Registers.C);
        this.Values[0x0b] = new RegisterValue(this.Registers.X);
        this.Values[0x0c] = new RegisterValue(this.Registers.Y);
        this.Values[0x0d] = new RegisterValue(this.Registers.Z);
        this.Values[0x0e] = new RegisterValue(this.Registers.I);
        this.Values[0x0f] = new RegisterValue(this.Registers.J);
        this.Values[0x10] = new RegisterPlusNextWord(this.Registers.A);
        this.Values[0x11] = new RegisterPlusNextWord(this.Registers.B);
        this.Values[0x12] = new RegisterPlusNextWord(this.Registers.C);
        this.Values[0x13] = new RegisterPlusNextWord(this.Registers.X);
        this.Values[0x14] = new RegisterPlusNextWord(this.Registers.Y);
        this.Values[0x15] = new RegisterPlusNextWord(this.Registers.Z);
        this.Values[0x16] = new RegisterPlusNextWord(this.Registers.I);
        this.Values[0x17] = new RegisterPlusNextWord(this.Registers.J);
        this.Values[0x18] = new StackPointerValue(this);
        this.Values[0x19] = new RegisterValue(this.Registers.SP);
        this.Values[0x1a] = new RegisterPlusNextWord(this.Registers.SP);
        this.Values[0x1b] = this.Registers.SP;
        this.Values[0x1c] = this.Registers.PC;
        this.Values[0x1d] = this.Registers.EX;
        this.Values[0x1e] = { // next word value
            emulator: this,
            getA: function () { return this.get(); },
            getB: function () { return this.get(); },
            get: function () {
                this.cachedResult = this.emulator.nextWord();
                return this.emulator.RAM[this.cachedResult] || 0;
            },
            set: function (val) {
                this.emulator.RAM[this.cachedResult] = val;
            }
        };
        this.Values[0x1f] = { // next word literal	
            emulator: this,
            getA: function () { return this.get(); },
            getB: function () { return this.get(); },
            get: function () { return this.emulator.nextWord(); },
            set: function (val) { }
        };

        this.Values[0x20] = new Literal(0xffff);	// -1
        for (var i = 0x21, literalVal = 0; i < 0x40; i++ , literalVal++) {
            this.Values[i] = new Literal(literalVal);
        }
    }

    private initOperations() {
        this.BasicOperations = {
            SET: new Op(this, "SET", OpCode.OPERATION_SET, 1, function (a, b) {
                var aVal = a.getA(), bVal = b.getB();

                if (a.name === "PC")
                    aVal = a.getA();

                if (b.name === "PC")
                    bVal = b.getB();

                b.set(aVal);

                // TODO: some applications assume that setting PC to itself should terminate the application
                //if(a == this.emulator.Registers.PC && b == this.emulator.Registers.PC) {
                //	this.emulator.Registers.PC.contents = Number.MAX_VALUE;
                //}
            }),

            ADD: new Op(this, "ADD", OpCode.OPERATION_ADD, 2, function (a, b) {
                var aVal = a.getA(); var bVal = b.getB();

                if (a.name === "PC")
                    aVal = a.getA();

                if (b.name === "PC")
                    bVal = b.getB();

                var res = aVal + bVal;
                if ((res & 0xffff0000) > 0)
                    this.emulator.Registers.EX.set(0x0001);
                else
                    this.emulator.Registers.EX.set(0);
                b.set(res & 0xffff);
            }),

            SUB: new Op(this, "SUB", OpCode.OPERATION_SUB, 2, function (a, b) {
                var aVal = a.getA(), bVal = b.getB();

                if (a.name === "PC")
                    aVal = a.getA();

                if (b.name === "PC")
                    bVal = b.getB();

                var res = bVal - aVal;

                if ((res) < 0)
                    this.emulator.Registers.EX.set(0xffff);
                else
                    this.emulator.Registers.EX.set(0);
                b.set(res & 0xffff);

            }),

            MUL: new Op(this, "MUL", OpCode.OPERATION_MUL, 2, function (a, b) {
                var aVal = a.getA(), bVal = b.getB();

                if (a.name === "PC")
                    aVal = a.getA();

                if (b.name === "PC")
                    bVal = b.getB();

                var res = aVal * bVal;
                this.emulator.Registers.EX.set((res >> 16) & 0xffff);
                b.set(res & 0xffff);
            }),

            MLI: new Op(this, "MLI", OpCode.OPERATION_MLI, 2, function (a, b) {
                var aVal = a.getA(), bVal = b.getB();

                if (a.name === "PC")
                    aVal = a.getA();

                if (b.name === "PC")
                    bVal = b.getB();

                aVal = Utils.to32BitSigned(aVal);
                bVal = Utils.to32BitSigned(bVal);

                var res = bVal * aVal;
                this.emulator.Registers.EX.set((res >> 16) & 0xffff);
                b.set(Utils.to16BitSigned(res));
            }),

            DIV: new Op(this, "DIV", OpCode.OPERATION_DIV, 3, function (a, b) {
                var aVal = a.getA(), bVal = b.getB();

                if (a.name === "PC")
                    aVal = a.getA();

                if (b.name === "PC")
                    bVal = b.getB();

                if (aVal === 0) {
                    this.emulator.Registers.EX.set(0);
                    b.set(0);
                }
                else {
                    var res = Math.floor(bVal / aVal);

                    var properShift = (bVal << 16) >>> 0
                    this.emulator.Registers.EX.set(Math.floor((properShift / aVal)) & 0xffff);
                    b.set(res & 0xffff);
                }
            }),

            DVI: new Op(this, "DVI", OpCode.OPERATION_DVI, 3, function (a, b) {
                var aVal = a.getA(), bVal = b.getB();

                if (a.name === "PC")
                    aVal = a.getA();

                if (b.name === "PC")
                    bVal = b.getB();

                aVal = Utils.to32BitSigned(aVal);
                bVal = Utils.to32BitSigned(bVal);

                if (aVal === 0) {
                    this.emulator.Registers.EX.set(0);
                    b.set(0);
                }
                else {
                    var res = Utils.roundTowardsZero(bVal / aVal);
                    this.emulator.Registers.EX.set(Utils.roundTowardsZero(((bVal << 16) / aVal)) & 0xffff);
                    b.set(Utils.to16BitSigned(res));
                }
            }),

            MOD: new Op(this, "MOD", OpCode.OPERATION_MOD, 3, function (a, b) {
                var aVal = a.getA(), bVal = b.getB();

                if (a.name === "PC")
                    aVal = a.getA();

                if (b.name === "PC")
                    bVal = b.getB();

                if (aVal === 0)
                    b.set(0);
                else
                    b.set(bVal % aVal);
            }),

            MDI: new Op(this, "MDI", OpCode.OPERATION_MDI, 3, function (a, b) {
                var aVal = a.getA(), bVal = b.getB();

                if (a.name === "PC")
                    aVal = a.getA();

                if (b.name === "PC")
                    bVal = b.getB();

                aVal = Utils.to32BitSigned(aVal);
                bVal = Utils.to32BitSigned(bVal);

                if (aVal === 0)
                    b.set(0);
                else
                    b.set(Utils.to16BitSigned(bVal % aVal));
            }),

            AND: new Op(this, "AND", OpCode.OPERATION_AND, 1, function (a, b) {
                var aVal = a.getA(), bVal = b.getB();

                if (a.name === "PC")
                    aVal = a.getA();

                if (b.name === "PC")
                    bVal = b.getB();

                b.set(bVal & aVal);
            }),

            BOR: new Op(this, "BOR", OpCode.OPERATION_BOR, 1, function (a, b) {
                var aVal = a.getA(), bVal = b.getB();

                if (a.name === "PC")
                    aVal = a.getA();

                if (b.name === "PC")
                    bVal = b.getB();

                b.set(bVal | aVal);
            }),

            XOR: new Op(this, "XOR", OpCode.OPERATION_XOR, 1, function (a, b) {
                var aVal = a.getA(), bVal = b.getB();

                if (a.name === "PC")
                    aVal = a.getA();

                if (b.name === "PC")
                    bVal = b.getB();

                b.set(bVal ^ aVal);
            }),

            SHR: new Op(this, "SHR", OpCode.OPERATION_SHR, 1, function (a, b) {
                var aVal = a.getA(), bVal = b.getB();

                if (a.name === "PC")
                    aVal = a.getA();

                if (b.name === "PC")
                    bVal = b.getB();

                this.emulator.Registers.EX.set(((bVal << 16) >> aVal) & 0xffff);
                b.set(bVal >>> aVal);
            }),

            ASR: new Op(this, "ASR", OpCode.OPERATION_ASR, 1, function (a, b) {
                var aVal = a.getA(), bVal = b.getB();

                if (a.name === "PC")
                    aVal = a.getA();

                if (b.name === "PC")
                    bVal = b.getB();

                bVal = Utils.to32BitSigned(bVal);
                this.emulator.Registers.EX.set(((bVal << 16) >>> aVal) & 0xffff);
                b.set((bVal >> aVal) & 0xffff);
            }),

            SHL: new Op(this, "SHL", OpCode.OPERATION_SHL, 1, function (a, b) {
                var aVal = a.getA(), bVal = b.getB();

                if (a.name === "PC")
                    aVal = a.getA();

                if (b.name === "PC")
                    bVal = b.getB();

                this.emulator.Registers.EX.set(((bVal << aVal) >> 16) & 0xffff);
                b.set((bVal << aVal) & 0xffff);
            }),

            IFB: new Op(this, "IFB", OpCode.OPERATION_IFB, 2, function (a, b) {
                var aVal = a.getA(), bVal = b.getB();

                if (a.name === "PC")
                    aVal = a.getA();

                if (b.name === "PC")
                    bVal = b.getB();

                if ((bVal & aVal) != 0) { }
                else this.emulator.skipInstruction();

            }),

            IFC: new Op(this, "IFC", OpCode.OPERATION_IFC, 2, function (a, b) {
                var aVal = a.getA(), bVal = b.getB();

                if (a.name === "PC")
                    aVal = a.getA();

                if (b.name === "PC")
                    bVal = b.getB();

                if ((bVal & aVal) === 0) { }
                else this.emulator.skipInstruction();

            }),

            IFE: new Op(this, "IFE", OpCode.OPERATION_IFE, 2, function (a, b) {
                var aVal = a.getA(), bVal = b.getB();

                if (a.name === "PC")
                    aVal = a.getA();

                if (b.name === "PC")
                    bVal = b.getB();

                if (bVal === aVal) { }
                else this.emulator.skipInstruction();
            }),

            IFN: new Op(this, "IFN", OpCode.OPERATION_IFN, 2, function (a, b) {
                var aVal = a.getA(), bVal = b.getB();

                if (a.name === "PC")
                    aVal = a.getA();

                if (b.name === "PC")
                    bVal = b.getB();

                if (bVal !== aVal) { }
                else this.emulator.skipInstruction();
            }),

            IFG: new Op(this, "IFG", OpCode.OPERATION_IFG, 2, function (a, b) {
                var aVal = a.getA(), bVal = b.getB();

                if (a.name === "PC")
                    aVal = a.getA();

                if (b.name === "PC")
                    bVal = b.getB();

                if (bVal > aVal) { }
                else this.emulator.skipInstruction();
            }),

            IFA: new Op(this, "IFA", OpCode.OPERATION_IFA, 2, function (a, b) {
                var aVal = a.getA(), bVal = b.getB();

                if (a.name === "PC")
                    aVal = a.getA();

                if (b.name === "PC")
                    bVal = b.getB();

                aVal = Utils.to32BitSigned(aVal);
                bVal = Utils.to32BitSigned(bVal);

                if (bVal > aVal) { }
                else this.emulator.skipInstruction();
            }),

            IFL: new Op(this, "IFL", OpCode.OPERATION_IFL, 2, function (a, b) {
                var aVal = a.getA(), bVal = b.getB();

                if (a.name === "PC")
                    aVal = a.getA();

                if (b.name === "PC")
                    bVal = b.getB();

                if (bVal < aVal) { }
                else this.emulator.skipInstruction();
            }),

            IFU: new Op(this, "IFU", OpCode.OPERATION_IFU, 2, function (a, b) {
                var aVal = a.getA(), bVal = b.getB();

                if (a.name === "PC")
                    aVal = a.getA();

                if (b.name === "PC")
                    bVal = b.getB();

                aVal = Utils.to32BitSigned(aVal);
                bVal = Utils.to32BitSigned(bVal);

                if (bVal < aVal) { }
                else this.emulator.skipInstruction();
            }),


            ADX: new Op(this, "ADX", OpCode.OPERATION_ADX, 3, function (a, b) {
                var aVal = a.getA(), bVal = b.getB();

                if (a.name === "PC")
                    aVal = a.getA();

                if (b.name === "PC")
                    bVal = b.getB();

                var res = aVal + bVal + this.emulator.Registers.EX.get();
                this.emulator.Registers.EX.set(res > 0xffff ? 1 : 0);
                b.set(res & 0xffff);
            }),

            SBX: new Op(this, "SBX", OpCode.OPERATION_SBX, 3, function (a, b) {
                var aVal = a.getA(), bVal = b.getB();

                if (a.name === "PC")
                    aVal = a.getA();

                if (b.name === "PC")
                    bVal = b.getB();

                var res = bVal - aVal + this.emulator.Registers.EX.get();
                this.emulator.Registers.EX.set(res < 0 ? 0xffff : 0);
                b.set(res & 0xffff);
            }),

            STI: new Op(this, "STI", OpCode.OPERATION_STI, 2, function (a, b) {
                var aVal = a.getA(), bVal = b.getB();

                if (a.name === "PC")
                    aVal = a.getA();

                if (b.name === "PC")
                    bVal = b.getB();

                b.set(aVal);
                //a.set(bVal);
                this.emulator.Registers.I.set((this.emulator.Registers.I.get() + 1) & 0xffff);
                this.emulator.Registers.J.set((this.emulator.Registers.J.get() + 1) & 0xffff);
            }),

            STD: new Op(this, "STD", OpCode.OPERATION_STD, 2, function (a, b) {
                var aVal = a.getA(), bVal = b.getB();

                if (a.name === "PC")
                    aVal = a.getA();

                if (b.name === "PC")
                    bVal = b.getB();

                b.set(aVal);
                //a.set(bVal);
                this.emulator.Registers.I.set((this.emulator.Registers.I.get() - 1) & 0xffff);
                this.emulator.Registers.J.set((this.emulator.Registers.J.get() - 1) & 0xffff);
            }),

            JSR: new Op(this, "JSR", OpCode.OPERATION_JSR, 3, function (a) {
                var aVal = a.getA();
                this.emulator.Registers.SP.push(this.emulator.Registers.PC.get());
                this.emulator.Registers.PC.set(aVal);
            }, this.SpecialOpSet),

            INT: new Op(this, "INT", OpCode.OPERATION_INT, 4, function (a) {
                var aVal = a.getA();
                this.emulator.interruptQueue.push(aVal);
            }, this.SpecialOpSet),

            IAG: new Op(this, "IAG", OpCode.OPERATION_IAG, 1, function (a) {
                var aVal = a.getA();
                a.set(this.emulator.Registers.IA.get());
            }, this.SpecialOpSet),

            IAS: new Op(this, "IAS", OpCode.OPERATION_IAS, 1, function (a) {
                this.emulator.Registers.IA.set(a.getA());
            }, this.SpecialOpSet),

            RFI: new Op(this, "RFI", OpCode.OPERATION_RFI, 3, function (a) {
                var aVal = a.getA();
                this.emulator.interruptQueueingEnabled = false;
                this.emulator.Registers.A.set(this.emulator.Registers.SP.pop());
                this.emulator.Registers.PC.set(this.emulator.Registers.SP.pop());

            }, this.SpecialOpSet),

            IAQ: new Op(this, "IAQ", OpCode.OPERATION_IAQ, 2, function (a) {
                var aVal = a.getA();
                if (aVal === 0)
                    this.emulator.interruptQueueingEnabled = false;
                else
                    this.emulator.interruptQueueingEnabled = true;
            }, this.SpecialOpSet),

            HWN: new Op(this, "HWN", OpCode.OPERATION_HWN, 2, function (a) {
                var aVal = a.getA();
                a.set(this.emulator.devices.length);
            }, this.SpecialOpSet),

            HWQ: new Op(this, "HWQ", OpCode.OPERATION_HWQ, 4, function (a) {
                var dev = this.emulator.devices[a.getA()];
                if (dev) {
                    this.emulator.Registers.A.set(dev.id & 0xffff);
                    this.emulator.Registers.B.set((dev.id >> 16) & 0xffff);
                    this.emulator.Registers.C.set(dev.version & 0xffff);
                    this.emulator.Registers.X.set(dev.manufacturer & 0xffff);
                    this.emulator.Registers.Y.set((dev.manufacturer >> 16) & 0xffff);
                }

            }, this.SpecialOpSet),

            HWI: new Op(this, "HWI", OpCode.OPERATION_HWI, 4, function (a) {
                var dev = this.emulator.devices[a.getA()];
                if (dev)
                    dev.interrupt();
            }, this.SpecialOpSet),
        };
    }

    private nextInstruction() {
        var data = this.RAM[this.PC.inc()];

        var instruction = Utils.parseInstruction(data);
        var op;
        if (instruction.opcode === 0) {
            instruction = Utils.parseSpecialInstruction(data);
            op = this.SpecialOpSet[instruction.opcode];
        }
        else
            op = this.OpSet[instruction.opcode];



        if (!op) {
            var err = "Invalid opcode " + instruction.opcode;
            console.warn(err);
            throw err;
        }

        if (this.verbose) {
            console.log(
                Utils.hex(this.Registers.PC.get()) + "\t" +
                op.name + "\t(" +
                Utils.hex(instruction.a) + ",\t" +
                Utils.hex(instruction.b) + ")"
            );
        }
        op.exec(instruction.a, instruction.b);
    }

    private nextWord() {
        return this.RAM[this.Registers.PC.inc()];
    }

    private getParamValue(val) {
        return this.Values[val.toString()];
    }

    private skipInstruction() {
        var instruction = Utils.parseInstruction(this.RAM[this.PC.inc()]);

        // skip "next word" values by invoking get() on the params
        this.getParamValue(instruction.a).get();
        if (instruction.opcode != 0)
            this.getParamValue(instruction.b).get();

        if (instruction.opcode >= OpCode.OPERATION_IFB && instruction.opcode <= OpCode.OPERATION_IFU) {
            // if we have skipped a conditional instruction, skip additional instruction 
            // at cost of an additional cycle.  continue until a non-conditional instruction
            // has been skipped
            this.skipInstruction();
        }

    }

    private processInterrupt(message) {
        if (this.Registers.IA.get() != 0) {
            this.interruptQueueingEnabled = true;
            this.Registers.SP.push(this.Registers.PC.get());	// push PC onto the stack
            this.Registers.SP.push(this.Registers.A.get());		// followed by pusing A to the stack
            this.Registers.PC.set(this.Registers.IA.get());		// set PC to IA
            this.Registers.A.set(message);						// set A to the interrupt message
        }
    }

    public interrupt(message) {
        this.interruptQueue.push(message);

        if (this.interruptQueue.length > 256) {
            // catch fire?
            console.warn("DCUP-16 is on fire");
            throw "Too many interrupts";
        }
    }

    /**
     * Reset DCPU
     */
    public reset() {
        console.log("--- DCPU-16 Emulator ---");

        this.PC.set(0);
        this.RAM = new Array(0x10000);

        this.interruptQueueingEnabled = false;
        this.interruptQueue = [];

        for (var r in this.Registers) {
            this.Registers[r].set(0);
        }

        for (var i = 0; i < this.devices.length; i++) {
            this.devices[i].init();
        }
    }

    /**
     * Loads a program into memory.  
     * @ _program the program you want to load into memory, as an array of bytes.
     */
    public load(_program: number[]) {

        // load program into RAM
        for (var i = 0; i < _program.length; i++) {
            if (_program[i] != undefined)
                this.RAM[i] = _program[i];
        }
    }

    public step() { 
        this.nextInstruction();

        // process one interrupt if we have one
        if (this.interruptQueueingEnabled == false && this.interruptQueue.length > 0) {
            this.processInterrupt(this.interruptQueue.shift());
        }

        return true;
    }

    public addDevice(device: Device) {
        this.devices.push(device);
    }

    public removeDevice(device: Device) {
        var index = this.devices.indexOf(device);

        if (index >= 0) {
            this.devices.splice(index, 1);
        }
    }

}