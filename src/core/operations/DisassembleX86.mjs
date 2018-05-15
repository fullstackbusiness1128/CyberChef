/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2017
 * @license Apache-2.0
 */

import Operation from "../Operation";
import disassemble from "../vendor/DisassembleX86-64.js";
/**
 * Disassemble x86 operation
 */
class DisassembleX86 extends Operation {

    /**
     * DisassembleX86 constructor
     */
    constructor() {
        super();

        this.name = "Disassemble x86";
        this.module = "Shellcode";
        this.description = "Disassembly is the process of translating machine language into assembly language.<br><br>This operation supports 64-bit, 32-bit and 16-bit code written for Intel or AMD x86 processors. It is particularly useful for reverse engineering shellcode.<br><br>Input should be in hexadecimal.";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "Bit mode",
                "type": "option",
                "value": ["64", "32", "16"]
            },
            {
                "name": "Compatibility",
                "type": "option",
                "value": [
                    "Full x86 architecture",
                    "Knights Corner",
                    "Larrabee",
                    "Cyrix",
                    "Geode",
                    "Centaur",
                    "X86/486"
                ]
            },
            {
                "name": "Code Segment (CS)",
                "type": "number",
                "value": 16
            },
            {
                "name": "Offset (IP)",
                "type": "number",
                "value": 0
            },
            {
                "name": "Show instruction hex",
                "type": "boolean",
                "value": true
            },
            {
                "name": "Show instruction position",
                "type": "boolean",
                "value": true
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const mode = args[0],
            compatibility = args[1],
            codeSegment = args[2],
            offset = args[3],
            showInstructionHex = args[4],
            showInstructionPos = args[5];

        switch (mode) {
            case "64":
                disassemble.setBitMode(2);
                break;
            case "32":
                disassemble.setBitMode(1);
                break;
            case "16":
                disassemble.setBitMode(0);
                break;
            default:
                throw "Invalid mode value";
        }

        switch (compatibility) {
            case "Full x86 architecture":
                disassemble.CompatibilityMode(0);
                break;
            case "Knights Corner":
                disassemble.CompatibilityMode(1);
                break;
            case "Larrabee":
                disassemble.CompatibilityMode(2);
                break;
            case "Cyrix":
                disassemble.CompatibilityMode(3);
                break;
            case "Geode":
                disassemble.CompatibilityMode(4);
                break;
            case "Centaur":
                disassemble.CompatibilityMode(5);
                break;
            case "X86/486":
                disassemble.CompatibilityMode(6);
                break;
        }

        disassemble.SetBasePosition(codeSegment + ":" + offset);
        disassemble.setShowInstructionHex(showInstructionHex);
        disassemble.setShowInstructionPos(showInstructionPos);
        disassemble.LoadBinCode(input.replace(/\s/g, ""));
        return disassemble.LDisassemble();
    }

}

export default DisassembleX86;
