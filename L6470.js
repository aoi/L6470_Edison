var mraa = require("mraa");

/**
 * Making data for other device.
 * @param {L6470} ctx
 * @param {number} data (hex)
 */
var paddingData = function (ctx, data) {
    var d = new Array();
    var prefixData = new Array();
    for (var i=0; i<ctx.index; i++) {
        prefixData.push("0x00");
    }
    var suffixData = new Array();
    for (var i=0; i<ctx.daisyChainCount - ctx.index - 1; i++) {
        suffixData.push("0x00");
    }

    if (0 < prefixData.length) {
        [].push.apply(d, prefixData);        
    }
    d.push(data);
    if (0 < suffixData.length) {
        [].push.apply(d, suffixData);
    }

    return d;
}

/**
 * L6470 control module.
 * @param daisyChainCount
 * @param index This is device index in daisy chain.
 */
var L6470 = function(daisyChainCount, index) {
    
    this.COMMANDS = {
        "nop": this.nop,
        "set_param": this.setParam,
        "get_param": this.getParam,
        "run": this.run,
        "step_clock": this.stepClock,
        "move": this.move,
        "go_to": this.goTo,
        "go_to_dir": this.goToDir,
        "go_until": this.goUntil,
        "release_sw": this.releaseSW,
        "go_home": this.goHome,
        "go_mark": this.goMark,
        "reset_pos": this.resetPos,
        "reset_device": this.resetDevice,
        "stop": this.softStop,
        "soft_stop": this.softStop,
        "hard_stop": this.hardStop,
        "soft_hi_z": this.softHiZ,
        "hard_hi_z": this.hardHiZ,
        "get_status": this.getStatus,
        "test": this.test,
    };
    
    this.spi = new mraa.Spi(0);
    
    if (daisyChainCount != 0 && !daisyChainCount) {
        daisyChainCount = 0;
    }
    this.daisyChainCount = daisyChainCount;
    
    if (index != 0 && !index) {
        console.log("Invalid device index.");
        return null;
    }
    
    this.index = index;
    
    this.PARAMS = {
        "abs_pos": {
            "addr": "0x01",
            "len": 22
        },
        "el_pos": {
            "addr": "0x02",
            "len": 9
        },
        "mark": {
            "addr": "0x03",
            "len": 22
        },
        "speed": {
            "addr": "0x04",
            "len": 20
        },
        "acc": {
            "addr": "0x05",
            "len": 12
        },
        "dec": {
            "addr": "0x06",
            "len": 12
        },
        "max_speed": {
            "addr": "0x07",
            "len": 10
        },
        "min_speed": {
            "addr": "0x08",
            "len": 13
        },
        "fs_spd": {
            "addr": "0x15",
            "len": 10
        },
        "kval_hold": {
            "addr": "0x09",
            "len": 8
        },
        "kval_run": {
            "addr": "0x0a",
            "len": 8
        },
        "kval_acc": {
            "addr": "0x0b",
            "len": 8
        },
        "kval_dec": {
            "addr": "0x0c",
            "len": 8
        },
        "int_speed": {
            "addr": "0x0d",
            "len": 14
        },
        "st_slp": {
            "addr": "0x0e",
            "len": 8
        },
        "fn_slp_acc": {
            "addr": "0x0f",
            "len": 8
        },
        "fn_slp_dec": {
            "addr": "0x10",
            "len": 8
        },
        "k_therm": {
            "addr": "0x11",
            "len": 4
        },
        "adc_out": {
            "addr": "0x12",
            "len": 5
        },
        "ocd_th": {
            "addr": "0x13",
            "len": 4
        },
        "stall_th": {
            "addr": "0x14",
            "len": 7
        },
        "step_mode": {
            "addr": "0x16",
            "len": 8
        },
        "alarm_en": {
            "addr": "0x17",
            "len": 8
        },
        "config": {
            "addr": "0x18",
            "len": 16
        },
        "status": {
            "addr": "0x19",
            "len": 16
        }
        
    };
};

L6470.prototype.command = function (com, args) {
    if (!this.COMMANDS[com]) {
        console.log("Command not found.");
        return;
    }
    
    this.COMMANDS[com].apply(this, args);
}

L6470.prototype.nop = function() {
    this.send(convert("0x00", 8));
}

