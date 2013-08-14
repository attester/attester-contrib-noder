#!/usr/bin/env node
/*
 * Copyright 2013 Amadeus s.a.s.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var attester = require("attester");

attester.config.set({
	"phantomjs-instances": 1
});

// __dirname is the test folder, while process.cwd() is the parent when using npm test

attester.campaign.create({
	resources: {
		"/": ["test/src"]
	},
	tests: {
		mocha: {
			files: {
				rootDirectory: __dirname,
				includes: ["*.js"],
				excludes: ["testCampaign.js"]
			},
			assertion: "expect"
		}
	}
});

// Include the plugin with some configuration
attester.plugins.require(__dirname + "/../lib/plugin", {
	varName: "safeNoder",
	scriptsType: "text/noder",
	main: "main",
	onstart: function (main) {
		main.initialize(2);
	},
	resolver: {
		"default": {
			numbers: {},
			sum: {
				".": "../lib/math/sum.js"
			},
			multiply: {
				".": "../lib/math/multiply.js"
			}
		}
	},
	packaging: {
		baseUrl: "modules/",
		packagesMap: {
			"ext": {
				"**": "external.js"
			}
		}
	}
});

attester.event.once("attester.core.idle", function () {
	process.exit(0);
});
attester.event.once("attester.core.fail", function () {
	process.exit(1);
});

attester.start();
