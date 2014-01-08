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

GenericFocusableItem.prototype = new FocusableItem();

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
    FocusableItem.call(this, element);

    var classStates = {
        focused: "focused"
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

/**
* Callback when the objects focus state changes
* @param {Boolean} isFocused
*/
GenericFocusableItem.prototype.onFocusStateChange = function(isFocused) {
    var element = this.getElement();
    if(isFocused) {
        element.classList.add(this.getClassStates().focused);

        // Scroll into view
        /**var itemRootParent = $("#"+this.getContainerId());
        var elementWrapper = element.parent();

        var offsetAmount = elementWrapper.position().top +
        elementWrapper.outerHeight(true) -
        itemRootParent.outerHeight(true);

        if(offsetAmount > 0) {
            itemRootParent.stop().animate({
                scrollTop: itemRootParent.scrollTop() + offsetAmount
            }, 500);
        } else if(elementWrapper.position().top < 0) {
            itemRootParent.stop().animate({
                scrollTop: itemRootParent.scrollTop() + elementWrapper.position().top
            }, 500);
        }**/
    } else {
        element.classList.remove(this.getClassStates().focused);
    }
};

/**
* Callback when the object is clicked
*/
GenericFocusableItem.prototype.onItemClick = function() {
    if(this.getOnItemClickCallback()) {
        this.getOnItemClickCallback()();
    }
};