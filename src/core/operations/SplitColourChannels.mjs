/**
 * @author Matt C [matt@artemisbot.uk]
 * @copyright Crown Copyright 2018
 * @license Apache-2.0
 */

import Operation from "../Operation";
import OperationError from "../errors/OperationError";
import Utils from "../Utils";
import Magic from "../lib/Magic";

import jimp from "jimp";

/**
 * Split Colour Channels operation
 */
class SplitColourChannels extends Operation {

    /**
     * SplitColourChannels constructor
     */
    constructor() {
        super();

        this.name = "Split Colour Channels";
        this.module = "Image";
        this.description = "Splits given image into its red, green and blue colour channels.";
        this.infoURL = "https://en.wikipedia.org/wiki/Channel_(digital_image)";
        this.inputType = "byteArray";
        this.outputType = "List<File>";
        this.presentType = "html";
        this.args = [
            /* Example arguments. See the project wiki for full details.
            {
                name: "First arg",
                type: "string",
                value: "Don't Panic"
            },
            {
                name: "Second arg",
                type: "number",
                value: 42
            }
            */
        ];
    }

    /**
     * @param {byteArray} input
     * @param {Object[]} args
     * @returns {List<File>}
     */
    async run(input, args) {
        const type = Magic.magicFileType(input);
        // Make sure that the input is an image
        if (type && type.mime.indexOf("image") === 0) {
            const parsedImage = await jimp.read(Buffer.from(input));
            const red = new Promise(async (resolve, reject) => {
                try {
                    const split = parsedImage.clone()
                        .color([
                            {apply: "blue", params: [-255]},
                            {apply: "green", params: [-255]}
                        ]).getBufferAsync(jimp.MIME_PNG);
                    resolve(new File([new Uint8Array((await split).values())], "red.png", {type: "image/png"}));
                } catch (err) {
                    reject(new OperationError("Could not split red channel."));
                }
            });
            const green = new Promise(async (resolve, reject) => {
                try {
                    const split = parsedImage.clone()
                        .color([
                            {apply: "red", params: [-255]},
                            {apply: "blue", params: [-255]},
                        ]).getBufferAsync(jimp.MIME_PNG);
                    resolve(new File([new Uint8Array((await split).values())], "green.png", {type: "image/png"}));
                } catch (err) {
                    reject(new OperationError("Could not split green channel."));
                }
            });
            const blue = new Promise(async (resolve, reject) => {
                try {
                    const split = parsedImage
                        .color([
                            {apply: "red", params: [-255]},
                            {apply: "green", params: [-255]},
                        ]).getBufferAsync(jimp.MIME_PNG);
                    resolve(new File([new Uint8Array((await split).values())], "blue.png", {type: "image/png"}));
                } catch (err) {
                    reject(new OperationError("Could not split blue channel."));
                }
            });
            return await Promise.all([red, green, blue]);
        } else {
            throw new OperationError("Invalid file type.");
        }
    }

    /**
     * Displays the files in HTML for web apps.
     *
     * @param {File[]} files
     * @returns {html}
     */
    async present(files) {
        return await Utils.displayFilesAsHTML(files);
    }

}

export default SplitColourChannels;
