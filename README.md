#Overview
A grunt plugin for bumping a version property in JSON files. Can work with many semantic version formats and others out of the box, from short `major.minor` up to advanced `major.minor.patch-stage.build`. 

#Getting Started
The plugin requires Grunt ~0.4.2

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-version-bump --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-version-bump');
```

## The "version_bump" task

### Overview
In your project's Gruntfile, add a section named `version_bump`.

```js
grunt.initConfig({
  version_bump: {
    files: ['package.json', 'component.json', 'somefile.txt']
  }
});

```

## Usage

```js
grunt version_bump
```
There is a default version string structure, but you can provide your own structure.

By default, the part with the lowest priority gets bumped. In the default version string structure that would be the **build** part.

You can specify a different increment type in the 1st argument:
```js
grunt version_bump:[incrementType]
```
The default version string structure pattern is
```
<major>.<minor>.<patch>-<stage>.<build>
```
where the `patch`, `stage` and `build` fields are *optional*.

Available increment types provided in the default version string structure:<br>
Let's assume current version is 1.2.3-SNAPSHOT.4
```javascript
    grunt version_bump:major // 2.0.0-SNAPSHOT.1
    grunt version_bump:build // 2.0.0-SNAPSHOT.2
    grunt version_bump:minor // 2.1.0-SNAPSHOT.1
    grunt version_bump:build // 2.1.0-SNAPSHOT.2
    grunt version_bump:patch // 2.1.1-SNAPSHOT.1
    grunt version_bump:build // 2.1.1-SNAPSHOT.2
    grunt version_bump:stage // 2.1.0-alpha.1
    grunt version_bump:build // 2.1.0-alpha.2
    grunt version_bump:stage // 2.1.0-beta.1
    grunt version_bump:stage // 2.1.0-RELEASE.1
    grunt version_bump:major --condition=stage:alpha // 2.1.0-RELEASE.1
    grunt version_bump:major --condition=minor:1 // 2.2.0-RELEASE.1
```
As can be seen, bumping a part results in resetting all parts of lower priority. The priority order of the default version string structure is **major**, **minor**, **stage**, **patch**, **build**.

The default behaviour is to detect the lowest ranking version part in your input and bump that one.

You override this default behaviour by explicitly specifying the part you want bumped in the plugin option `incrementType`: then the bumped version output will be extended to this level as if the missing levels were *reset*, e.g. bumping the `build` level of input version 1.2 will output 1.2.0-SNAPSHOT.0.

### Settings

#### files
Type: `String|Array`  
Default: `['package.json']`

File paths of the meta file(s) you wish to operate on.

#### incrementType
Type: `String`  

The part to increment. Must be defined in the version string structure.

When this option is not specified, the default version bump behaviour will be assumed as described above.

#### versionStructureFile
Type: `String`  

File path to the version structure file if you wish to override the default.

#### versionStructure
Type: `JSON`

The content of a version structure. An array of objects with the following fields:
##### name
Type: `String`

The name of the part.

##### prefix
Type: `String`
Default: `.`

A string to put before the part.

##### order
Type: `Integer`

The order of the part in the version string. Must be consecutive.

##### priority
Type: `Integer`

The priority of the part in the version string. Must be consecutive. 1 is for the highest priority.

##### optional
Type: `Boolean`

Whether or not the part is optional. 

For example, the default structure defines the parts `patch`, `stage` and `build` as optional.

##### resettable
Type: `Boolean`

Whether or not the part should be reset if a higher priority part was requested to be bumped.

##### resetTo
Type: `Integer`
Default: 0

The number to use when resetting a resettable part.

##### values
Type: `Array`

Array of strings ordered by priority of possible values for that part if numbers are not good enough.

For example, the default structure defines these `stage` values: `["SNAPSHOT", "alpha", "beta", "RELEASE"]`

#### callback
Type: `Function`

Callback function which is invoked after a successfully job; its parameter is the new version *string*.

This callback is optional.

### Command Line Options
#### condition
Type `String:String`

A condition that only if met allows the version bump action to run. The left part is a name of a part and the right part is the value.

## Contributing
In lieu of a formal style guide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

## Issues
Please use the [github issues list](https://github.com/xl8/grunt-coffeelinter/issues) to report any issues. If possible, please include a link to an open github repo with the smallest failing example of your issue. Even better, fork the project, create a failing test case and issue a pull request with the issue number referenced in the pull request. Super better, fork the project create a failing test case, fix the problem, and issue a pull request with the test and fix referencing the issue number. 
