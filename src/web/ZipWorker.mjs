/**
 * Web Worker to handle zipping the outputs for download.
 *
 * @author j433866 [j433866@gmail.com]
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */

import zip from "zlibjs/bin/zip.min";
import Utils from "../core/Utils";

const Zlib = zip.Zlib;

/**
 * Respond to message from parent thread.
 */
self.addEventListener("message", function(e) {
    const r = e.data;
    if (!r.hasOwnProperty("outputs")) {
        log.error("No files were passed to the ZipWorker.");
        return;
    }
    if (!r.hasOwnProperty("filename")) {
        log.error("No filename was passed to the ZipWorker");
        return;
    }
    if (!r.hasOwnProperty("fileExtension")) {
        log.error("No file extension was passed to the ZipWorker");
        return;
    }

    self.zipFiles(r.outputs, r.filename, r.fileExtension);
});

self.setOption = function(...args) {};

/**
 * Compress the files into a zip file and send the zip back
 * to the OutputWaiter.
 *
 * @param {object} outputs
 * @param {string} filename
 * @param {string} fileExtension
 */
self.zipFiles = function(outputs, filename, fileExtension) {
    const zip = new Zlib.Zip();
    const inputNums = Object.keys(outputs);

    for (let i = 0; i < inputNums.length; i++) {
        const iNum = inputNums[i];
        const name = Utils.strToByteArray(iNum + fileExtension);

        let output;
        if (outputs[iNum].data === null) {
            output = new Uint8Array(0);
        } else if (typeof outputs[iNum].data.result === "string") {
            output = new Uint8Array(Utils.strToArrayBuffer(outputs[iNum].data.result));
        } else {
            output = new Uint8Array(outputs[iNum].data.result);
        }
        zip.addFile(output, {filename: name});
    }

    const zippedFile = zip.compress();
    self.postMessage({
        zippedFile: zippedFile.buffer,
        filename: filename
    }, [zippedFile.buffer]);
};
