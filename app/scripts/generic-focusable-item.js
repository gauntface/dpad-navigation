// Copyright 2012 Google Inc. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/* jshint undef: false */

/**
 * This is a Focusable Grid Item. It handles the focusing and defocusing of
 * the video thumbnails.
 *
 * @constructor
 * @augments FocusableItem
 * @param {DOMElement} element The DOM element of the Focusable Item
 * @param {String} containerId Container ID of the Focusable item
 */
function GenericFocusableItem(element, contId) {
    'use strict';

    FocusableItem.call(this, element);

    var classStates = {
        clickDown: 'clickdown'
    };
    var itemClickCallback = null;
    var containerId = contId;

    /**
    * Set's a callback method for when the item is clicked
    * @param {function} callback
    */
    this.setOnItemClickCallback = function (callback) {
        itemClickCallback = callback;
    };

    /**
    * Get the item click callback
    */
    this.getOnItemClickCallback = function () {
        return itemClickCallback;
    };

    /**
    * This returns an object with class names associated to each state
    */
    this.getClassStates = function () {
        return classStates;
    };

    /**
    * This is the container ID of the focusable DOM element
    */
    this.getContainerId = function () {
        return containerId;
    };
}

GenericFocusableItem.prototype = new FocusableItem();

/**
* Callback when the object is clicked
*/
GenericFocusableItem.prototype.onItemClickStateChange = function(isDown) {
    'use strict';

    var element = this.getElement();
    if(isDown) {
        element.classList.add(this.getClassStates().clickDown);
    } else {
        element.classList.remove(this.getClassStates().clickDown);

        var evObj = document.createEvent('MouseEvents');
        evObj.initEvent('click', true, true);
        element.dispatchEvent(evObj);
    }
};