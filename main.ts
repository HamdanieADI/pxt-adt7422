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

            this.setRange(this._range)

            return true;
        }

        //% blockId=ADT7422_setrange
        //% block="%adt7422|set range|$range"
        //% range.defl=ADT7422Range.R2_G
        public setRange(range: ADT7422Range = ADT7422Range.R2_G) {
            /* Read the data format register to preserve bits */
            let format = this.readRegister(ADT7422Register.DATA_FORMAT);

            /* Update the data rate */
            format &= ~0x0F;
            format |= range;

            /* Make sure that the FULL-RES bit is enabled for range scaling */
            format |= 0x08;

            /* Write the register back to the IC */
            this.writeRegister(ADT7422Register.DATA_FORMAT, format);

            /* Keep track of the current range (to avoid readbacks) */
            this._range = range;
        }

        //% blockId=ADT7422_getrange
        //% block="%adt7422|get range"
        public getRange(): ADT7422Range {
            /* Read the data format register to preserve bits */
            return this.readRegister(ADT7422Register.DATA_FORMAT) & 0x03;
        }

        //% blockId=ADT7422_setdatarate
        //% block="%adt7422|set datarate|$dataRate"
        //% dataRate.defl=ADT7422DataRate.D0_10_HZ
        public setDataRate(dataRate: ADT7422DataRate = ADT7422DataRate.D0_10_HZ) {
            this.writeRegister(ADT7422Register.BW_RATE, dataRate);
        }

        //% blockId=ADT7422_getdatarate
        //% block="%adt7422|get datarate"
        public getDataRate(): ADT7422DataRate {
            /* Read the data format register to preserve bits */
            return this.readRegister(ADT7422Register.BW_RATE) & 0x0F;
        }

        //% blockId=ADT7422_writeRegister
        //% block="%adt7422|write byte register $reg|value $value"
        //% reg.defl=ADT7422Register.DEVID
        //% value.defl=0
        public writeRegister(reg: ADT7422Register = ADT7422Register.DEVID, value: number = 0): void {
            let buf = pins.createBuffer(2)
            buf[0] = reg
            buf[1] = value
            pins.i2cWriteBuffer(this._address, buf, false)
        }

        //% blockId=ADT7422_readRegister
        //% block="%adt7422|read byte register $reg"
        //% reg.defl=ADT7422Register.DEVID
        public readRegister(reg: ADT7422Register = ADT7422Register.DEVID): number {
            pins.i2cWriteNumber(this._address, reg, NumberFormat.UInt8LE)
            return pins.i2cReadNumber(this._address, NumberFormat.UInt8LE)
        }

        //% blockId=ADT7422_readRegisterI16
        //% block="%adt7422|read word register $reg"
        //% reg.defl=ADT7422Register.DATAX0
        public readRegisterI16(reg: ADT7422Register = ADT7422Register.DATAX0): number {
            pins.i2cWriteNumber(this._address, reg, NumberFormat.UInt8LE)
            return pins.i2cReadNumber(this._address, NumberFormat.Int16LE)
        }

        //% blockId=ADT7422_getDeviceID
        //% block="%adt7422|deviceId"
        //% blockSetVariable=id
        public getDeviceID(): number {
            return this.readRegister(ADT7422Register.DEVID)
        }

        //% blockId=ADT7422_get
        //% block="%adt7422|get|$dim"
        //% dim.defl=ADT7422Dimension.X
        public get(dim: ADT7422Dimension = ADT7422Dimension.X): number {
            if (dim == ADT7422Dimension.X)
                return this.readRegisterI16(ADT7422Register.DATAX0)
            else if (dim == ADT7422Dimension.Y)
                return this.readRegisterI16(ADT7422Register.DATAX0)
            else if (dim == ADT7422Dimension.Z)
                return this.readRegisterI16(ADT7422Register.DATAZ0)
            return 0;
        }
    }

    //% blockId=ADT7422_new
    //% block="new address $address|range $range"
    //% address.defl=83
    //% range.defl=ADT7422Range.R2_G
    //% blockSetVariable=adt7422
    export function ADT7422New(address: number = 83, range: ADT7422Range = ADT7422Range.R2_G): ADT7422 {
        return new ADT7422(address, range)
    }
}
