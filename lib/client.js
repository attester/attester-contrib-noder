/* globals attester */
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

(function () {
    var attesterCallback;

    // All this logic is needed to let attester wait that the main script is loaded
    attester.currentTask.attester_noder = {
        mainReady: function () {
            if (attesterCallback) {
                attesterCallback();
            }
            attesterCallback = false;
        },
        waitForReady: function (callback) {
            if (attesterCallback === false) {
                // mainReady was called already, no need to wait for actions
                callback();
            } else {
                attesterCallback = callback;
            }
        }
    };

    attester.currentTask.actions.push(attester.currentTask.attester_noder.waitForReady);
})();

/**
 * To support noder inside tests it would be nice to do the following,
 * however since noder alway tries to resolve path, we cannot require
 * tests that are not modules.

attester.currentTask.includeTests = function (scripts, callback) {
    // This is problematic if varName is not defined
    var noder = <% print(data.varName || 'noder') %>;
    noder.asyncRequire(scripts).then(function () {
        for (var i = 0; i < scripts.length; i += 1) {
            noder.require(scripts[i]);
        }
        callback();
    });
};
*/
