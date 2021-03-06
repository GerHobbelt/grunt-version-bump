
module.exports = function(grunt) {
    grunt.initConfig({
        // Configuration to be run (and then tested).
        version_bump: {
            files: [ __dirname + '/tmp/success_json_with_version.json' ],
            versionStructureFile: __dirname + '/tmp/success_version_structure.json',
            incrementType:   'major',
            condition:  'stage:SNAPSHOT'
        }
    });

    grunt.loadTasks('./../tasks');
    grunt.registerTask('default', ['version_bump']);

};