/**
 * Set Param.
 * @param {string} par Parameter name.
 * @param {number} val Value(decimal).
 */
L6470.prototype.setParam = function(par, val) {
    val = parseInt(val, 10);
    
    if (!this.PARAMS[par]) {
        console.log("Parameter not found.");
        return;
    }
    var addr = this.PARAMS[par].addr;
    var cmd = "000" + ("00000" + parseInt(addr, 16).toString(2)).substr(-5);
    var d = convert(cmd, 8);
    [].push.apply(d, convert(val.toString(2), this.PARAMS[par].len));
    
    this.send(d);
}

/**
 * Get Param.
 * @param {string} par Parameter name.
 */
L6470.prototype.getParam = function(par) {
    if (!this.PARAMS[par]) {
        console.log("Parameter not found.");
        return;
    }
    var addr = this.PARAMS[par].addr;
    var data = "001" + ("00000" + parseInt(addr, 16).toString(2)).substr(-5);
    
    this.send(convert(data, 8));
};

L6470.prototype.setup = function(maxSpeed, kvalHold, kvalRun, kvalAcc, kvalDec) {
    this.spi.mode(mraa.SPI_MODE3);
    
    // clear command and arguments
    this.nop();
    this.nop();
    this.nop();
    this.nop();
    
    this.resetDevice();
    
    this.setParam("max_speed", maxSpeed);
    this.setParam("kval_hold", kvalHold);
    this.setParam("kval_run", kvalRun);
    this.setParam("kval_acc", kvalAcc);
    this.setParam("kval_dec", kvalDec);
}

/**
 * Run
 * @param {number} dir 0:reverse, 1:normal
 * @param {number} spd (decimal)
 */
L6470.prototype.run = function(dir, spd) {
    spd = parseInt(spd, 10);
    var d = convert("0101000" + dir, 8);
    [].push.apply(d, convert(spd.toString(2), 20));
    this.send(d);
}

L6470.prototype.stepClock = function(dir) {
    this.send(convert("0101100" + dir));
}

L6470.prototype.move = function(dir, nStep) {
    
}

/**
 * GoTo
 * @param {number} absPos (decimal)
 */
L6470.prototype.goTo = function(absPos) {
    absPos = parseInt(absPos, 10);
    var d = convert("01100000", 8);
    [].push.apply(d, convert(absPos.toString(2), 22));
    this.send(d);
}

/**
 * GoToDir
 * @param {number} dir 0:reverse, 1:normal
 * @param {number} absPos (decimal)
 */
L6470.prototype.goToDir = function(dir, absPos) {
    var d = convert("0101000" + dir, 8);
    console.log("d: " + d);
    absPos = parseInt(absPos, 10);
    [].push.apply(d, convert(absPos.toString(2), 22));
    console.log("d1: " + d);
    this.send(d);
}

L6470.prototype.goUntil = function(act, dir, spd) {
    
}

L6470.prototype.releaseSW = function(act, dir) {
    
}

L6470.prototype.goHome = function() {
    this.send("0x70");
}

L6470.prototype.goMark = function() {
    this.send("0x78");
}

L6470.prototype.resetPos = function() {
    this.send("0xd8");
}

L6470.prototype.resetDevice = function() {
    this.send("0xc0");
}

L6470.prototype.softStop = function() {
    this.send("0xb0");
}

L6470.prototype.hardStop = function() {
    this.send("0xb8");
}

L6470.prototype.softHiZ = function() {
    
}

L6470.prototype.hardHiZ = function() {
    
}

L6470.prototype.getStatus = function() {
    
}

function getMaxAbsValue(bit, signed) {
    if (signed) {
        return (Math.pow(2, bit-1)) - 1;
    } else {
        return (Math.pow(2, bit)) - 1;
    }
}

/**
 * Convert bit to hex.
 *
 * @param {string} bit 
 * @return {Array{string}} Array of the data(hex).
 */
