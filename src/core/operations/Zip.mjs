/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation";
import Utils from "../Utils";
import {COMPRESSION_TYPE, ZLIB_COMPRESSION_TYPE_LOOKUP} from "../lib/Zlib";
import zip from "zlibjs/bin/zip.min";

const Zlib = zip.Zlib;

const ZIP_COMPRESSION_METHOD_LOOKUP = {
    "Deflate":      Zlib.Zip.CompressionMethod.DEFLATE,
    "None (Store)": Zlib.Zip.CompressionMethod.STORE
};

const ZIP_OS_LOOKUP = {
    "MSDOS":     Zlib.Zip.OperatingSystem.MSDOS,
    "Unix":      Zlib.Zip.OperatingSystem.UNIX,
    "Macintosh": Zlib.Zip.OperatingSystem.MACINTOSH
};

/**
 * Zip operation
 */
class Zip extends Operation {

    /**
     * Zip constructor
     */
    constructor() {
        super();

        this.name = "Zip";
        this.module = "Compression";
        this.description = "Compresses data using the PKZIP algorithm with the given filename.<br><br>No support for multiple files at this time.";
        this.inputType = "byteArray";
        this.outputType = "byteArray";
        this.args = [
            {
                name: "Filename",
                type: "string",
                value: "file.txt"
            },
            {
                name: "Comment",
                type: "string",
                value: ""
            },
            {
                name: "Password",
                type: "binaryString",
                value: ""
            },
            {
                name: "Compression method",
                type: "option",
                value: ["Deflate", "None (Store)"]
            },
            {
                name: "Operating system",
                type: "option",
                value: ["MSDOS", "Unix", "Macintosh"]
            },
            {
                name: "Compression type",
                type: "option",
                value: COMPRESSION_TYPE
            }
        ];
    }

    /**
     * @param {byteArray} input
     * @param {Object[]} args
     * @returns {byteArray}
     */
    run(input, args) {
        const password = Utils.strToByteArray(args[2]),
            options = {
                filename: Utils.strToByteArray(args[0]),
                comment: Utils.strToByteArray(args[1]),
                compressionMethod: ZIP_COMPRESSION_METHOD_LOOKUP[args[3]],
                os: ZIP_OS_LOOKUP[args[4]],
                deflateOption: {
                    compressionType: ZLIB_COMPRESSION_TYPE_LOOKUP[args[5]]
                },
            },
            zip = new Zlib.Zip();

        if (password.length)
            zip.setPassword(password);
        zip.addFile(input, options);
        return Array.prototype.slice.call(zip.compress());
    }

}

export default Zip;
