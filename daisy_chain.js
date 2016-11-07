var mraa = require('mraa'); //require mraa
console.log('MRAA Version: ' + mraa.getVersion()); //write the mraa version to the console

var spi = new mraa.Spi(0);
spi.frequency(4960000);
//var pinCS = new mraa.Gpio(111, false, true);

function setup() {
    spi.mode(mraa.SPI_MODE3);
    send(['0x00', '0x00']); // NOP
    send(['0x00', '0x00']);
    send(['0x00', '0x00']);
    send(['0x00', '0x00']);
    
    send(['0xc0', '0xc0']); // ResetDevice
    
    // MAX_SPEED
    send(['0x07', '0x07']);
    send(['0x00', '0x00']);
    send(['0x30', '0x30']);
    
    // KVAL_HOLD 停止中の電圧
    send(['0x09', '0x09']);
    send(['0x20', '0x20']);
    
    var v = '0x6e'; // 11v
    // KVAL_RUM 定速回転中の電圧
    send(['0x0a', '0x0a']);
    send([v, v]);
    
    // KVAL_ACC 加速中の電圧
    send(['0x0b', '0x0b']);
    send([v, v]);
    
    // KVAL_DEC 減速中の電圧
    send(['0x0c', '0x0c']);
    send([v, v]);
}

function setup2() {
    //spi.mode(mraa.SPI_MODE3);
    send2([0x00, 0x00]); // NOP
    send2([0x00, 0x00]);
    send2([0x00, 0x00]);
    send2([0x00, 0x00]);
    
    send2([0xc0, 0xc0]); // ResetDevice
    
    // MAX_SPEED
    send2([0x07, 0x00, 0x30]);
    send2([0x07, 0x00, 0x30]);
    
    // KVAL_HOLD 停止中の電圧
    send2([0x09, 0x20, 0x09, 0x20]);
    
    var v = 0x6e; // 11v
    // KVAL_RUM 定速回転中の電圧
    send2([0x0a, v, 0x0a, v]);
    
    // KVAL_ACC 加速中の電圧
    send2([0x0b, v, 0x0b, v]);
    
    // KVAL_DEC 減速中の電圧
    send2([0x0c, v, 0x0c, v]);
}

function setup3() {
    //spi.mode(mraa.SPI_MODE3);
    send3(0x0000); // NOP
    send3(0x0000);
    send3(0x0000);
    send3(0x0000);
    
    send3(0xc0c0); // ResetDevice
    
    // MAX_SPEED
    send3(0x0707);
    send3(0x0000);
    send3(0x3030);
    
    // KVAL_HOLD 停止中の電圧
    send3(0x0909);
    send3(0x2020);
    send3(0x0909);
    send3(0x2020);
    
    var v = 0x6e; // 11v
    // KVAL_RUM 定速回転中の電圧
    send3(0x0a0a);
    send3(0x6e6e);
    
    // KVAL_ACC 加速中の電圧
    send3(0x0b0b);
    send3(0x6e6e);
    
    // KVAL_DEC 減速中の電圧
    send3(0x0c0c);
    send3(0x6e6e);
}

function setup4() {
    //spi.mode(mraa.SPI_MODE3);
    send2([0x00, 0x00]); // NOP
    send2([0x00, 0x00]);
    send2([0x00, 0x00]);
    send2([0x00, 0x00]);
    
    send2([0xc0, 0xc0]); // ResetDevice
    
    // MAX_SPEED
    send2([0x07, 0x07]);
    send2([0x00, 0x00]);
    send2([0x30, 0x30]);
    
    // KVAL_HOLD 停止中の電圧
    send2([0x09, 0x09]);
    send2([0x20, 0x20]);
    
    var v = 0x6e; // 11v
    // KVAL_RUM 定速回転中の電圧
    send2([0x0a, 0x0a]);
    send2([v, v]);
    
    // KVAL_ACC 加速中の電圧
    send2([0x0b, 0x0b]);
    send2([v, v]);
    
    // KVAL_DEC 減速中の電圧
    send2([0x0c, 0x0c]);
    send2([v, v]);
}

function setup5() {
    spi.mode(mraa.SPI_MODE3);
    send(['0x00', '0x00', '0x00', '0x00']); // NOP
    send(['0x00', '0x00', '0x00', '0x00']);
    send(['0x00', '0x00', '0x00', '0x00']);
    send(['0x00', '0x00', '0x00', '0x00']);
    
    send(['0xc0', '0x00', '0x00', '0xc0']); // ResetDevice
    
    // MAX_SPEED
    send(['0x07', '0x00', '0x00', '0x07']);
    send(['0x00', '0x00', '0x00',  '0x00']);
    send(['0x30', '0x00', '0x00',  '0x30']);
    
    // KVAL_HOLD 停止中の電圧
    send(['0x09', '0x00', '0x00',  '0x09']);
    send(['0x20', '0x00', '0x00',  '0x20']);
    
    var v = '0x6e'; // 11v
    // KVAL_RUM 定速回転中の電圧
    send(['0x0a', '0x00', '0x00',  '0x0a']);
    send([v, '0x00', '0x00',  v]);
    
    // KVAL_ACC 加速中の電圧
    send(['0x0b', '0x00', '0x00',  '0x0b']);
    send([v, '0x00', '0x00',  v]);
    
    // KVAL_DEC 減速中の電圧
    send(['0x0c', '0x00', '0x00',  '0x0c']);
    send([v, '0x00', '0x00',  v]);
}

