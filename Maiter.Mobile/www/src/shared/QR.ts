
export interface Decoder {
    decode: () => any;
    validate: () => boolean;
}

class JSonQRDecoder implements Decoder {
    constructor(private input: any) { 
    }

    decode() {
        if (this.validate())
            return JSON.parse(this.input);
        else throw new Error('Invalid QR Data');
    }

    validate(): boolean {
        return !!this.input;
    }
}

var TypeMap = {
    'qr_code': JSonQRDecoder
}

export class QR {
    static createDecoder(qrtype: string, input: string): Decoder {
        var constructorFn = TypeMap[qrtype.toLowerCase()];
        if (typeof constructorFn == 'undefined')
            throw new Error('Unknown QR type');
        return new constructorFn(input);
    }
}
