#!/usr/bin/env node


/*
   CLI version of this grunt tool so it can run without grunt
 */

"use strict";

var bumper = require('../tasks/version_bump');


function getCommandlineOptions () {
    var version = require('../package.json').version;
    var opts = require('nomnom')
    .script('version_bump')
    .option('file', {
        flag : true,
        position : 0,
        help : 'file containing the version JSON to bump'
    })
    .option('level', {
        abbr : 'l',
        flag : true,
        help : 'the level to bump: major, minor, patch, stage or build'
    })
    .option('debug', {
        abbr : 'd',
        flag : true,
        default: false,
        help : 'Debug mode'
    })
    .option('version', {
        abbr : 'V',
        flag : true,
        help : 'print version and exit',
        callback : function () {
            return version;
        }
    }).parse();

    return opts;
}

var cli = module.exports;

cli.main = function cliMain(opts) {
    opts = opts || {};

    function processInputFile () {
        var fs = require('fs');
        var path = require('path');

        // getting raw files
        var lex;
        if (opts.lexfile) {
            lex = fs.readFileSync(path.normalize(opts.lexfile), 'utf8');
        }
        var raw = fs.readFileSync(path.normalize(opts.file), 'utf8');

        // making best guess at json mode
        opts.json = path.extname(opts.file) === '.json' || opts.json;

        // setting output file name and module name based on input file name
        // if they aren't specified.
        var name = path.basename((opts.outfile || opts.file));

        name = name.replace(/\..*$/g, '');

        opts.outfile = opts.outfile || (name + '.js');
        if (!opts.moduleName && name) {
            opts.moduleName = name.replace(/-\w/g,
                    function (match) {
                    return match.charAt(1).toUpperCase();
                });
        }

        var parser = processGrammar(raw, lex, opts);
        fs.writeFileSync(opts.outfile, parser);
    }

    function readin(cb) {
        var stdin = process.openStdin(),
        data = '';

        stdin.setEncoding('utf8');
        stdin.addListener('data', function (chunk) {
            data += chunk;
        });
        stdin.addListener('end', function () {
            cb(data);
        });
    }

    function processStdin () {
        console.log("reading from STDIN...");
        readin(function (raw) {
            console.log(processGrammar(raw, null, opts));
        });
    }

    // if an input file wasn't given, assume input on stdin
    if (opts.file) {
        processInputFile();
    } else {
        processStdin();
    }
};



if (require.main === module) {
    var opts = getCommandlineOptions();
    cli.main(opts);
}



// fake GRUNT:
function fake_grunt() {
    var _grunt_plugin_name  = "version_bump";

    var grunt = {
        registerTask: function (grunt_plugin_name, task_name, callback) {
        },

        option: function (name) {
            return null;
        },

        config: function (grunt_plugin_name) {
            return [ /* options */ ];
        },

        fail: {
            fatal: function (ex) {
                throw ex;
            },
        },

        file: {
            exists: function (file_path) {
                return true;
            },

            read: function (file_path) {
                return "";
            },

            write: function (file_path, data) {

            },
        },

        log: {
            ok: function (message) {

            },
        },

        files: [
            //...
        ]
    };

    return grunt;
}





