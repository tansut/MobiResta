﻿/// <reference path="../../ref/angularjs/angular.d.ts" />


import {Meta} from '../Core/Meta';
import {BaseService, ServiceConfiguration} from '../Core/BaseService';


export var AES: AESService;

interface AESConfiguration extends ServiceConfiguration {
    Title: string;
}


class AESImpl {

    static AES_Sbox = new Array(99, 124, 119, 123, 242, 107, 111, 197, 48, 1, 103, 43, 254, 215, 171,
        118, 202, 130, 201, 125, 250, 89, 71, 240, 173, 212, 162, 175, 156, 164, 114, 192, 183, 253,
        147, 38, 54, 63, 247, 204, 52, 165, 229, 241, 113, 216, 49, 21, 4, 199, 35, 195, 24, 150, 5, 154,
        7, 18, 128, 226, 235, 39, 178, 117, 9, 131, 44, 26, 27, 110, 90, 160, 82, 59, 214, 179, 41, 227,
        47, 132, 83, 209, 0, 237, 32, 252, 177, 91, 106, 203, 190, 57, 74, 76, 88, 207, 208, 239, 170,
        251, 67, 77, 51, 133, 69, 249, 2, 127, 80, 60, 159, 168, 81, 163, 64, 143, 146, 157, 56, 245,
        188, 182, 218, 33, 16, 255, 243, 210, 205, 12, 19, 236, 95, 151, 68, 23, 196, 167, 126, 61,
        100, 93, 25, 115, 96, 129, 79, 220, 34, 42, 144, 136, 70, 238, 184, 20, 222, 94, 11, 219, 224,
        50, 58, 10, 73, 6, 36, 92, 194, 211, 172, 98, 145, 149, 228, 121, 231, 200, 55, 109, 141, 213,
        78, 169, 108, 86, 244, 234, 101, 122, 174, 8, 186, 120, 37, 46, 28, 166, 180, 198, 232, 221,
        116, 31, 75, 189, 139, 138, 112, 62, 181, 102, 72, 3, 246, 14, 97, 53, 87, 185, 134, 193, 29,
        158, 225, 248, 152, 17, 105, 217, 142, 148, 155, 30, 135, 233, 206, 85, 40, 223, 140, 161,
        137, 13, 191, 230, 66, 104, 65, 153, 45, 15, 176, 84, 187, 22);

    static AES_ShiftRowTab = new Array(0, 5, 10, 15, 4, 9, 14, 3, 8, 13, 2, 7, 12, 1, 6, 11);

    private AES_Sbox_Inv: Array<number>;
    private AES_ShiftRowTab_Inv: Array<number>;
    private AES_xtime: Array<number>;
    private key: Array<string>;

    constructor(key: string) {


        var expandkey = (key) => {
            var kl = key.length, ks, Rcon = 1;
            switch (kl) {
                case 16: ks = 16 * (10 + 1); break;
                case 24: ks = 16 * (12 + 1); break;
                case 32: ks = 16 * (14 + 1); break;
                default:
                    alert("AES_ExpandKey: Only key lengths of 16, 24 or 32 bytes allowed!");
            }
            for (var i = kl; i < ks; i += 4) {
                var temp = key.slice(i - 4, i);
                if (i % kl == 0) {
                    temp = new Array(AESImpl.AES_Sbox[temp[1]] ^ Rcon, AESImpl.AES_Sbox[temp[2]],
                        AESImpl.AES_Sbox[temp[3]], AESImpl.AES_Sbox[temp[0]]);
                    if ((Rcon <<= 1) >= 256)
                        Rcon ^= 0x11b;
                }
                else if ((kl > 24) && (i % kl == 16))
                    temp = new Array(AESImpl.AES_Sbox[temp[0]], AESImpl.AES_Sbox[temp[1]],
                        AESImpl.AES_Sbox[temp[2]], AESImpl.AES_Sbox[temp[3]]);
                for (var j = 0; j < 4; j++)
                    key[i + j] = key[i + j - kl] ^ temp[j];
            }
        }

        this.AES_Sbox_Inv = new Array(256);
        for (var i = 0; i < 256; i++)
            this.AES_Sbox_Inv[AESImpl.AES_Sbox[i]] = i;

        this.AES_ShiftRowTab_Inv = new Array(16);
        for (var i = 0; i < 16; i++)
            this.AES_ShiftRowTab_Inv[AESImpl.AES_ShiftRowTab[i]] = i;

        this.AES_xtime = new Array(256);
        for (var i = 0; i < 128; i++) {
            this.AES_xtime[i] = i << 1;
            this.AES_xtime[128 + i] = (i << 1) ^ 0x1b;
        }
        this.key = this.string2Bin(key);
        expandkey(this.key);
    }

