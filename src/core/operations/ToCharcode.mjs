/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation";
import Utils from "../Utils";
import {DELIM_OPTIONS} from "../lib/Delim";

/**
 * To Charcode operation
 */
class ToCharcode extends Operation {

    /**
     * ToCharcode constructor
     */
    constructor() {
        super();

        this.name = "To Charcode";
        this.module = "Default";
        this.description = "Converts text to its unicode character code equivalent.<br><br>e.g. <code>Γειά σου</code> becomes <code>0393 03b5 03b9 03ac 20 03c3 03bf 03c5</code>";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "Delimiter",
                "type": "option",
                "value": DELIM_OPTIONS
            },
            {
                "name": "Base",
                "type": "number",
                "value": 16
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const delim = Utils.charRep(args[0] || "Space"),
            base = args[1];
        let output = "",
            padding = 2,
            ordinal;

        if (base < 2 || base > 36) {
            throw "Error: Base argument must be between 2 and 36";
        }

        const charcode = Utils.strToCharcode(input);
        for (let i = 0; i < charcode.length; i++) {
            ordinal = charcode[i];

            if (base === 16) {
                if (ordinal < 256) padding = 2;
                else if (ordinal < 65536) padding = 4;
                else if (ordinal < 16777216) padding = 6;
                else if (ordinal < 4294967296) padding = 8;
                else padding = 2;

                if (padding > 2 && ENVIRONMENT_IS_WORKER()) self.setOption("attemptHighlight", false);

                output += Utils.hex(ordinal, padding) + delim;
            } else {
                if (ENVIRONMENT_IS_WORKER()) self.setOption("attemptHighlight", false);
                output += ordinal.toString(base) + delim;
            }
        }

        return output.slice(0, -delim.length);
    }

}

export default ToCharcode;
