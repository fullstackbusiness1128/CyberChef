/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation";
import Utils from "../Utils";
import {scanForFileTypes} from "../lib/FileType";

/**
 * Scan for Embedded Files operation
 */
class ScanForEmbeddedFiles extends Operation {

    /**
     * ScanForEmbeddedFiles constructor
     */
    constructor() {
        super();

        this.name = "Scan for Embedded Files";
        this.module = "Default";
        this.description = "Scans the data for potential embedded files by looking for magic bytes at all offsets. This operation is prone to false positives.<br><br>WARNING: Files over about 100KB in size will take a VERY long time to process.";
        this.infoURL = "https://wikipedia.org/wiki/List_of_file_signatures";
        this.inputType = "ArrayBuffer";
        this.outputType = "string";
        this.args = [
            {
                "name": "Ignore common byte sequences",
                "type": "boolean",
                "value": true
            }
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        let output = "Scanning data for 'magic bytes' which may indicate embedded files. The following results may be false positives and should not be treat as reliable. Any suffiently long file is likely to contain these magic bytes coincidentally.\n",
            numFound = 0,
            numCommonFound = 0;
        const ignoreCommon = args[0],
            commonExts = ["ttf", "utf16le", ""],
            data = new Uint8Array(input),
            types = scanForFileTypes(data);


        if (types.length) {
            types.forEach(type => {
                if (ignoreCommon && commonExts.indexOf(type.fileDetails.extension) > -1) {
                    numCommonFound++;
                    return;
                }

                numFound++;
                output += "\nOffset " + type.offset + " (0x" + Utils.hex(type.offset) + "):\n" +
                    "  File extension: " + type.fileDetails.extension + "\n" +
                    "  MIME type:      " + type.fileDetails.mime + "\n";

                if (type.fileDetails.description && type.fileDetails.description.length) {
                    output += "  Description:    " + type.fileDetails.description + "\n";
                }
            });
        }

        if (numFound === 0) {
            output += "\nNo embedded files were found.";
        }

        if (numCommonFound > 0) {
            output += "\n\n" + numCommonFound;
            output += numCommonFound === 1 ?
                " file type was detected that has a common byte sequence. This is likely to be a false positive." :
                " file types were detected that have common byte sequences. These are likely to be false positives.";
            output += " Run this operation with the 'Ignore common byte sequences' option unchecked to see details.";
        }

        return output;
    }

}

export default ScanForEmbeddedFiles;
