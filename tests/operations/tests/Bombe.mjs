/**
 * Bombe machine tests.
 * @author s2224834
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */
import TestRegister from "../TestRegister";

TestRegister.addTests([
    {
        name: "Bombe: 3 rotor (self-stecker)",
        input: "BBYFLTHHYIJQAYBBYS",
        expectedMatch: /LGA \(S <-> S\)/,
        recipeConfig: [
            {
                "op": "Bombe",
                "args": [
                    "BDFHJLCPRTXVZNYEIWGAKMUSQO<W", // III
                    "AJDKSIRUXBLHWTMCQGZNPYFVOE<F", // II
                    "EKMFLGDQVZNTOWYHXUSPAIBRCJ<R", // I
                    "",
                    "AY BR CU DH EQ FS GL IP JX KN MO TZ VW", // B
                    "THISISATESTMESSAGE", 0,
                ]
            }
        ]
    },
    {
        name: "Bombe: 3 rotor (other stecker)",
        input: "JBYALIHDYNUAAVKBYM",
        expectedMatch: /LGA \(A <-> G\)/,
        recipeConfig: [
            {
                "op": "Bombe",
                "args": [
                    "BDFHJLCPRTXVZNYEIWGAKMUSQO<W", // III
                    "AJDKSIRUXBLHWTMCQGZNPYFVOE<F", // II
                    "EKMFLGDQVZNTOWYHXUSPAIBRCJ<R", // I
                    "",
                    "AY BR CU DH EQ FS GL IP JX KN MO TZ VW", // B
                    "THISISATESTMESSAGE", 0,
                ]
            }
        ]
    },
    {
        name: "Bombe: crib offset",
        input: "AAABBYFLTHHYIJQAYBBYS", // first three chars here are faked
        expectedMatch: /LGA \(S <-> S\)/,
        recipeConfig: [
            {
                "op": "Bombe",
                "args": [
                    "BDFHJLCPRTXVZNYEIWGAKMUSQO<W", // III
                    "AJDKSIRUXBLHWTMCQGZNPYFVOE<F", // II
                    "EKMFLGDQVZNTOWYHXUSPAIBRCJ<R", // I
                    "",
                    "AY BR CU DH EQ FS GL IP JX KN MO TZ VW", // B
                    "THISISATESTMESSAGE", 3,
                ]
            }
        ]
    },
    /*
     * Long test is long
    {
        name: "Bombe: 4 rotor",
        input: "LUOXGJSHGEDSRDOQQX",
        expectedMatch: /LHSC \(S <-> S\)/,
        recipeConfig: [
            {
                "op": "Bombe",
                "args": [
                    "BDFHJLCPRTXVZNYEIWGAKMUSQO<W", // III
                    "AJDKSIRUXBLHWTMCQGZNPYFVOE<F", // II
                    "EKMFLGDQVZNTOWYHXUSPAIBRCJ<R", // I
                    "LEYJVCNIXWPBQMDRTAKZGFUHOS", // Beta
                    "AE BN CK DQ FU GY HW IJ LO MP RX SZ TV", // B thin
                    "THISISATESTMESSAGE", 0,
                ]
            }
        ]
    },
    */
    {
        name: "Bombe: no crib",
        input: "JBYALIHDYNUAAVKBYM",
        expectedMatch: /Crib cannot be empty/,
        recipeConfig: [
            {
                "op": "Bombe",
                "args": [
                    "BDFHJLCPRTXVZNYEIWGAKMUSQO<W", // III
                    "AJDKSIRUXBLHWTMCQGZNPYFVOE<F", // II
                    "EKMFLGDQVZNTOWYHXUSPAIBRCJ<R", // I
                    "",
                    "AY BR CU DH EQ FS GL IP JX KN MO TZ VW", // B
                    "", 0,
                ]
            }
        ]
    },
    {
        name: "Bombe: short crib",
        input: "JBYALIHDYNUAAVKBYM",
        expectedMatch: /Crib is too short/,
        recipeConfig: [
            {
                "op": "Bombe",
                "args": [
                    "BDFHJLCPRTXVZNYEIWGAKMUSQO<W", // III
                    "AJDKSIRUXBLHWTMCQGZNPYFVOE<F", // II
                    "EKMFLGDQVZNTOWYHXUSPAIBRCJ<R", // I
                    "",
                    "AY BR CU DH EQ FS GL IP JX KN MO TZ VW", // B
                    "A", 0,
                ]
            }
        ]
    },
    {
        name: "Bombe: invalid crib",
        input: "JBYALIHDYNUAAVKBYM",
        expectedMatch: /Invalid crib: .* in both ciphertext and crib/,
        recipeConfig: [
            {
                "op": "Bombe",
                "args": [
                    "BDFHJLCPRTXVZNYEIWGAKMUSQO<W", // III
                    "AJDKSIRUXBLHWTMCQGZNPYFVOE<F", // II
                    "EKMFLGDQVZNTOWYHXUSPAIBRCJ<R", // I
                    "",
                    "AY BR CU DH EQ FS GL IP JX KN MO TZ VW", // B
                    "AAAAAAAA", 0,
                ]
            }
        ]
    },
    {
        name: "Bombe: long crib",
        input: "JBYALIHDYNUAAVKBYM",
        expectedMatch: /Crib overruns supplied ciphertext/,
        recipeConfig: [
            {
                "op": "Bombe",
                "args": [
                    "BDFHJLCPRTXVZNYEIWGAKMUSQO<W", // III
                    "AJDKSIRUXBLHWTMCQGZNPYFVOE<F", // II
                    "EKMFLGDQVZNTOWYHXUSPAIBRCJ<R", // I
                    "",
                    "AY BR CU DH EQ FS GL IP JX KN MO TZ VW", // B
                    "CCCCCCCCCCCCCCCCCCCCCC", 0,
                ]
            }
        ]
    },
    {
        name: "Bombe: really long crib",
        input: "BBBBBBBBBBBBBBBBBBBBBBBBBB",
        expectedMatch: /Crib is too long/,
        recipeConfig: [
            {
                "op": "Bombe",
                "args": [
                    "BDFHJLCPRTXVZNYEIWGAKMUSQO<W", // III
                    "AJDKSIRUXBLHWTMCQGZNPYFVOE<F", // II
                    "EKMFLGDQVZNTOWYHXUSPAIBRCJ<R", // I
                    "",
                    "AY BR CU DH EQ FS GL IP JX KN MO TZ VW", // B
                    "AAAAAAAAAAAAAAAAAAAAAAAAAA", 0,
                ]
            }
        ]
    },
    {
        name: "Bombe: negative offset",
        input: "AAAAA",
        expectedMatch: /Offset cannot be negative/,
        recipeConfig: [
            {
                "op": "Bombe",
                "args": [
                    "BDFHJLCPRTXVZNYEIWGAKMUSQO<W", // III
                    "AJDKSIRUXBLHWTMCQGZNPYFVOE<F", // II
                    "EKMFLGDQVZNTOWYHXUSPAIBRCJ<R", // I
                    "",
                    "AY BR CU DH EQ FS GL IP JX KN MO TZ VW", // B
                    "BBBBB", -1,
                ]
            }
        ]
    },
    // Enigma tests cover validation of rotors and reflector
]);
