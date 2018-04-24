/**
 * @fileoverview Tests for the long-lines rule
 * @author Leo Arias <yo@elopio.net>
 */

"use strict";

const Solium = require("../../../../lib/solium"),
    wrappers = require("../../../utils/wrappers"),
    { addPragma } = wrappers;
const DEFAULT_MAX_ACCEPTABLE_LEN = 79;

function makeString(length, character) {
    return new Array(length + 1).join(character);
}

let userConfig = {
    "custom-rules-filename": null,
    "rules": {
        "long-lines": true
    }
};


describe("[RULE] long-lines: Acceptances", function() {
    it("should allow short line", function(done) {
        let name = makeString(DEFAULT_MAX_ACCEPTABLE_LEN - "contract  {}".length, "a"),
            code = `contract ${name} {}`,
            errors = Solium.lint(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);


        name = makeString(DEFAULT_MAX_ACCEPTABLE_LEN - 1 - "contract  {}".length, "a");
        code = `contract ${name} {}`;
        errors = Solium.lint(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(0);

        Solium.reset();
        done();
    });
});

describe("[RULE] long-lines: Rejections", function() {
    it("should reject long line on top level node", function(done) {
        let name = makeString(DEFAULT_MAX_ACCEPTABLE_LEN + 1 - "contract  {}".length, "a"),
            code = `contract ${name} {}`,
            errors = Solium.lint(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);
        errors[0].node.type.should.equal("ContractStatement");
        errors[0].message.should.equal("line is longer than 79 characters");

        Solium.reset();
        done();
    });

    it("should reject long line on child node", function(done) {
        let name = makeString(DEFAULT_MAX_ACCEPTABLE_LEN + 1 - "        uint ;".length, "a"),
            code = (
                "contract dummy {\n" +
                "    function dummy() {\n" +
                `        uint ${name};\n` +
                "    }\n" +
                "}"),
            errors = Solium.lint(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);
        errors[0].node.type.should.equal("ExpressionStatement");
        errors[0].message.should.equal("line is longer than 79 characters");

        Solium.reset();
        done();
    });

    it("should reject long line only once", function(done) {
        let name = makeString(DEFAULT_MAX_ACCEPTABLE_LEN + 1 - "        uint short;uint ;".length, "a"),
            code = (
                "contract dummy {\n" +
                "    function dummy() {\n" +
                `        uint short;uint ${name};\n` +
                "    }\n" +
                "}"),
            errors = Solium.lint(addPragma(code), userConfig);

        errors.constructor.name.should.equal("Array");
        errors.length.should.equal(1);
        errors[0].node.type.should.equal("ExpressionStatement");
        errors[0].message.should.equal("line is longer than 79 characters");

        Solium.reset();
        done();
    });
});
