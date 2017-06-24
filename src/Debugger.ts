function Debugger(_emulator) {
    if (!_emulator.async) throw "Emulator must be in asynchronous mode to use a debugger with it.";
    this.emulator = _emulator;
    this.breakpoints = {};

    this.emulator.attachDebugger(this);
}
Debugger.prototype.getBreakpoints = function () {
    return this.breakpoints;
};
Debugger.prototype.toggleBreakpoint = function (location, lineNumber) {
    location += "";	// convert to string
    if (this.breakpoints[location])
        delete this.breakpoints[location];
    else
        this.breakpoints[location] = lineNumber;
};
Debugger.prototype.run = function () {
    if (this.emulator.paused) {
        this.emulator.paused = false;
        this.emulator.runAsync();
    }
};
Debugger.prototype.step = function () {
    if (this.emulator.paused) {
        if (!this.emulator.step())
            this.emulator.exit();
    }
};
Debugger.prototype.pause = function () {
    this.emulator.paused = true;
};

// events
Debugger.prototype.onStep = function (location) {
};
Debugger.prototype.onPaused = function (location) { };
Debugger.prototype.onInstruction = function (location) { };
Debugger.prototype.onExit = function () { };