    string2Bin(str) {
        var result = [];
        for (var i = 0; i < str.length; i++) {
            result.push(str.charCodeAt(i));
        }
        return result;
    }

    bin2String(array) {
        return String.fromCharCode.apply(String, array);
    }


    Encrypt(inputStr) {
        var key = this.key;
        var block = this.string2Bin(inputStr);
        var l = key.length;
        this.AES_AddRoundKey(block, key.slice(0, 16));
        for (var i = 16; i < l - 16; i += 16) {
            this.AES_SubBytes(block, AESImpl.AES_Sbox);
            this.AES_ShiftRows(block, AESImpl.AES_ShiftRowTab);
            this.AES_MixColumns(block);
            this.AES_AddRoundKey(block, key.slice(i, i + 16));
        }
        this.AES_SubBytes(block, AESImpl.AES_Sbox);
        this.AES_ShiftRows(block, AESImpl.AES_ShiftRowTab);
        this.AES_AddRoundKey(block, key.slice(i, l));
        return this.bin2String(block);
    }

    decryptLongString(myString) {
        if (myString.length > 16) {
            var data = '';
            for (var i = 0; i < myString.length; i = i + 16) {
                data += this.Decrypt(myString.substr(i, 16));
            }
            return data;
        } else {
            return this.Decrypt(myString);
        }
    }

    Decrypt(inputStr) {
        var block = this.string2Bin(inputStr);
        var key = this.key;
        var l = key.length;
        this.AES_AddRoundKey(block, key.slice(l - 16, l));
        this.AES_ShiftRows(block, this.AES_ShiftRowTab_Inv);
        this.AES_SubBytes(block, this.AES_Sbox_Inv);
        for (var i = l - 32; i >= 16; i -= 16) {
            this.AES_AddRoundKey(block, key.slice(i, i + 16));
            this.AES_MixColumns_Inv(block);
            this.AES_ShiftRows(block, this.AES_ShiftRowTab_Inv);
            this.AES_SubBytes(block, this.AES_Sbox_Inv);
        }
        this.AES_AddRoundKey(block, key.slice(0, 16));
        return this.bin2String(block);
    }




    AES_SubBytes(state, sbox) {
        for (var i = 0; i < 16; i++)
            state[i] = sbox[state[i]];
    }

    AES_AddRoundKey(state, rkey) {
        for (var i = 0; i < 16; i++)
            state[i] ^= rkey[i];
    }

    AES_ShiftRows(state, shifttab) {
        var h = new Array().concat(state);
        for (var i = 0; i < 16; i++)
            state[i] = h[shifttab[i]];
    }

    AES_MixColumns(state) {
        for (var i = 0; i < 16; i += 4) {
            var s0 = state[i + 0], s1 = state[i + 1];
            var s2 = state[i + 2], s3 = state[i + 3];
            var h = s0 ^ s1 ^ s2 ^ s3;
            state[i + 0] ^= h ^ this.AES_xtime[s0 ^ s1];
            state[i + 1] ^= h ^ this.AES_xtime[s1 ^ s2];
            state[i + 2] ^= h ^ this.AES_xtime[s2 ^ s3];
            state[i + 3] ^= h ^ this.AES_xtime[s3 ^ s0];
        }
    }

    AES_MixColumns_Inv(state) {
        for (var i = 0; i < 16; i += 4) {
            var s0 = state[i + 0], s1 = state[i + 1];
            var s2 = state[i + 2], s3 = state[i + 3];
            var h = s0 ^ s1 ^ s2 ^ s3;
            var xh = this.AES_xtime[h];
            var h1 = this.AES_xtime[this.AES_xtime[xh ^ s0 ^ s2]] ^ h;
            var h2 = this.AES_xtime[this.AES_xtime[xh ^ s1 ^ s3]] ^ h;
            state[i + 0] ^= h1 ^ this.AES_xtime[s0 ^ s1];
            state[i + 1] ^= h2 ^ this.AES_xtime[s1 ^ s2];
            state[i + 2] ^= h1 ^ this.AES_xtime[s2 ^ s3];
            state[i + 3] ^= h2 ^ this.AES_xtime[s3 ^ s0];
        }
    }
}




@Meta.Service('AESService')
export class AESService extends BaseService {

    static Configuration: AESConfiguration;

    static InstanceReady(instance) {
        AES = instance;
    }

    static Configure(factory, app, config: AESConfiguration) {
        AESService.Configuration = config;
        BaseService.Configure(factory, app, config);
    }

    GetInstance(key: string = ''): AESImpl {
        var fooKey = key == '' ? AESService.Configuration.Title : key;
        return new AESImpl(fooKey);
    }


    constructor() {
        super();
    }
}