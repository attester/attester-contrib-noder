# attester-contrib-noder

Use [noder](https://github.com/ariatemplates/noder) inside attester.

## Getting Started

This plugin requires attester `~1.2.2`.

If you're not familiar with [attester](http://attester.ariatemplates.com) and its plugin system you can refer to [using attester as a module](http://attester.ariatemplates.com/usage/module.html). Once you know how to create a test campaign you can install the plugin with this command

````
npm install attester-contrib-noder --save-dev
````

Once the plugin has been installed, you can enable it inside your test script with this line of JavaScript

````
attester.plugins.require("attester-contrib-noder");
````

## Configuration

The plugin can be configured calling instead

````
attester.plugins.require("attester-contrib-noder", {
	// config options here
});
````

More information on noder configuration are available on [Configuring Noder](https://github.com/ariatemplates/noder/blob/master/doc/configuration.md)


### varName

`varName` attribute is the name of the global variable exposed by Noder.

    varName: "noder"

### scriptsType

Type of scripts to execute as CommonJS modules.

    scriptsType: "text/noder"

### main

Main module to load when starting

    main: "lib/myMainModule"

If this module is specified, tests will start after the module starts.

### onstart 

Function to be executed when the main module has been loaded. The reference to the exported object is given as a parameter.

    onstart: function (mainModule) {
        // Some code here
    }

If this callback is specified, tests will start after the return of this method.

### resolver

The resolver configuration allows to describe the tree of modules and how module names map to physical files.

    resolver: {
        "default" : {
        "underscore" : {}, // require.resolve("underscore") will return "underscore/index.js"
        "uglify-js" : {
            "." : "uglify-js.js" // require.resolve("uglify-js") will return "uglify-js/uglify-js.js"
        }
    }

### packaging

Specify how files are packaged.

    packaging: {
        baseUrl: "", // Base URL which is prepended to every path when requesting files to the server.
        packagesMap: {
            "markdown" : {
                // Include all files in the markdown folder (including files in sub-folders):
                "**" : "markdown.js"
            },
            "myFolder" : {
                "a.js" : "myPackage1.js",
                "b.js" : "myPackage1.js",
                "c.js" : "myPackage2.js"
            }
        }
    }
