/**
 * @fileoverview The object responsible for reporting errors in CheckStyle XML format
 * @author Donatas Stundys <donatas.stundys@gmail.com>
 */

"use strict";

const xmlEscape = require("../utils/xml-escape");

let output;

module.exports = {

    initialize: function() {
        output = "<?xml version=\"1.0\" encoding=\"utf-8\"?>";
        output += "<checkstyle version=\"4.3\">";
    },

    reportFatal: function(message) {
        process.stdout.write(`[Fatal error] ${message}\n`);
    },

    reportInternal: function(message) {
        process.stdout.write(`[Warning] ${message}\n`);
    },

    report: function(filename, sourceCode, lintErrors, fixesApplied) {
        let internalIssuesExist = false;

        // Examine internal issues first
        lintErrors.forEach(function(issue, index) {
            if (!issue.internal) {
                return;
            }

            process.stdout.write(`${issue.message}\n`);

            delete lintErrors[index];
            internalIssuesExist = true;
        });

        internalIssuesExist && process.stdout.write("\n");

        output += `<file name="${xmlEscape(filename)}">`;

        lintErrors.forEach(function(error) {
            output += [
                `<error line="${xmlEscape(error.line)}"`,
                `column="${xmlEscape(error.column)}"`,
                `severity="${xmlEscape(error.type)}"`,
                `message="${xmlEscape(error.message)} (${error.ruleName})"`,
                `source="${xmlEscape(error.ruleName)}" />`
            ].join(" ");
        });

        output += "</file>";
    },

    finalize: function() {
        output += "</checkstyle>";
        process.stdout.write(output);
    }

};
