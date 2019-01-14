/**
 * @author j433866 [j433866@gmail.com]
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */

import Operation from "../Operation";
import OperationError from "../errors/OperationError";
import {FORMATS, convertCoordinates, convertSingleCoordinate, findDelim, findFormat} from "../lib/ConvertCoordinates";
import Utils from "../Utils";

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
        this.description = "Convert geographical coordinates between different formats.<br><br>Currently supported formats:<ul><li>Degrees Minutes Seconds (DMS)</li><li>Degrees Decimal Minutes (DDM)</li><li>Decimal Degrees (DD)</li><li>Geohash</li><li>Military Grid Reference System (MGRS)</li></ul>";
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
                    "Direction Preceding", // Need better names
                    "Direction Following",
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
                    "Direction Preceding", // Need better names
                    "Direction Following",
                    "\\n",
                    "Comma",
                    "Semi-colon",
                    "Colon"
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
        const outFormat = args[2],
            outDelim = args[3],
            precision = args[4];
        let inFormat = args[0],
            inDelim = args[1],
            inLat,
            inLong,
            outLat,
            outLong,
            latDir = "",
            longDir = "",
            outSeparator = " ";

        // Autodetect input delimiter
        if (inDelim === "Auto") {
            inDelim = findDelim(input);
            log.error("DATA: " + input + " DELIM: " + inDelim);
            if (inDelim === null) {
                inDelim = "";
                // throw new OperationError("Could not automatically detect the input delimiter.");
            }
        } else if (!inDelim.includes("Direction")) {
            // Get the actual delimiter from the regex
            inDelim = String(Utils.regexRep(inDelim)).slice(1, 2);
        }
        if (inFormat === "Auto") {
            inFormat = findFormat(input, inDelim);
            log.error("DATA: " + input + " FORMAT: " + inFormat);
            if (inFormat === null) {
                throw new OperationError("Could not automatically detect the input");
            }
        }

        if (inDelim === "" && (inFormat !== "Geohash" && inFormat !== "Military Grid Reference System")) {
            throw new OperationError("Could not automatically detect the input delimiter.");
        }

        // Prepare input data
        if (inFormat === "Geohash" || inFormat === "Military Grid Reference System") {
            // Geohash only has one value, so just use the input
            inLat = input;
        } else if (inDelim === "Direction Preceding") {
            // Split on the compass directions
            const splitInput = input.split(/[NnEeSsWw]/);
            const dir = input.match(/[NnEeSsWw]/g);
            if (splitInput.length > 1) {
                inLat = splitInput[1];
                if (dir !== null) {
                    latDir = dir[0];
                }
                if (splitInput.length > 2) {
                    inLong = splitInput[2];
                    if (dir !== null && dir.length > 1) {
                        longDir = dir[1];
                    }
                }
            }
        } else if (inDelim === "Direction Following") {
            // Split on the compass directions
            const splitInput = input.split(/[NnEeSsWw]/);
            if (splitInput.length >= 1) {
                inLat = splitInput[0];
                if (splitInput.length >= 2) {
                    inLong = splitInput[1];
                }
            }
        } else {
            // Split on the delimiter
            const splitInput = input.split(inDelim);
            log.error(splitInput);
            if (splitInput.length > 0) {
                inLat = splitInput[0];
                if (splitInput.length >= 2) {
                    inLong = splitInput[1];
                }
            }
        }

        if (inFormat !== "Geohash" && inFormat !== "Military Grid Reference System" && outDelim.includes("Direction")) {
            // Match on compass directions, and store the first 2 matches for the output
            const dir = input.match(/[NnEeSsWw]/g);
            if (dir !== null) {
                latDir = dir[0];
                if (dir.length > 1) {
                    longDir = dir[1];
                }
            }
        } else if (outDelim === "\\n") {
            outSeparator = "\n";
        } else if (outDelim === "Space") {
            outSeparator = " ";
        } else if (!outDelim.includes("Direction")) {
            // Cut out the regex syntax (/) from the delimiter
            outSeparator = String(Utils.regexRep(outDelim)).slice(1, 2);
        }

        // Convert the co-ordinates
        if (inLat !== undefined) {
            if (inLong === undefined) {
                if (inFormat !== "Geohash" && inFormat !== "Military Grid Reference System") {
                    if (outFormat === "Geohash" || outFormat === "Military Grid Reference System"){
                        throw new OperationError(`${outFormat} needs both a latitude and a longitude to be calculated`);
                    }
                }
                if (inFormat === "Geohash" || inFormat === "Military Grid Reference System") {
                    // Geohash conversion is in convertCoordinates despite needing
                    // only one input as it needs to output two values
                    [outLat, outLong] = convertCoordinates(inLat, inLat, inFormat, outFormat, precision);
                } else {
                    outLat = convertSingleCoordinate(inLat, inFormat, outFormat, precision);
                }
            } else {
                [outLat, outLong] = convertCoordinates(inLat, inLong, inFormat, outFormat, precision);
            }
        } else {
            throw new OperationError("No co-ordinates were detected in the input.");
        }

        // Output conversion results if successful
        if (outLat !== undefined) {
            let output = "";
            if (outDelim === "Direction Preceding" && outFormat !== "Geohash" && outFormat !== "Military Grid Reference System") {
                output += latDir += " ";
            }
            output += outLat;
            if (outDelim === "Direction Following" && outFormat !== "Geohash" && outFormat !== "Military Grid Reference System") {
                output += " " + latDir;
            }
            output += outSeparator;

            if (outLong !== undefined && outFormat !== "Geohash" && outFormat !== "Military Grid Reference System") {
                if (outDelim === "Direction Preceding") {
                    output += longDir + " ";
                }
                output += outLong;
                if (outDelim === "Direction Following") {
                    output += " " + longDir;
                }
                output += outSeparator;
            }
            return output;
        } else {
            throw new OperationError("Co-ordinate conversion failed.");
        }
    }
}

export default ConvertCoordinateFormat;
