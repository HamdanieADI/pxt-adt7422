enum ADT7422Register {
    //% block="Temperature value most significant byte"
    TMSB = 0x00, // Temperature value most significant byte
    //% block="Temperature value least significant byte"
    TLSB = 0x01, // Temperature value least significant byte
    //% block="Status"
    Status = 0x02, // Status
    //% block="Configuration"
    Config = 0x03, // Configuration
    //% block="THIGH setpoint most significant byte"
    THMSB = 0x04, // THIGH setpoint most significant byte
    //% block="THIGH setpoint least significant byte"
    THLSB = 0x05, // THIGH setpoint least significant byte
    //% block="TLOW setpoint most significant byte"
    TLMSB = 0x06, // TLOW setpoint most significant byte
    //% block="TLOW setpoint least significant byte"
    TLLSB = 0x07, // TLOW setpoint least significant byte
    //% block="TCRIT setpoint most significant byte"
    TCMSB = 0x08, // TCRIT setpoint most significant byte
    //% block="TCRIT setpoint least significant byte"
    TCLSB = 0x09, // TCRIT setpoint least significant byte
    //% block="THYST setpoint"
    THYST = 0x0A, // THYST setpoint
    //% block="ID"
    ID = 0x0B, // ID
    //% block="Reserved1"
    R1 = 0x0C, // Reserved1
    //% block="Reserved2"
    R2 = 0x0D, // Reserved2
    //% block="Reserved3"
    R3 = 0x2E, // Reserved3
    //% block="Software reset"
    SRESET = 0x2F, // Software reset
}

//% weight=100 color=#00A654 icon="\uf085" block="I2C ADT7422"
namespace HamdanieADI {
    export class ADT7422 {
        private _address: number;
        
        //% blockId=ADT7422_constructor
        //% block="constructor$address"
        //% address.defl=0x48
        public constructor(address: number = 0x48) {
            this._address = address;
        }
        
        //% blockId=ADT7422_begin
        //% block="%adt7422|begin"
        public begin(): boolean {
            /* Check connection */
            let deviceid: number = this.getDeviceID();
            if (deviceid != 0xCB) {
                return false;
            }

            // Enable measurements
            this.writeRegister(ADT7422Register.Config, 0x00); //

            return true;
        }

        //% blockId=ADT7422_writeRegister
        //% block="%adt7422|write byte register $reg|value $value"
        //% reg.defl=ADT7422Register.ID
        //% value.defl=0
        public writeRegister(reg: ADT7422Register = ADT7422Register.ID, value: number = 0): void {
            let buf = pins.createBuffer(2)
            buf[0] = reg
            buf[1] = value
            pins.i2cWriteBuffer(this._address, buf, false)
        }

        //% blockId=ADT7422_readRegister
        //% block="%adt7422|read byte register $reg"
        //% reg.defl=ADT7422Register.ID
        public readRegister(reg: ADT7422Register = ADT7422Register.ID): number {
            pins.i2cWriteNumber(this._address, reg, NumberFormat.UInt8LE)
            return pins.i2cReadNumber(this._address, NumberFormat.UInt8LE)
        }

        //% blockId=ADT7422_getDeviceID
        //% block="%adt7422|deviceId"
        //% blockSetVariable=id
        public getDeviceID(): number {
            return this.readRegister(ADT7422Register.ID)
        }

    }
    
    //% blockId=ADT7422_new
    //% block="new address $address"
    //% address.defl=72
    //% blockSetVariable=adt7422
    export function ADT7422New(address: number = 72): ADT7422 {
        return new ADT7422(address)
    }
}
