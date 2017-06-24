// http://pastebin.com/raw.php?i=Q4JvQvnM
// https://github.com/gibbed/0x10c-Notes
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RegisterCode_1 = require("./RegisterCode");
var Utils_1 = require("./Utils");
var OpCode_1 = require("./OpCode");
var Register_1 = require("./Register");
var RegisterValue_1 = require("./RegisterValue");
var RegisterPlusNextWord_1 = require("./RegisterPlusNextWord");
var StackPointerValue_1 = require("./StackPointerValue");
var Literal_1 = require("./Literal");
var Op_1 = require("./Op");
var Emulator = (function () {
    function Emulator() {
        this.async = true;
        this.verbose = false;
        this.currentSpeed = { "delayFrequency": 1000, "delayTime": 1 };
        this.CPU_CYCLE = 0;
        this.RAM = [];
        this.OpSet = [];
        this.SpecialOpSet = [];
        this.paused = false;
        this.devices = [];
        this.interruptQueue = [];
        this.asyncSteps = 0;
        this.program = null;
        this.attachedDebugger = null;
        this.initRegisters();
        this.initValues();
        this.initOperations();
    }
    Emulator.prototype.initRegisters = function () {
        this.Registers = {
            A: new Register_1.Register("A", RegisterCode_1.RegisterCode.REGISTER_A, this),
            B: new Register_1.Register("B", RegisterCode_1.RegisterCode.REGISTER_B, this),
            C: new Register_1.Register("C", RegisterCode_1.RegisterCode.REGISTER_C, this),
            X: new Register_1.Register("X", RegisterCode_1.RegisterCode.REGISTER_X, this),
            Y: new Register_1.Register("Y", RegisterCode_1.RegisterCode.REGISTER_Y, this),
            Z: new Register_1.Register("Z", RegisterCode_1.RegisterCode.REGISTER_Z, this),
            I: new Register_1.Register("I", RegisterCode_1.RegisterCode.REGISTER_I, this),
            J: new Register_1.Register("J", RegisterCode_1.RegisterCode.REGISTER_J, this),
            SP: new Register_1.Register("SP", RegisterCode_1.RegisterCode.REGISTER_SP, this),
            PC: new Register_1.Register("PC", RegisterCode_1.RegisterCode.REGISTER_PC, this),
            EX: new Register_1.Register("EX", RegisterCode_1.RegisterCode.REGISTER_EX, this),
            IA: new Register_1.Register("IA", 0xffff, this),
        };
        this.Registers.PC.inc = function () {
            var v = this.get();
            this.set(v + 1);
            return v;
        };
        this.PC = this.Registers.PC;
        this.Registers.SP.push = function (val) {
            this.contents = Utils_1.Utils.to16BitSigned(this.contents - 1);
            this.emulator.RAM[this.contents] = val;
        };
        this.Registers.SP.pop = function () {
            if (this.contents == 0)
                console.log("Warning: stack underflow");
            var val = this.emulator.RAM[this.contents] || 0;
            this.emulator.RAM[this.contents] = 0; // TODO: should the emualtor alter the memory location when it is POPed?
            this.contents = (this.contents + 1) & 0xffff;
            return val;
        };
    };
    Emulator.prototype.initValues = function () {
        this.Values[0x00] = this.Registers.A;
        this.Values[0x01] = this.Registers.B;
        this.Values[0x02] = this.Registers.C;
        this.Values[0x03] = this.Registers.X;
        this.Values[0x04] = this.Registers.Y;
        this.Values[0x05] = this.Registers.Z;
        this.Values[0x06] = this.Registers.I;
        this.Values[0x07] = this.Registers.J;
        this.Values[0x08] = new RegisterValue_1.RegisterValue(this.Registers.A);
        this.Values[0x09] = new RegisterValue_1.RegisterValue(this.Registers.B);
        this.Values[0x0a] = new RegisterValue_1.RegisterValue(this.Registers.C);
        this.Values[0x0b] = new RegisterValue_1.RegisterValue(this.Registers.X);
        this.Values[0x0c] = new RegisterValue_1.RegisterValue(this.Registers.Y);
        this.Values[0x0d] = new RegisterValue_1.RegisterValue(this.Registers.Z);
        this.Values[0x0e] = new RegisterValue_1.RegisterValue(this.Registers.I);
        this.Values[0x0f] = new RegisterValue_1.RegisterValue(this.Registers.J);
        this.Values[0x10] = new RegisterPlusNextWord_1.RegisterPlusNextWord(this.Registers.A);
        this.Values[0x11] = new RegisterPlusNextWord_1.RegisterPlusNextWord(this.Registers.B);
        this.Values[0x12] = new RegisterPlusNextWord_1.RegisterPlusNextWord(this.Registers.C);
        this.Values[0x13] = new RegisterPlusNextWord_1.RegisterPlusNextWord(this.Registers.X);
        this.Values[0x14] = new RegisterPlusNextWord_1.RegisterPlusNextWord(this.Registers.Y);
        this.Values[0x15] = new RegisterPlusNextWord_1.RegisterPlusNextWord(this.Registers.Z);
        this.Values[0x16] = new RegisterPlusNextWord_1.RegisterPlusNextWord(this.Registers.I);
        this.Values[0x17] = new RegisterPlusNextWord_1.RegisterPlusNextWord(this.Registers.J);
        this.Values[0x18] = new StackPointerValue_1.StackPointerValue(this);
        this.Values[0x19] = new RegisterValue_1.RegisterValue(this.Registers.SP);
        this.Values[0x1a] = new RegisterPlusNextWord_1.RegisterPlusNextWord(this.Registers.SP);
        this.Values[0x1b] = this.Registers.SP;
        this.Values[0x1c] = this.Registers.PC;
        this.Values[0x1d] = this.Registers.EX;
        this.Values[0x1e] = {
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
        this.Values[0x1f] = {
            emulator: this,
            getA: function () { return this.get(); },
            getB: function () { return this.get(); },
            get: function () { return this.emulator.nextWord(); },
            set: function (val) { }
        };
        this.Values[0x20] = new Literal_1.Literal(0xffff); // -1
        for (var i = 0x21, literalVal = 0; i < 0x40; i++, literalVal++) {
            this.Values[i] = new Literal_1.Literal(literalVal);
        }
    };
    Emulator.prototype.initOperations = function () {
        this.BasicOperations = {
            SET: new Op_1.Op(this, "SET", OpCode_1.OpCode.OPERATION_SET, 1, function (a, b) {
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
            ADD: new Op_1.Op(this, "ADD", OpCode_1.OpCode.OPERATION_ADD, 2, function (a, b) {
                var aVal = a.getA();
                var bVal = b.getB();
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
            SUB: new Op_1.Op(this, "SUB", OpCode_1.OpCode.OPERATION_SUB, 2, function (a, b) {
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
            MUL: new Op_1.Op(this, "MUL", OpCode_1.OpCode.OPERATION_MUL, 2, function (a, b) {
                var aVal = a.getA(), bVal = b.getB();
                if (a.name === "PC")
                    aVal = a.getA();
                if (b.name === "PC")
                    bVal = b.getB();
                var res = aVal * bVal;
                this.emulator.Registers.EX.set((res >> 16) & 0xffff);
                b.set(res & 0xffff);
            }),
            MLI: new Op_1.Op(this, "MLI", OpCode_1.OpCode.OPERATION_MLI, 2, function (a, b) {
                var aVal = a.getA(), bVal = b.getB();
                if (a.name === "PC")
                    aVal = a.getA();
                if (b.name === "PC")
                    bVal = b.getB();
                aVal = Utils_1.Utils.to32BitSigned(aVal);
                bVal = Utils_1.Utils.to32BitSigned(bVal);
                var res = bVal * aVal;
                this.emulator.Registers.EX.set((res >> 16) & 0xffff);
                b.set(Utils_1.Utils.to16BitSigned(res));
            }),
            DIV: new Op_1.Op(this, "DIV", OpCode_1.OpCode.OPERATION_DIV, 3, function (a, b) {
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
                    var properShift = (bVal << 16) >>> 0;
                    this.emulator.Registers.EX.set(Math.floor((properShift / aVal)) & 0xffff);
                    b.set(res & 0xffff);
                }
            }),
            DVI: new Op_1.Op(this, "DVI", OpCode_1.OpCode.OPERATION_DVI, 3, function (a, b) {
                var aVal = a.getA(), bVal = b.getB();
                if (a.name === "PC")
                    aVal = a.getA();
                if (b.name === "PC")
                    bVal = b.getB();
                aVal = Utils_1.Utils.to32BitSigned(aVal);
                bVal = Utils_1.Utils.to32BitSigned(bVal);
                if (aVal === 0) {
                    this.emulator.Registers.EX.set(0);
                    b.set(0);
                }
                else {
                    var res = Utils_1.Utils.roundTowardsZero(bVal / aVal);
                    this.emulator.Registers.EX.set(Utils_1.Utils.roundTowardsZero(((bVal << 16) / aVal)) & 0xffff);
                    b.set(Utils_1.Utils.to16BitSigned(res));
                }
            }),
            MOD: new Op_1.Op(this, "MOD", OpCode_1.OpCode.OPERATION_MOD, 3, function (a, b) {
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
            MDI: new Op_1.Op(this, "MDI", OpCode_1.OpCode.OPERATION_MDI, 3, function (a, b) {
                var aVal = a.getA(), bVal = b.getB();
                if (a.name === "PC")
                    aVal = a.getA();
                if (b.name === "PC")
                    bVal = b.getB();
                aVal = Utils_1.Utils.to32BitSigned(aVal);
                bVal = Utils_1.Utils.to32BitSigned(bVal);
                if (aVal === 0)
                    b.set(0);
                else
                    b.set(Utils_1.Utils.to16BitSigned(bVal % aVal));
            }),
            AND: new Op_1.Op(this, "AND", OpCode_1.OpCode.OPERATION_AND, 1, function (a, b) {
                var aVal = a.getA(), bVal = b.getB();
                if (a.name === "PC")
                    aVal = a.getA();
                if (b.name === "PC")
                    bVal = b.getB();
                b.set(bVal & aVal);
            }),
            BOR: new Op_1.Op(this, "BOR", OpCode_1.OpCode.OPERATION_BOR, 1, function (a, b) {
                var aVal = a.getA(), bVal = b.getB();
                if (a.name === "PC")
                    aVal = a.getA();
                if (b.name === "PC")
                    bVal = b.getB();
                b.set(bVal | aVal);
            }),
            XOR: new Op_1.Op(this, "XOR", OpCode_1.OpCode.OPERATION_XOR, 1, function (a, b) {
                var aVal = a.getA(), bVal = b.getB();
                if (a.name === "PC")
                    aVal = a.getA();
                if (b.name === "PC")
                    bVal = b.getB();
                b.set(bVal ^ aVal);
            }),
            SHR: new Op_1.Op(this, "SHR", OpCode_1.OpCode.OPERATION_SHR, 1, function (a, b) {
                var aVal = a.getA(), bVal = b.getB();
                if (a.name === "PC")
                    aVal = a.getA();
                if (b.name === "PC")
                    bVal = b.getB();
                this.emulator.Registers.EX.set(((bVal << 16) >> aVal) & 0xffff);
                b.set(bVal >>> aVal);
            }),
            ASR: new Op_1.Op(this, "ASR", OpCode_1.OpCode.OPERATION_ASR, 1, function (a, b) {
                var aVal = a.getA(), bVal = b.getB();
                if (a.name === "PC")
                    aVal = a.getA();
                if (b.name === "PC")
                    bVal = b.getB();
                bVal = Utils_1.Utils.to32BitSigned(bVal);
                this.emulator.Registers.EX.set(((bVal << 16) >>> aVal) & 0xffff);
                b.set((bVal >> aVal) & 0xffff);
            }),
            SHL: new Op_1.Op(this, "SHL", OpCode_1.OpCode.OPERATION_SHL, 1, function (a, b) {
                var aVal = a.getA(), bVal = b.getB();
                if (a.name === "PC")
                    aVal = a.getA();
                if (b.name === "PC")
                    bVal = b.getB();
                this.emulator.Registers.EX.set(((bVal << aVal) >> 16) & 0xffff);
                b.set((bVal << aVal) & 0xffff);
            }),
            IFB: new Op_1.Op(this, "IFB", OpCode_1.OpCode.OPERATION_IFB, 2, function (a, b) {
                var aVal = a.getA(), bVal = b.getB();
                if (a.name === "PC")
                    aVal = a.getA();
                if (b.name === "PC")
                    bVal = b.getB();
                if ((bVal & aVal) != 0) { }
                else
                    this.emulator.skipInstruction();
            }),
            IFC: new Op_1.Op(this, "IFC", OpCode_1.OpCode.OPERATION_IFC, 2, function (a, b) {
                var aVal = a.getA(), bVal = b.getB();
                if (a.name === "PC")
                    aVal = a.getA();
                if (b.name === "PC")
                    bVal = b.getB();
                if ((bVal & aVal) === 0) { }
                else
                    this.emulator.skipInstruction();
            }),
            IFE: new Op_1.Op(this, "IFE", OpCode_1.OpCode.OPERATION_IFE, 2, function (a, b) {
                var aVal = a.getA(), bVal = b.getB();
                if (a.name === "PC")
                    aVal = a.getA();
                if (b.name === "PC")
                    bVal = b.getB();
                if (bVal === aVal) { }
                else
                    this.emulator.skipInstruction();
            }),
            IFN: new Op_1.Op(this, "IFN", OpCode_1.OpCode.OPERATION_IFN, 2, function (a, b) {
                var aVal = a.getA(), bVal = b.getB();
                if (a.name === "PC")
                    aVal = a.getA();
                if (b.name === "PC")
                    bVal = b.getB();
                if (bVal !== aVal) { }
                else
                    this.emulator.skipInstruction();
            }),
            IFG: new Op_1.Op(this, "IFG", OpCode_1.OpCode.OPERATION_IFG, 2, function (a, b) {
                var aVal = a.getA(), bVal = b.getB();
                if (a.name === "PC")
                    aVal = a.getA();
                if (b.name === "PC")
                    bVal = b.getB();
                if (bVal > aVal) { }
                else
                    this.emulator.skipInstruction();
            }),
            IFA: new Op_1.Op(this, "IFA", OpCode_1.OpCode.OPERATION_IFA, 2, function (a, b) {
                var aVal = a.getA(), bVal = b.getB();
                if (a.name === "PC")
                    aVal = a.getA();
                if (b.name === "PC")
                    bVal = b.getB();
                aVal = Utils_1.Utils.to32BitSigned(aVal);
                bVal = Utils_1.Utils.to32BitSigned(bVal);
                if (bVal > aVal) { }
                else
                    this.emulator.skipInstruction();
            }),
            IFL: new Op_1.Op(this, "IFL", OpCode_1.OpCode.OPERATION_IFL, 2, function (a, b) {
                var aVal = a.getA(), bVal = b.getB();
                if (a.name === "PC")
                    aVal = a.getA();
                if (b.name === "PC")
                    bVal = b.getB();
                if (bVal < aVal) { }
                else
                    this.emulator.skipInstruction();
            }),
            IFU: new Op_1.Op(this, "IFU", OpCode_1.OpCode.OPERATION_IFU, 2, function (a, b) {
                var aVal = a.getA(), bVal = b.getB();
                if (a.name === "PC")
                    aVal = a.getA();
                if (b.name === "PC")
                    bVal = b.getB();
                aVal = Utils_1.Utils.to32BitSigned(aVal);
                bVal = Utils_1.Utils.to32BitSigned(bVal);
                if (bVal < aVal) { }
                else
                    this.emulator.skipInstruction();
            }),
            ADX: new Op_1.Op(this, "ADX", OpCode_1.OpCode.OPERATION_ADX, 3, function (a, b) {
                var aVal = a.getA(), bVal = b.getB();
                if (a.name === "PC")
                    aVal = a.getA();
                if (b.name === "PC")
                    bVal = b.getB();
                var res = aVal + bVal + this.emulator.Registers.EX.get();
                this.emulator.Registers.EX.set(res > 0xffff ? 1 : 0);
                b.set(res & 0xffff);
            }),
            SBX: new Op_1.Op(this, "SBX", OpCode_1.OpCode.OPERATION_SBX, 3, function (a, b) {
                var aVal = a.getA(), bVal = b.getB();
                if (a.name === "PC")
                    aVal = a.getA();
                if (b.name === "PC")
                    bVal = b.getB();
                var res = bVal - aVal + this.emulator.Registers.EX.get();
                this.emulator.Registers.EX.set(res < 0 ? 0xffff : 0);
                b.set(res & 0xffff);
            }),
            STI: new Op_1.Op(this, "STI", OpCode_1.OpCode.OPERATION_STI, 2, function (a, b) {
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
            STD: new Op_1.Op(this, "STD", OpCode_1.OpCode.OPERATION_STD, 2, function (a, b) {
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
            JSR: new Op_1.Op(this, "JSR", OpCode_1.OpCode.OPERATION_JSR, 3, function (a) {
                var aVal = a.getA();
                this.emulator.Registers.SP.push(this.emulator.Registers.PC.get());
                this.emulator.Registers.PC.set(aVal);
            }, this.SpecialOpSet),
            INT: new Op_1.Op(this, "INT", OpCode_1.OpCode.OPERATION_INT, 4, function (a) {
                var aVal = a.getA();
                this.emulator.interruptQueue.push(aVal);
            }, this.SpecialOpSet),
            IAG: new Op_1.Op(this, "IAG", OpCode_1.OpCode.OPERATION_IAG, 1, function (a) {
                var aVal = a.getA();
                a.set(this.emulator.Registers.IA.get());
            }, this.SpecialOpSet),
            IAS: new Op_1.Op(this, "IAS", OpCode_1.OpCode.OPERATION_IAS, 1, function (a) {
                this.emulator.Registers.IA.set(a.getA());
            }, this.SpecialOpSet),
            RFI: new Op_1.Op(this, "RFI", OpCode_1.OpCode.OPERATION_RFI, 3, function (a) {
                var aVal = a.getA();
                this.emulator.interruptQueueingEnabled = false;
                this.emulator.Registers.A.set(this.emulator.Registers.SP.pop());
                this.emulator.Registers.PC.set(this.emulator.Registers.SP.pop());
            }, this.SpecialOpSet),
            IAQ: new Op_1.Op(this, "IAQ", OpCode_1.OpCode.OPERATION_IAQ, 2, function (a) {
                var aVal = a.getA();
                if (aVal === 0)
                    this.emulator.interruptQueueingEnabled = false;
                else
                    this.emulator.interruptQueueingEnabled = true;
            }, this.SpecialOpSet),
            HWN: new Op_1.Op(this, "HWN", OpCode_1.OpCode.OPERATION_HWN, 2, function (a) {
                var aVal = a.getA();
                a.set(this.emulator.devices.length);
            }, this.SpecialOpSet),
            HWQ: new Op_1.Op(this, "HWQ", OpCode_1.OpCode.OPERATION_HWQ, 4, function (a) {
                var dev = this.emulator.devices[a.getA()];
                if (dev) {
                    this.emulator.Registers.A.set(dev.id & 0xffff);
                    this.emulator.Registers.B.set((dev.id >> 16) & 0xffff);
                    this.emulator.Registers.C.set(dev.version & 0xffff);
                    this.emulator.Registers.X.set(dev.manufacturer & 0xffff);
                    this.emulator.Registers.Y.set((dev.manufacturer >> 16) & 0xffff);
                }
            }, this.SpecialOpSet),
            HWI: new Op_1.Op(this, "HWI", OpCode_1.OpCode.OPERATION_HWI, 4, function (a) {
                var dev = this.emulator.devices[a.getA()];
                if (dev)
                    dev.interrupt();
            }, this.SpecialOpSet),
        };
    };
    Emulator.prototype.boot = function () {
        console.log("--- DCPU-16 Emulator ---");
        this.program = null;
        this.PC.set(0);
        this.CPU_CYCLE = 0;
        this.RAM = new Array(0x10000);
        this.asyncSteps = 1;
        this.interruptQueueingEnabled = false;
        this.interruptQueue = [];
        for (var r in this.Registers) {
            this.Registers[r].set(0);
        }
        //this.Registers.SP.set(0xffff);
        for (var i = 0; i < this.devices.length; i++) {
            this.devices[i].init();
        }
    };
    Emulator.prototype.reboot = function () { this.boot(); };
    ;
    /**
     * Run the program specified.
     * @ _program the program you want to run, as an array of bytes.
     */
    Emulator.prototype.run = function (_program) {
        this.program = _program;
        console.log("Running program (" + this.program.length + " words)");
        // load program into RAM
        for (var i = 0; i < this.program.length; i++) {
            if (this.program[i] != undefined)
                this.RAM[i] = this.program[i];
        }
        if (!this.async) {
            while (this.step()) { }
            this.exit();
        }
        else {
            this.stepAsync();
        }
    };
    Emulator.prototype.step = function () {
        //if (this.PC.get() < this.program.length) {
        this.nextInstruction();
        if (this.attachedDebugger && this.paused)
            this.attachedDebugger.onStep(this.PC.get());
        // process one interrupt if we have one
        if (this.interruptQueueingEnabled == false && this.interruptQueue.length > 0) {
            this.processInterrupt(this.interruptQueue.pop());
        }
        return true;
        //}
        // else return false;
    };
    Emulator.prototype.runAsync = function () {
        var _this = this;
        while (true) {
            if (Math.floor(_this.CPU_CYCLE / _this.currentSpeed.delayFrequency) > _this.asyncSteps) {
                _this.asyncSteps++;
                setTimeout(_this.runAsync, _this.currentSpeed.delayTime);
                break;
            }
            else {
                if (!_this.stepAsync())
                    break;
            }
        }
    };
    Emulator.prototype.stepAsync = function () {
        if (this.program == null)
            return false;
        if (this.paused) {
            if (this.attachedDebugger) {
                this.attachedDebugger.onPaused(this.PC.get());
                return false;
            }
        }
        else {
            if (this.attachedDebugger) {
                if (this.attachedDebugger.breakpoints["" + this.PC.get()]) {
                    this.paused = true;
                    this.attachedDebugger.onPaused(this.PC.get());
                    return false;
                }
            }
            var res = this.step();
            if (!res)
                this.exit();
            return res;
        }
    };
    Emulator.prototype.nextInstruction = function () {
        var data = this.RAM[this.PC.inc()];
        var instruction = Utils_1.Utils.parseInstruction(data);
        var op;
        if (instruction.opcode === 0) {
            instruction = Utils_1.Utils.parseSpecialInstruction(data);
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
            console.log(Utils_1.Utils.hex(this.Registers.PC.get()) + "\t" +
                op.name + "\t(" +
                Utils_1.Utils.hex(instruction.a) + ",\t" +
                Utils_1.Utils.hex(instruction.b) + ")");
        }
        op.exec(instruction.a, instruction.b);
        if (this.attachedDebugger)
            this.attachedDebugger.onInstruction(this.PC.get());
    };
    Emulator.prototype.nextWord = function () {
        this.CPU_CYCLE++;
        return this.RAM[this.Registers.PC.inc()];
    };
    Emulator.prototype.getParamValue = function (val) {
        return this.Values[val.toString()];
    };
    Emulator.prototype.skipInstruction = function () {
        var instruction = Utils_1.Utils.parseInstruction(this.RAM[this.PC.inc()]);
        this.CPU_CYCLE++;
        // skip "next word" values by invoking get() on the params
        this.getParamValue(instruction.a).get();
        if (instruction.opcode != 0)
            this.getParamValue(instruction.b).get();
        if (instruction.opcode >= OpCode_1.OpCode.OPERATION_IFB && instruction.opcode <= OpCode_1.OpCode.OPERATION_IFU) {
            // if we have skipped a conditional instruction, skip additional instruction 
            // at cost of an additional cycle.  continue until a non-conditional instruction
            // has been skipped
            this.skipInstruction();
        }
    };
    Emulator.prototype.processInterrupt = function (message) {
        if (this.Registers.IA.get() != 0) {
            this.interruptQueueingEnabled = true;
            this.Registers.SP.push(this.Registers.PC.get()); // push PC onto the stack
            this.Registers.SP.push(this.Registers.A.get()); // followed by pusing A to the stack
            this.Registers.PC.set(this.Registers.IA.get()); // set PC to IA
            this.Registers.A.set(message); // set A to the interrupt message
        }
        else {
        }
    };
    ;
    Emulator.prototype.interrupt = function (message) {
        this.interruptQueue.push(message);
        if (this.interruptQueue.length > 256) {
            // catch fire?
            console.warn("DCUP-16 is on fire");
            throw "Too many interrupts";
        }
    };
    ;
    Emulator.prototype.exit = function () {
        console.log("Program completed in " + this.CPU_CYCLE + " cycles");
        if (this.attachedDebugger)
            this.attachedDebugger.onExit();
    };
    Emulator.prototype.attachDebugger = function (_debugger) {
        this.attachedDebugger = _debugger;
    };
    return Emulator;
}());
exports.Emulator = Emulator;
//# sourceMappingURL=Emulator.js.map