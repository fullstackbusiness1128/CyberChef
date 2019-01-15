/**
 * @author j433866 [j433866@gmail.com]
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */

import Operation from "../Operation";
import {FORMATS, convertCoordinates} from "../lib/ConvertCoordinates";

/**
 * Convert co-ordinate format operation
 */
class ConvertCoordinateFormat extends Operation {

    /**
     * ConvertCoordinateFormat constructor
     */
    constructor() {
        super();

        this.name = "Convert co-ordinate format";
        this.module = "Hashing";
        this.description = "Convert geographical coordinates between different formats.<br><br>Supported formats:<ul><li>Degrees Minutes Seconds (DMS)</li><li>Degrees Decimal Minutes (DDM)</li><li>Decimal Degrees (DD)</li><li>Geohash</li><li>Military Grid Reference System (MGRS)</li><li>Ordnance Survey National Grid (OSNG)</li><li>Universal Transverse Mercator (UTM)</li></ul><br>The operation can try to detect the input co-ordinate format and delimiter automatically, but this may not always work correctly.";
        this.infoURL = "https://wikipedia.org/wiki/Geographic_coordinate_conversion";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "Input Format",
                "type": "option",
                "value": ["Auto"].concat(FORMATS)
            },
            {
                "name": "Input Delimiter",
                "type": "option",
                "value": [
                    "Auto",
                    "Direction Preceding",
                    "Direction Following",
                    "Space",
                    "\\n",
                    "Comma",
                    "Semi-colon",
                    "Colon"
                ]
            },
            {
                "name": "Output Format",
                "type": "option",
                "value": FORMATS
            },
            {
                "name": "Output Delimiter",
                "type": "option",
                "value": [
                    "Space",
                    "\\n",
                    "Comma",
                    "Semi-colon",
                    "Colon"
                ]
            },
            {
                "name": "Include Compass Directions",
                "type": "option",
                "value": [
                    "None",
                    "Before",
                    "After"
                ]
            },
            {
                "name": "Precision",
                "type": "number",
                "value": 3
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const [inFormat, inDelim, outFormat, outDelim, incDirection, precision] = args;
        return convertCoordinates(input, inFormat, inDelim, outFormat, outDelim, incDirection, precision);
    }
}

export default ConvertCoordinateFormat;
