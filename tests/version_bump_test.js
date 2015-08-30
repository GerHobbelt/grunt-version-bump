'use strict';

var grunt=require('grunt'), cp = require("child_process"), command, options;

function callGruntfile(filename, whenDoneCallback) {
    var command, options;
    command = "grunt --gruntfile "+filename+" --no-color";
    options = {cwd: __dirname};
    cp.exec(command, options, whenDoneCallback);
}

function callNpmInstallAndGruntfile(filename, whenDoneCallback) {
    var command, options;
    command = "npm install";
    options = {cwd: __dirname};
    cp.exec(command, {}, function(error, stdout, stderr) {
        callGruntfile(filename, whenDoneCallback);
    });
}

function contains(where, what) {
    var index = where.toString().indexOf(what);
    return index>-1;
}

function notcontains(where, what) {
    var index = where.toString().indexOf(what);
    return index==-1;
}

function containsWarning(buffer, warning) {
    return contains(buffer, 'Warning: Plugin failed: ' + warning);
}

function getTypicalErrorMessage(error, stdout, stderr) {
    return 'STDOUT: ' + stdout + ' STDERR: ' + stderr;
}

exports.version_bump_tester = {

    setUp: function(done) {
        grunt.file.copy('tests/fixtures/failure_json_with_no_version.json', 'tests/tmp/failure_json_with_no_version.json');
        grunt.file.copy('tests/fixtures/failure_not_a_json.json', 'tests/tmp/failure_not_a_json.json');
        grunt.file.copy('tests/fixtures/success_json_with_version.json', 'tests/tmp/success_json_with_version.json');
        grunt.file.copy('tests/fixtures/success_json_with_shorter_version.json', 'tests/tmp/success_json_with_shorter_version.json');
        grunt.file.copy('tests/fixtures/success_version_structure.json', 'tests/tmp/success_version_structure.json');
        grunt.file.copy('tests/fixtures/failure_version_structure_missing_field.json', 'tests/tmp/failure_version_structure_missing_field.json');
        grunt.file.copy('tests/fixtures/failure_version_structure_wrong_field_type.json', 'tests/tmp/failure_version_structure_wrong_field_type.json');
        grunt.file.copy('tests/fixtures/failure_version_structure_non_consecutive_field_values.json', 'tests/tmp/failure_version_structure_non_consecutive_field_values.json');
        grunt.file.copy('tests/fixtures/failure_version_structure_non_consecutive_field_values2.json', 'tests/tmp/failure_version_structure_non_consecutive_field_values2.json');
        done();
    },

    tearDown: function(done) {
        grunt.file.delete('tests/tmp', { force: true });
        done();
    },

    /*
        Test when the json of the file to be bumped does not have an attribute called version
     */
    fail_json_with_no_version: function(test) {
        test.expect(1);
        callGruntfile('fail_json_with_no_version.js', function (error, stdout, stderr) {
            test.equal(contains(stdout, 'Couldn\'t find attribute version in the JSON parse'), true, getTypicalErrorMessage(error, stdout, stderr));
            test.done();
        });
    },
    /*
        Test when an unsupported increment type is requested
     */
    fail_unsupported_increment_type: function(test) {
        test.expect(1);
        callGruntfile('fail_unsupported_increment_type.js', function (error, stdout, stderr) {
            test.equal(contains(stdout, 'Only these incrementable parts are supported'), true, getTypicalErrorMessage(error, stdout, stderr));
            test.done();
        });
    },
    /*
        Test when a specified file to be bumped does not exist
     */
    fail_no_bump_file: function(test) {
        test.expect(1);
        callGruntfile('fail_no_bump_file.js', function (error, stdout, stderr) {
            test.equal(contains(stdout, 'not found'), true, getTypicalErrorMessage(error, stdout, stderr));
            test.done();
        });
    },
    /*
        Test when the provided file to be bumped is not a valid JSON
     */
    fail_bump_file_not_valid_json: function(test) {
        test.expect(1);
        callGruntfile('fail_bump_file_not_valid_json.js', function (error, stdout, stderr) {
            test.equal(contains(stdout, 'Couldn\'t parse file'), true, getTypicalErrorMessage(error, stdout, stderr));
            test.done();
        });
    },
    /*
        Test if major bump works well
     */
    success_bump_major: function(test) {
        test.expect(1);
        callGruntfile('success_bump_major.js', function (error, stdout, stderr) {
            test.equal(contains(stdout, 'bumped [major] from 1.2.3-SNAPSHOT.4 to 2.0.0-SNAPSHOT.1'), true, getTypicalErrorMessage(error, stdout, stderr));
            test.done();
        });
    },
    /*
        Test if minor bump works well
     */
    success_bump_minor: function(test) {
        test.expect(1);
        callGruntfile('success_bump_minor.js', function (error, stdout, stderr) {
            test.equal(contains(stdout, 'bumped [minor] from 1.2.3-SNAPSHOT.4 to 1.3.0-SNAPSHOT.1'), true, getTypicalErrorMessage(error, stdout, stderr));
            test.done();
        });
    },
    /*
        Test if patch bump works well
     */
    success_bump_patch: function(test) {
        test.expect(1);
        callGruntfile('success_bump_patch.js', function (error, stdout, stderr) {
            test.equal(contains(stdout, 'bumped [patch] from 1.2.3-SNAPSHOT.4 to 1.2.4-SNAPSHOT.1'), true, getTypicalErrorMessage(error, stdout, stderr));
            test.done();
        });
    },
    /*
     Test if stage bump works well
     */
    success_bump_stage: function(test) {
        test.expect(1);
        callGruntfile('success_bump_stage.js', function (error, stdout, stderr) {
            test.equal(contains(stdout, 'bumped [stage] from 1.2.3-SNAPSHOT.4 to 1.2.0-alpha.1'), true, getTypicalErrorMessage(error, stdout, stderr));
            test.done();
        });
    },
    /*
     Test if build bump works well
     */
    success_bump_build: function(test) {
        test.expect(1);
        callGruntfile('success_bump_build.js', function (error, stdout, stderr) {
            test.equal(contains(stdout, 'bumped [build] from 1.2.3-SNAPSHOT.4 to 1.2.3-SNAPSHOT.5'), true, getTypicalErrorMessage(error, stdout, stderr));
            test.done();
        });
    },
    /*
     Test if condition works well (positive)
     */
    success_condition: function(test) {
        test.expect(1);
        callGruntfile('success_condition.js', function (error, stdout, stderr) {
            test.equal(contains(stdout, 'bumped [major] from 1.2.3-SNAPSHOT.4 to 2.0.0-SNAPSHOT.1'), true, getTypicalErrorMessage(error, stdout, stderr));
            test.done();
        });
    },
    /*
     Test if input_version option works well
     */
    success_bump_build_inputversion: function(test) {
        test.expect(1);
        callGruntfile('success_bump_build_inputversion.js', function (error, stdout, stderr) {
            test.equal(contains(stdout, 'bumped [build] from 2.95.4-alpha.105 to 2.95.4-alpha.106'), true, getTypicalErrorMessage(error, stdout, stderr));
            test.done();
        });
    },
    /*
     Test if input_version option works well
     */
    success_bump_stage_inputversion_quiet: function(test) {
        test.expect(1);
        callGruntfile('success_bump_stage_inputversion_quiet.js', function (error, stdout, stderr) {
            test.equal(notcontains(stdout, 'bumped [stage] from 2.95.4-alpha.105 to 2.95.0-beta.1'), true, getTypicalErrorMessage(error, stdout, stderr));
            test.done();
        });
    },
    /*
     Test RETURN_VALUE
     */
    success_bump_build_inputversion_quiet_retval: function(test) {
        test.expect(1);
        callGruntfile('success_bump_build_inputversion_quiet_retval.js', function (error, stdout, stderr) {
            test.equal(contains(stdout, 'RETURN_VALUE: 2.95.4-alpha.106'), true, getTypicalErrorMessage(error, stdout, stderr));
            test.done();
        });
    },
    /*
     Test if the structure misses a mandatory field
     */
    fail_version_structure_missing_field: function(test) {
        test.expect(1);
        callGruntfile('fail_version_structure_missing_field.js', function (error, stdout, stderr) {
            test.equal(contains(stdout, 'invalid version structure: missing field name'), true, getTypicalErrorMessage(error, stdout, stderr));
            test.done();
        });
    },
    /*
     Test if the structure has a field with incorrect type of value
     */
    fail_version_structure_wrong_field_type: function(test) {
        test.expect(1);
        callGruntfile('fail_version_structure_wrong_field_type.js', function (error, stdout, stderr) {
            test.equal(contains(stdout, 'invalid version structure: order field should be positive integer'), true, getTypicalErrorMessage(error, stdout, stderr));
            test.done();
        });
    },
    /*
     Test if the structure has a field which should have consecutive values and it does not
     */
    fail_version_structure_non_consecutive_field_values1: function(test) {
        test.expect(1);
        callGruntfile('fail_version_structure_non_consecutive_field_values.js', function (error, stdout, stderr) {
            test.equal(contains(stdout, 'invalid version structure: priority field values should be consecutive'), true, getTypicalErrorMessage(error, stdout, stderr));
            test.done();
        });
    },
    /*
     Test if the structure has a field which should have consecutive values and it does not
     */
    fail_version_structure_non_consecutive_field_values2: function(test) {
        test.expect(1);
        callGruntfile('fail_version_structure_non_consecutive_field_values2.js', function (error, stdout, stderr) {
            test.equal(contains(stdout, 'invalid version structure: priority field values should be consecutive'), true, getTypicalErrorMessage(error, stdout, stderr));
            test.done();
        });
    },
    /*
     Test if condition works well (negative)
     */
    fail_condition: function(test) {
        test.expect(1);
        callGruntfile('fail_condition.js', function (error, stdout, stderr) {
            test.equal(contains(stdout, 'was not met. skipping.'), true, getTypicalErrorMessage(error, stdout, stderr));
            test.done();
        });
    },
    /*
    Test if callback function returns correct value
     */
    success_bump_returns_correct_version: function(test) {
        test.expect(1);
        callGruntfile('success_bump_minor_with_callback.js', function (error, stdout, stderr) {
          test.equal(contains(stdout, 'Returned from callback function: 1.3.0-SNAPSHOT.1'), true, getTypicalErrorMessage(error, stdout, stderr));
          test.done();
        });
    },
    /*
    Test if callback function returns correct value
     */
    success_bump_returns_correct_shorter_version: function(test) {
        test.expect(1);
        callGruntfile('success_bump_minor_shorter_version.js', function (error, stdout, stderr) {
          test.equal(contains(stdout, 'Returned from callback function: 1.3.0'), true, getTypicalErrorMessage(error, stdout, stderr));
          test.done();
        });
    },
    /*
        Test if major bump works well
     */
    success_bump_major_for_short_version: function(test) {
        test.expect(1);
        callGruntfile('success_bump_major_for_short_version.js', function (error, stdout, stderr) {
            test.equal(contains(stdout, 'bumped [major] from 1.2.3 to 2.0.0'), true, getTypicalErrorMessage(error, stdout, stderr));
            test.done();
        });
    },
    /*
        Test if minor bump works well
     */
    success_bump_minor_for_short_version: function(test) {
        test.expect(1);
        callGruntfile('success_bump_minor_for_short_version.js', function (error, stdout, stderr) {
            test.equal(contains(stdout, 'bumped [minor] from 1.2.3 to 1.3.0'), true, getTypicalErrorMessage(error, stdout, stderr));
            test.done();
        });
    },
    /*
        Test if patch bump works well
     */
    success_bump_patch_for_short_version: function(test) {
        test.expect(1);
        callGruntfile('success_bump_patch_for_short_version.js', function (error, stdout, stderr) {
            test.equal(contains(stdout, 'bumped [patch] from 1.2.3 to 1.2.4'), true, getTypicalErrorMessage(error, stdout, stderr));
            test.done();
        });
    },
    /*
     Test if stage bump works well
     */
    success_bump_stage_for_short_version: function(test) {
        test.expect(1);
        callGruntfile('success_bump_stage_for_short_version.js', function (error, stdout, stderr) {
            test.equal(contains(stdout, 'bumped [stage] from 1.2.3 to 1.2.0-SNAPSHOT'), true, getTypicalErrorMessage(error, stdout, stderr));
            test.done();
        });
    },
    /*
     Test if build bump works well
     */
    success_bump_build_for_short_version: function(test) {
        test.expect(1);
        callGruntfile('success_bump_build_for_short_version.js', function (error, stdout, stderr) {
            test.equal(contains(stdout, 'bumped [build] from 1.2.3 to 1.2.3-SNAPSHOT.1'), true, getTypicalErrorMessage(error, stdout, stderr));
            test.done();
        });
    },
};
