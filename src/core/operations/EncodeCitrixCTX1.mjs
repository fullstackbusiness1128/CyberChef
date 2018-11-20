/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2017
 * @license Apache-2.0
 */

import Operation from "../Operation";
import cptable from "../vendor/js-codepage/cptable.js";

/**
 * Encode Citrix CTX1 class
 */
class EncodeCitrixCTX1 extends Operation {

    /**
     * EncodeCitrixCTX1 constructor
     */
    constructor() {
        super();

        this.name = "Citrix CTX1 Encode";
        this.module = "Ciphers";
        this.description = "Encodes strings to Citrix CTX1 password format.";
        this.infoURL = "https://www.reddit.com/r/AskNetsec/comments/1s3r6y/citrix_ctx1_hash_decoding/";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        let utf16pass = Buffer.from(cptable.utils.encode(1200, input));
        let result = [];
        let temp = 0
        for (let i = 0; i < utf16pass.length; i++) {
            temp = utf16pass[i] ^ 0xa5 ^ temp;
            result.push(((temp >> 4) & 0xf) + 0x41);
            result.push((temp & 0xf) + 0x41);
        }

        return new TextDecoder("utf-8").decode(Buffer.from(result));
    }

}

export default EncodeCitrixCTX1;
