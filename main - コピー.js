/*jslint node:true, vars:true, bitwise:true, unparam:true */
/*jshint unused:true */

/*
A simple node.js application intended to write data to Digital pins on the Intel based development boards such as the Intel(R) Galileo and Edison with Arduino breakout board.

MRAA - Low Level Skeleton Library for Communication on GNU/Linux platforms
Library in C/C++ to interface with Galileo & other Intel platforms, in a structured and sane API with port nanmes/numbering that match boards & with bindings to javascript & python.

Steps for installing MRAA & UPM Library on Intel IoT Platform with IoTDevKit Linux* image
Using a ssh client: 
1. echo "src maa-upm http://iotdk.intel.com/repos/1.1/intelgalactic" > /etc/opkg/intel-iotdk.conf
2. opkg update
3. opkg upgrade

Article: https://software.intel.com/en-us/html5/articles/intel-xdk-iot-edition-nodejs-templates
*/


var mraa = require('mraa'); //require mraa
console.log('MRAA Version: ' + mraa.getVersion()); //write the mraa version to the console

//var myDigitalPin5 = new mraa.Gpio(5); //setup digital read on Digital pin #5 (D5)
//myDigitalPin5.dir(mraa.DIR_OUT); //set the gpio direction to output
//myDigitalPin5.write(1); //set the digital pin to high (1)

//var pinSDO = new mraa.Gpio(42, false, true);
//var pinCK  = new mraa.Gpio(40);
//var pinSDI = new mraa.Gpio(43, false, true);
//var pinCS  = new mraa.Gpio(111, false, true);
//pinSDO.mode(mraa.PIN_SPI);
//pinCK.mode(mraa.PIN_SPI);
//pinSDI.mode(mraa.PIN_SPI);
//pinCS.mode(mraa.PIN_SPI);

//var pinSDO = new mraa.Spi(0); // SPIデータOUT
//var pinCK  = new mraa.Spi(1); // SPIクロック
//var pinSDI = new mraa.Spi(43); // SPIデータIN
//var pinCS  = new mraa.Spi(3); // SPIチップセレクト
//var pinCS = new mraa.Gpio(111, false, true); // SPIチップセレクト
//pinCS.write(0);

var spi = new mraa.Spi(5, 1);
var vdd = new mraa.Gpio(15, false, true);

function setup() {
    
    spi.mode(mraa.SPI_MODE3);
    
    // ACC
    spi.writeByte(0x05);
    spi.writeByte(0x0010);
    
    // DEC
    spi.writeByte(0x05);
    spi.writeByte(0x0010);
    
    // MAX_SPEED
    spi.writeByte(0x06);
    spi.writeByte(0x23);
    
    // MIN_SPEED
    spi.writeByte(0x08);
    spi.writeByte(0);
    
//    pinCS.write(mraa.DIR_OUT_HIGH);
//    pinCS.write(mraa.DIR_OUT_LOW);
    
//    pinCS.mode(mraa.SPI_MODE3);
//    
//    // ACC
//    pinSDI.writeByte(0x05);
//    pinSDI.writeByte(0x0010);
//    // DEC
//    pinSDI.writeByte(0x06);
//    pinSDI.writeByte(0x0010);
//    // MAX_SPEED
//    pinSDI.writeByte(0x07);
//    pinSDI.writeByte(0x23);
//    // MIN_SPEED
//    pinSDI.writeByte(0x08);
//    pinSDI.writeByte(0);
    
//    // ACC
//    pinSDI.write(0x05); 
//    pinSDI.write(0x0010);
//    // DEC
//    pinSDI.write(0x06);
//    pinSDI.write(0x0010);
//    // MAX_SPEED
//    pinSDI.write(0x07);
//    pinSDI.write(0x23);
//    // MIN_SPEED
//    pinSDI.write(0x08);
//    pinSDI.write(0);
    
//    var buf = new Buffer(4);
//    buf[0] = 0x01;
//    buf[1] = 0x3f;
//    buf[2] = 0xff;
//    buf[3] = 0x38;
}