function getHexParams(bit) {
    var params = new Array();
    
    var s = 8 - (bit.length % 8);
    var bitNum = 0;
    if (s == 8) {
        bitNum = bit.length;
    } else {
        bitNum = s + bit.length;
    }
    bit = ("0000000" + bit).substr(-bitNum);
    var i = 0;
    
    while (i * 8 < bit.length) {
        var start = i * 8;
        var d = bit.substr(start, 8);
        params.push(
            '0x' + 
            (
                '0' + 
                parseInt(d, 2).toString(16)
            ).substr(-2)
        );
        i++;
    }

    return params;
}

/**
 * Convert data for sending.
 * @param {string} val Convert value(bit).
 * @param {number} bitLength Send data length.
 * @return {Array{string}} Array of the data for sending(hex).
 */
function convert(val, bitLength) {
    if (!bitLength) {
        console.log("Invalid bitLength.");
        return;
    }
    if (val < 0) {
        var c1 = ~val;
        var c2 = getMaxAbsValue(bitLength, true) - c1;
        var c3 = '1' + c2.toString(2);
        return getHexParams(c3);
    } else {
        val = val.toString(2);
        val = ('00000000000000000000000000000000' + val.toString()).substr(-bitLength);
        return getHexParams(val);
    }
}

module.exports = L6470;

/**
 * Sending data.
 *
 * Sending 0x00(nop) to other device.
 * ex)
 * daisy chain count is 2, this device's index is 0.
 * 
 * [hex1, hex2] (Sending data)
 * ↓
 * [hex1, 0x00]
 * [hex2, 0x00]
 *
 * @param {number, Array{number}} data (hex)
 */
L6470.prototype.send = function(data) {
    
    if (!(data instanceof Array)) {
        var tmp = data;
        data = new Array();
        data.push(tmp);
    }
    
    for (var i=0; i<data.length; i++) {
        var s = paddingData(this, data[i]); // s.length == daisy chain count
        var buf = new Buffer(s.length);
        buf.fill(0);
        for (var j=0; j<s.length; j++) {
            buf[j] = parseInt(s[j], 16);            
        }
        
        var buf2 = this.spi.write(buf);
        console.log("Sent device " + this.index + " : " + buf.toString('hex') + ". Received: " + buf2.toString('hex'));
    }
}

L6470.prototype.test = function() {
    var b = new Buffer(2);
    b[0] = parseInt("0x00", 16);
    b[1] = parseInt("0x00", 16);
    this.spi.write(b);
    b[0] = parseInt("0x00", 16);
    b[1] = parseInt("0x00", 16);
    this.spi.write(b);
    b[0] = parseInt("0x00", 16);
    b[1] = parseInt("0x00", 16);
    this.spi.write(b);
    b[0] = parseInt("0x00", 16);
    b[1] = parseInt("0x00", 16);
    this.spi.write(b);
    
    b[0] = parseInt("0xc0", 16);
    b[1] = parseInt("0xc0", 16);
    this.spi.write(b);
    
    b[0] = parseInt("0x09", 16);
    b[1] = parseInt("0x09", 16);
    this.spi.write(b);
    b[0] = parseInt("0x20", 16);
    b[1] = parseInt("0x20", 16);
    this.spi.write(b);
    
    b[0] = parseInt("0x0a", 16);
    b[1] = parseInt("0x0a", 16);
    this.spi.write(b);
    b[0] = parseInt("0x6e", 16);
    b[1] = parseInt("0x6e", 16);
    this.spi.write(b);
    b[0] = parseInt("0x0b", 16);
    b[1] = parseInt("0x0b", 16);
    this.spi.write(b);
    b[0] = parseInt("0x6e", 16);
    b[1] = parseInt("0x6e", 16);
    this.spi.write(b);
    b[0] = parseInt("0x0c", 16);
    b[1] = parseInt("0x0c", 16);
    this.spi.write(b);
    b[0] = parseInt("0x6e", 16);
    b[1] = parseInt("0x6e", 16);
    this.spi.write(b);
    
    
    b[0] = parseInt("0x50", 16);
    b[1] = parseInt("0x50", 16);
    this.spi.write(b);
    b[0] = parseInt("0x00", 16);
    b[1] = parseInt("0x00", 16);
    this.spi.write(b);
    b[0] = parseInt("0x40", 16);
    b[1] = parseInt("0x40", 16);
    this.spi.write(b);
    b[0] = parseInt("0x00", 16);
    b[1] = parseInt("0x00", 16);
    this.spi.write(b);
}