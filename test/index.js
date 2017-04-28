/**
 * TestRunner.js
 *
 * For running the tests in the test register.
 *
 * @author tlwr [toby@toby.codes]
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2017
 * @license Apache-2.0
 */
import "babel-polyfill";

import TestRegister from "./TestRegister.js";
import "./tests/operations/Base58.js";
import "./tests/operations/ByteRepr.js";
import "./tests/operations/Compress.js";
import "./tests/operations/FlowControl.js";
import "./tests/operations/MorseCode.js";
import "./tests/operations/StrUtils.js";

let allTestsPassing = true,
    testStatusCounts = {
        total: 0,
    };


/**
 * Helper function to convert a status to an icon.
 *
 * @param {string} status
 * @returns {string}
 */
function statusToIcon(status) {
    let icons = {
        erroring: "🔥",
        failing: "❌",
        passing: "✔️️",
    };
    return icons[status] || "?";
}


/**
 * Displays a given test result in the console.
 *
 * @param {Object} testResult
 */
function handleTestResult(testResult) {
    allTestsPassing = allTestsPassing && testResult.status === "passing";
    let newCount = (testStatusCounts[testResult.status] || 0) + 1;
    testStatusCounts[testResult.status] = newCount;
    testStatusCounts.total += 1;

    console.log([
        statusToIcon(testResult.status),
        testResult.test.name
    ].join(" "));

    if (testResult.output) {
        console.log(
            testResult.output
                .trim()
                .replace(/^/, "\t")
                .replace(/\n/g, "\n\t")
        );
    }
}


/**
 * Fail if the process takes longer than 10 seconds.
 */
setTimeout(function() {
    console.log("Tests took longer than 10 seconds to run, returning.");
    process.exit(1);
}, 1 * 1000);


TestRegister.runTests()
    .then(function(results) {
        results.forEach(handleTestResult);

        console.log("\n");

        for (let testStatus in testStatusCounts) {
            let count = testStatusCounts[testStatus];
            if (count > 0) {
                console.log(testStatus.toUpperCase(), count);
            }
        }

        if (!allTestsPassing) {
            console.log("\nNot all tests are passing");
        }

        process.exit(allTestsPassing ? 0 : 1);
    });