function setup2() {
    spi.mode(mraa.SPI_MODE3);
    //spi.frequency(10000);
    
    // ACC
    send(['0x05', '0x0010']);
    
    // DEC
    send(['0x05', '0x0010']);
    
    // MAX_SPEED
    send(['0x06', '0x23']);
    
    // MIN_SPEED
    send(['0x08', '0']);
}

function setup3() {
    spi.mode(mraa.SPI_MODE3);
    send(['0x00']); // NOP
    send(['0x00']);
    send(['0x00']);
    send(['0x00']);
    
    send(['0xc0']); // ResetDevice
    
    // MAX_SPEED
    send(['0x07']);
    send(['0x00']);
    send(['0x30']);
    
    // KVAL_HOLD 停止中の電圧
    send(['0x09']);
    send(['0x20']);
    
    var v = '0x6e'; // 11v
    // KVAL_RUM 定速回転中の電圧
    send(['0x0a']);
    send([v]);
    
    // KVAL_ACC 加速中の電圧
    send(['0x0b']);
    send([v]);
    
    // KVAL_DEC 減速中の電圧
    send(['0x0c']);
    send([v]);
    
    
}

function move() {
    //send(['0x51']); // Run 正転
    send(['0x50']); // Run 逆転
    send(['0x00']);
    send(['0x40']);
    send(['0x00']);
    //send(['0x59']); // StepClock
    
//    send(['0x41']); // Move
//    send(['0x00']);
//    send(['0xc8']);
//    send(['0x00']);
    
    setTimeout(function(){
        send(['0xb0']); // SoftStop
        console.log('Stop');
    }, 4000);
}

function move1() {
    var r = true;
    
    var t = setInterval(function(){
        var roll = r ? '0x51' : '0x50';
        console.log('roll: ' + roll);
        send([roll]);
        send(['0x00']);
        send(['0x40']);
        send(['0x00']);
        r = !r;
    }, 4000);
    
    setTimeout(function(){
        clearInterval(t);
        
        send(['0xb0']); // SoftStop
        console.log('Stop');
    }, 16000);
}

function send(data) {
    var buf = new Buffer(data.length);
    for (var i=0; i<data.length; i++) {
        buf[i] = char(data[i]);
    }
    
    //pinCS.write(0);
    var buf2 = spi.write(buf);
    console.log("Sent: " + buf.toString('hex') + ". Received: " + buf2.toString('hex'));
    //pinCS.write(1);
}

function char(x) {
    return parseInt(x, 16);
}

function loop() {
    
//    var buf = new Buffer(4);
//    buf[0] = 0x01;
//    buf[1] = 0x3f;
//    buf[2] = 0xff;
//    buf[3] = 0x38;
//    pinSDO.writeByte(0x00);
    
//    pinSDI.write(0x0b);
//    pinSDI.write(0x69);
//    pinSDI.write(0x00);
//    pinSDI.write(0x07);
//    pinSDI.write(0xD0);
    
//    var r = pinSDI.writeByte(0x0b);
//    console.log(r);
//    pinSDI.writeByte(0x69);
//    pinSDI.writeByte(0x00);
//    pinSDI.writeByte(0x07);
//    pinSDI.writeByte(0xD0);
    
    send(['0x0b', '0x69', '0x00', '0x07', '0xd0']);
    //send(['0b01101001', '0x69', '0x00', '0x07', '0xd0']);
    //send(['0x05']);
    send(['0x01', '0x2f', '0xff', '0x38']);
    send(['0x0a', '0x00', '0x07', '0xd0']);
}

function main() {
    //setup();
    setup3();
    move1();
    //setInterval(loop, 1000);
}

function main2() {
    var pin = new mraa.Gpio(109, false, true);
    pin.dir(mraa.DIR_OUT);
    
    var v = 1;
    setInterval(function(){
        pin.write(v);
        v = (v == 1) ? 0 : 1;
    }, 1000);
}

require("./daisy_chain.js");

//main();
//main2();