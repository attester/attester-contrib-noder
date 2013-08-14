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

var sum = require("sum");
var numbers = require("ext/num");

var referenceValue = 0;

exports.initialize = function (value) {
	referenceValue = value;
};

// Expose these methods on window because tests cannot use noder so far
window.DoTheMath = exports.DoTheMath = function () {
	var value = referenceValue;
	for (var i = 0; i < arguments.length; i += 1) {
		value = sum(value, numbers[arguments[i]]);
	}
	return value;
};

window.times = exports.times = require("multiply");
