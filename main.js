// keep these lines (below) for proper jshinting and jslinting
/*jslint node:true, vars:true, bitwise:true */
/*jshint unused:true, undef:true */
// see http://www.jslint.com/help.html and http://jshint.com/docs

const readline = require("readline");
var here = require("here").here;
var L6470 = require("./L6470.js");

var devices;
 
function main() {
    var device1 = new L6470(2, 0);
    if (!device1) { return; }
    var device2 = new L6470(2, 1);
    if (!device2) { return; }
    
    device1.setup(48, 110, 110, 110, 110);
    device2.setup(48, 110, 110, 110, 110);
    devices = [device1, device2];
    
    /*
     * mode
     * command: Control from command line(default).
     * serial: Control from serial connection(in installation).
     */
    var mode = "command";
    if (process.argv[0] != null && process.argv[0] == "serial") {
        mode = "serial";
    }
    
    if (mode == "command") {
        console.log("Starting command mode.");
        command();
    } else if (mode == "serial") {
        console.log("Starting serial mode.");
        serial();
    }
}

function usage() {
    var h = here(/*
Command> COMMAND VAR1 VAR2 ... , COMMAND VAR1 VAR2 ... , ...

To specify the data for each device in a comma-separated.

[COMMAND]
    h, help:     Show this help.
    nop:
    get_param:
    run:
      arg1: 
      arg2:
    step_clock:
    move:
    go_to:
      arg1: absPos
    go_to_dir:
      arg1: dir
      arg2: absPos
    go_until:
      arg1: act
      arg2: dir
      arg3: spd
    release_sw:
    go_home:
    go_mark:
    reset_pos:
    reset_device:
    stop:         Alias soft_stop.
    soft_stop:
    hard_stop:
    soft_hi_z:
    hard_hi_z:
    get_status:
    test:
    Ctrl+D, q: Exit.

[EXAMPLE]
    Device1: normal rotation, Device2: reverse rotation
    Command> run 0 2000, run 1 2000
    
    Device1: do nothing, Device2: normal rotation
    Command> nop, run 0 2000

    */).unindent();
    console.log(h);
}

/**
 * Control from command line.
 */
function command() {
    
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    var prefix = "Command> ";
    rl.on("line", function (line) {
        switch (line.trim()) {
            case "h":
            case "help":
                usage();
                break;
            case "q":
                doExit();        
                break;
            default:
                parseAndSend(line);
                break;
        }

        rl.setPrompt(prefix, prefix.length);
        rl.prompt();
    }).on("close", function () {
        doExit();
    });
    
    rl.setPrompt(prefix, prefix.length);
    rl.prompt();
}

/**
 * Parse input data from command line, And send to L6470.
 * 
 * @param {string} line
 */
function parseAndSend(line) {
    var dataSet = line.split(",");
    
    for (var i=0; i<dataSet.length; i++) {
        var dataUnit = dataSet[i].trim().split(" ");
        var com = null;
        var args = null;
        if (dataUnit instanceof Array) {
            com = dataUnit.shift();
            args = dataUnit;
        } else {
            com = dataUnit;
            args = null;
        }
        
        devices[i].command(com, args);
    }
}

function serial() {
    
}

function doExit() {
    for (var i=0; i<devices.length; i++) {
        devices[i].nop();
        devices[i].nop();
        devices[i].nop();
        devices[i].nop();
        devices[i].softStop();
    }
    console.log("Exit.");
    process.exit(0);
}

main();