function setup6() {
    spi.mode(mraa.SPI_MODE3);
    send(['0x00', '0x00']); // NOP
    send(['0x00', '0x00']);
    send(['0x00', '0x00']);
    send(['0x00', '0x00']);
    send(['0x00', '0x00']); // NOP
    send(['0x00', '0x00']);
    send(['0x00', '0x00']);
    send(['0x00', '0x00']);
    
    send(['0x00', '0xc0']);
    send(['0xc0', '0x00']); // ResetDevice
    
    // MAX_SPEED
//    send(['0x07', '0x00']);
//    send(['0x00', '0x00']);
//    send(['0x30', '0x00']);
//    send(['0x00', '0x07']);
//    send(['0x00', '0x00']);
//    send(['0x00', '0x30']);
    
    // KVAL_HOLD 停止中の電圧
    send(['0x00', '0x09']);
    send(['0x00', '0x20']);
    send(['0x09', '0x00']);
    send(['0x20', '0x00']);
    
    
    var v = '0x6e'; // 11v
    // KVAL_RUM 定速回転中の電圧
    send(['0x00', '0x0a']);
    send(['0x00', v]);
    send(['0x0a', '0x00']);
    send([v, '0x00']);
    
    // KVAL_ACC 加速中の電圧
    send(['0x00', '0x0b']);
    send(['0x00', v]);
    send(['0x0b', '0x00']);
    send([v, '0x00']);
    
    // KVAL_DEC 減速中の電圧
    send(['0x00', '0x0c']);
    send(['0x00', v]);
    send(['0x0c', '0x00']);
    send([v, '0x00']);
}

function move2() {
    var r = true;
    
    var t = setInterval(function() {
        var roll = 0x5151;
        if (!r) {
            roll = 0x5050;
        }
        
        send3(roll);
        send3(0x0000);
        send3(0x4040);
        send3(0x0000);
        
        r = !r;
    }, 1000);
    
    setTimeout(function(){
        clearInterval(t);
        
        send3(0xb0b0); // SoftStop
        console.log('Stop');
    }, 4000);
}

function move3() {
    var r = true;
    
    var t = setInterval(function() {
        var roll = '0x51';
        if (!r) {
            roll = '0x50';
        }
        
        // 1だけ動く
//        console.log(1);
//        send(['0x51', '0x00', '0x00', '0x51']);
//        console.log(2);
//        send(['0x00', '0x00', '0x00', '0x00']);
//        console.log(3);
//        send(['0x40', '0x00', '0x00', '0x40']);
//        console.log(4);
//        send(['0x00', '0x00', '0x00', '0x00']);
        
        // 1だけ動く
/*      
        send(['0x00', roll]);
        send(['0x00', '0x00']);
        send(['0x00', '0x40']);
        send(['0x00', '0x00']);
*/
                
        send(['0x00', roll]);
        send(['0x00', '0x00']);
        send(['0x00', '0x40']);
        send(['0x00', '0x00']);
        
        send([roll, '0x00']);
        send(['0x00', '0x00']);
        send(['0x40', '0x00']);
        send(['0x00', '0x00']);
        
        // 動かない
        //send([roll, "0x00", "0x40", "0x00"]);
        
        // 動かない
        //send([roll, "0x00", "0x40", "0x00", roll, "0x00", "0x40", "0x00"]);
        
        r = !r;
    }, 1000);
    
    setTimeout(function(){
        clearInterval(t);
        
        send(['0xb0', '0x00']); // SoftStop
        send(['0x00', '0xb0'])
        console.log('Stop');
    }, 1000);
}

function move4() {
    var roll = '0x51';
    
//    send([roll, '0x00']);
//    send(['0x00', '0x00']);
//    send(['0x40', '0x00']);
//    send(['0x00', '0x00']);
//
//    send(['0x00', roll]);
//    send(['0x00', '0x00']);
//    send(['0x00', '0x40']);
//    send(['0x00', '0x00']);
    
    setTimeout(function () {
//        send([roll, roll]);
//        send(['0x00', '0x00']);
//        send(['0x40', '0x40']);
//        send(['0x00', '0x00']);

//        send(['0x00', roll]);
//        send(['0x00', '0x00']);
//        send(['0x00', '0x40']);
//        send(['0x00', '0x00']);
        
        send([roll, '0x00']);
        send(['0x00', '0x00']);
        send(['0x40', '0x00']);
        send(['0x00', '0x00']);
        
        setTimeout(function(){
            send(['0xb0', '0xb0']); // SoftStop
            console.log('Stop');
        }, 4000);        
    }, 1000);

}

