
module.exports = function(grunt) {
    grunt.initConfig({
        // Configuration to be run (and then tested).
        version_bump: {
            files: [ __dirname + '/tmp/fail_test1000.json' ],
            versionStructureFile: __dirname + '/tmp/success_version_structure.json',
            incrementType:   'major'
        }
    });

    grunt.loadTasks('./../tasks');
    grunt.registerTask('default', ['version_bump']);

};