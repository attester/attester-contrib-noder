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

var _ = require("lodash");
var path = require("path");

module.exports = function (attester, config) {
	// Get the middleware for the noder files
	var middleware = attester.middlewares.staticFolder(path.join(__dirname, "../node_modules/noder-js/dist/browser"));

	// Normalize some paths
	var noderConfig = normalizeConfig(config);

	// And the one for the client part
	var client = attester.middlewares.template.bind({
		page: "attester-noder.js",
		path: path.join(__dirname, "client.js"),
		data: noderConfig
	});

	// Serve this file under noder-js
	attester.server.use("/noder-js", middleware);
	attester.server.use("/noder-js", client);

	// Include noder script with the configuration
	var noder = {
		tagName: "script",
		src: "/noder-js/noder.js",
		content: stringify(noderConfig)
	};

	// Put everything in the page
	attester.testPage.include({
		head: [{
			tagName: "script",
			src: "/noder-js/attester-noder.js"
		}, noder]
	});
};

/**
 * Make sure that paths are valid for attester.
 * Noder baseUrl must be prefixed with the campaign baseURL.
 * We also want to signal the on start of attester
 */
function normalizeConfig (config) {
	if (config.packaging && config.packaging.baseUrl) {
		config.packaging.baseUrl = "<%= data.baseURL %>/" + config.packaging.baseUrl;
	}

	// This tells the client part that the main module has been loaded
	if (config.main) {
		var onstart = config.onstart;
		if (onstart) {
			var fnBody = (function (main) {
				try {
					(__onstart__)(main);
				} catch (ex) {}
				attester.currentTask.attester_noder.mainReady();
			}).toString().replace("__onstart__", onstart.toString());

			config.onstart = new Function("main", "(" + fnBody + ")(main);");
		} else {
			config.onstart = function () {
				attester.currentTask.attester_noder.mainReady();
			};
		}
	}

	return config;
}

/**
 * This method works pretty much like JSON.stringify with the difference that
 * it converts functions to strings so that they can be evaluated as script.
 * It doesn't support functions inside arrays
 */
function stringify (config) {
	var keys = [];
	_.forOwn(config, function (value, key) {
		var asString = JSON.stringify(key) + ":";
		if (_.isFunction(value)) {
			asString += value.toString();
		} else if (_.isPlainObject(value)) {
			asString += stringify(value);
		} else {
			asString += JSON.stringify(value);
		}
		// I don't expect functions inside arrays
		keys.push(asString);
	});

	return "{" + keys.join(",") + "}";
}
