module.exports = function(grunt) {

    grunt.loadTasks('tasks');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-clean');


    grunt.initConfig({

        nodeunit: {
            tests: ['tests/*_test.js']
        },

        clean: {
            test: ['tests/tmp']
        }
    });

    grunt.registerTask('test', [
        'nodeunit'
    ]);
    grunt.registerTask('default', ['test']);
};
