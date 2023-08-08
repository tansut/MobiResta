
export interface Decoder {
    decode: () => any;
    validate: () => boolean;
}

class QRDecoder implements Decoder {
    constructor(private input: any) {
    }

    decode() {
        if (this.validate())
            return this.input;
        else throw new Error('Invalid QR Data');
    }

    validate(): boolean {
        return !!this.input;
    }
}

var TypeMap = {
    'qr_code': QRDecoder
}

export class QR {
    static createDecoder(qrtype: string, input: string): Decoder {
        var constructorFn = TypeMap[qrtype.toLowerCase()];
        if (typeof constructorFn == 'undefined')
            throw new Error('Unknown QR type');
        return new constructorFn(input);
    }
}
