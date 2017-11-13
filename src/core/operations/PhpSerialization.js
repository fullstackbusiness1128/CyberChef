/**
 * Php Serialization operations.
 * This Javascript implementation is based on the Python
 * implementation by Armin Ronacher (2016).
 * See: https://github.com/mitsuhiko/phpserialize/
 *
 * @author Jarmo van Lenthe [github.com/jarmovanlenthe]
 * @copyright Crown Copyright 2017
 * @license BSD-3-Clause
 *
 * @namespace
 */

const PhpSerialization = {

    /**
     * @constant
     * @default
     */
    OUTPUT_VALID_JSON: true,

    /**
     * Deserializes a PHP serialized input
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    PhpDeserialize: function (input, args) {
        function handleInput() {
            function read(length) {
                let result = "";
                for (let idx = 0; idx < length; idx++) {
                    let char = inputPart.shift();
                    if (char === undefined) {
                        throw "End of input reached before end of script";
                    }
                    result += char;
                }
                return result;
            }

            function readUntil(until) {
                let result = "";
                while (true) {
                    let char = read(1);
                    if (char === until) {
                        break;
                    } else {
                        result += char;
                    }
                }
                return result;

            }

            function expect(expect) {
                let result = read(expect.length);
                if (result !== expect) {
                    throw "Unexpected input found";
                }
                return result;
            }

            function handleArray() {
                let items = parseInt(readUntil(":"), 10) * 2;
                expect("{");
                let result = [];
                let isKey = true;
                let lastItem = null;
                for (let idx = 0; idx < items; idx++) {
                    let item = handleInput();
                    if (isKey) {
                        lastItem = item;
                        isKey = false;
                    } else {
                        let numberCheck = lastItem.match(/[0-9]+/);
                        if (args[0] && numberCheck && numberCheck[0].length === lastItem.length) {
                            result.push("\"" + lastItem + "\": " + item);
                        } else {
                            result.push(lastItem + ": " + item);
                        }
                        isKey = true;
                    }
                }
                expect("}");
                return result;
            }


            let kind = read(1).toLowerCase();

            switch (kind) {
                case "n":
                    expect(";");
                    return "";

                case "i":
                case "d":
                case "b": {
                    expect(":");
                    let data = readUntil(";");
                    if (kind === "b") {
                        return (parseInt(data, 10) !== 0);
                    }
                    return data;
                }

                case "a":
                    expect(":");
                    return "{" + handleArray() + "}";

                case "s": {
                    expect(":");
                    let length = readUntil(":");
                    expect("\"");
                    let value = read(length);
                    expect("\";");
                    if (args[0]) {
                        return "\"" + value.replace(/"/g, "\\\"") + "\"";
                    } else {
                        return "\"" + value + "\"";
                    }
                }

                default:
                    throw "Unknown type: " + kind;
            }
        }

        let inputPart = input.split("");
        return handleInput();
    }
};

export default PhpSerialization;