function move() {
    var r = true;
    
    var t = setInterval(function(){
        //var roll = r ? '0x51' : '0x50';
        var roll = r ? 0x51 : 0x50;
        console.log('roll: ' + roll);
        //send([roll, '0x00', '0x40', '0x00']);
//        send([roll, roll]);
//        send(['0x00', '0x00']);
//        send(['0x40', '0x40']);
//        send(['0x00', '0x00']);
        
        send2([roll, 0x00, 0x40, 0x00, roll, 0x00, 0x40, 0x00]);
//        send2([0x50, 0x51]);
//        send2([0x00, 0x00]);
//        send2([0x40, 0x40]);
//        send2([0x00, 0x00]);
        
//        send([roll]);
//        send(['0x00']);
//        send(['0x40']);
//        send(['0x00']);
//        spi0.writeByte(0x50);
//        spi0.writeByte(0x00);
//        spi0.writeByte(0x40);
//        spi0.writeByte(0x00);
        
//        spi1.writeByte(roll);
//        spi1.writeByte(0x00);
//        spi1.writeByte(0x40);
//        spi1.writeByte(0x00);
//        
//        spi0.writeByte(roll);
//        spi0.writeByte(0x00);
//        spi0.writeByte(0x40);
//        spi0.writeByte(0x00);
        r = !r;
    }, 4000);
    
    setTimeout(function(){
        clearInterval(t);
        
        send2([0xb0, 0xb0]); // SoftStop
        console.log('Stop');
    }, 8000);
}

function send(data) {
    var buf = new Buffer(data.length);
    buf.fill(0);
    for (var i=0; i<data.length; i++) {
        buf[i] = char(data[i]);
    }
    var buf2 = spi.write(buf);
    console.log("Sent: " + buf.toString('hex') + ". Received: " + buf2.toString('hex'));

    // 1しか動かない
//    var buf = new Buffer(1);
//    var b= ("00000000" + parseInt(data[1], 16).toString(2)).substr(-8);
//    buf[0] = "00000000" + b;
//    console.log("--------> " + buf[0]);

    // 2のLEDが一回だけ緑になるが動かない
/*    var buf = new Buffer(2);
    buf[0] = char(data[0]);
    buf[1] = char("0x00");
    var buf2 = spi.write(buf);
    console.log("1 Sent: " + buf.toString('hex') + ". Received: " + buf2.toString('hex'));
    buf[0] = char("0x00");
    buf[1] = char(data[1]);
    buf2 = spi.write(buf);
    console.log("2 Sent: " + buf.toString('hex') + ". Received: " + buf2.toString('hex'));
*/
    
}

function send2(data) {
    var buf = new Buffer(2);
    for (var i=0; i<data.length; i++) {
        var buf2 = spi.writeByte(data[i]);
        //var buf2 = spi1.writeWord(data[i]);
        console.log("Sent: " + data[i] + ". Received: " + buf2);
    }
    //pinCS.write(mraa.DIR_OUT_HIGH);
}

function send3(data) {
    //var retData = spi1.writeByte(data);
    var retData = spi.write(data);
    console.log("Sent: " + data + ". Received: " + retData);
}

function char(x) {
    return parseInt(x, 16);
}

function read() {
    // MAX_SPEED
    var b1 = new Buffer(1);
    b1[0] = 0x20 | 0x07;
    //b1[1] = 0x20 | 0x07;
    var retB = spi.write(b1);
    console.log(retB.toString('hex'));
    
    var b2 = new Buffer(1);
    b2[0] = 0;
    //b2[0] = 0;
    retB = spi.write(b2);
    console.log(retB.toString('hex'));
    retB = spi.write(b2);
    console.log(retB.toString('hex'));
}

function daisy_chain() {
    console.log("daisy chain main.");
    setup6();
    move4();
    //read();
}

function getMaxAbsValue(bit, signed) {
    if (signed) {
        return (Math.pow(2, bit-1)) - 1;
    } else {
        return (Math.pow(2, bit)) - 1;
    }
}

function getHexParams(data) {
    var params = new Array();
    
    var bitNum = 8 - (data.length % 8) + data.length;
    
    data = ('0000000' + data).substr(-bitNum);
    var i = 0;
    
    while (i * 8 < data.length) {
        var start = i * 8;
        var d = data.substr(start, 8);

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

function convert(val, bitLength) {
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

daisy_chain();