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

/**
 * This controller will take care of determining where the focus moves when
 * a key press or mouse movement has occurred
 *
 * @constructor
 */
 function FocusController() {
    var focusableItems = [];
    var moving = false;
    var currentlyFocusedItem = null;

    /**
    * Check whether a focusable item is already in the item array
    * @param {FocusableItem} item Check to see if the FocusableItem is already
    * in the FocusController
    */
    this.isFocusableItem = function (item) {
        for(var i = 0; i < focusableItems.length; i++) {
            if(focusableItems[i] == item) {
                return true;
            }
        }
        return false;
    };

    /**
    * Push a focusable item onto item array
    * @private
    * @param {FocusableItem} item
    */
    this.pushFocusableItem = function (item) {
        focusableItems.push(item);
    };

    /**
    * Remove a focusable item from the controller
    * @param {FocusableItem} item The item to remove
    */
    this.removeFocusableItem = function (item) {
        for(var i = 0; i < focusableItems.length; i++) {
            if(focusableItems[i] == item) {
                focusableItems.splice(i, 1);
                return true;
            }
        }
        return false;
    };

    /**
    * Get the number of focusable items in the controller
    */
    this.getFocusableItemCount = function () {
        return focusableItems.length;
    };

    /**
    * Get a focusable item at a particular index in the array
    * @param {int} index
    */
    this.getFocusableItem = function (index) {
        if(index >= focusableItems.length) {
            return null;
        }

        return focusableItems[index];
    };

    /**
    * Get the currently focused FocusableItem
    */
    this.getCurrentlyFocusedItem = function () {
        return currentlyFocusedItem;
    };

    /**
    * Is the focus currently moving
    */
    this.isMoving = function () {
        return moving;
    };

    /**
    * This method performs a change of focus to the item index
    * @param {int} itemIndex
    */
    this.handleFocusChangeToItem = function (itemIndex) {
        if(currentlyFocusedItem) {
            currentlyFocusedItem.setFocusState(false);
        }

        var focusableItem = this.getFocusableItem(itemIndex);
        focusableItem.setFocusState(true);

        currentlyFocusedItem = focusableItem;
    };

    /**
    * This will take a direction vector and move the focus to the most
    * appropriate item or make no change if there are no items to move to
    * @param {array} direction A direction vector [x, y]
    */
    this.moveFocus = function (direction) {
        // We need an item to move down from
        // TODO: Should initialise focus if not initialised...
        if(!currentlyFocusedItem) {
            return;
        }

        var nextItemIndex = null;
        if(direction.y === 0) {
            if(direction.x > 0) {
                // Move Right
                nextItemIndex = currentlyFocusedItem.getRightFocusItemIndex();
            } else {
                // Move Left
                nextItemIndex = currentlyFocusedItem.getLeftFocusItemIndex();
            }
        } else if(direction.x === 0) {
            if(direction.y > 0) {
                // Move Up
                nextItemIndex = currentlyFocusedItem.getTopFocusItemIndex();
            } else {
                // Move Down
                nextItemIndex = currentlyFocusedItem.getBottomFocusItemIndex();
            }
        }

        if(nextItemIndex !== null) {
            this.handleFocusChangeToItem(nextItemIndex);
        }
    };

    // Set up binding to listen for key presses
    document.addEventListener("keydown", function(e) {
            this.onKeyDown(e);
        }.bind(this), false);

    /**
    * @private
    */
    /**function calculateElementDistance(fromFocusableItem, toFocusableItem, direction) {

        var fromElement = fromFocusableItem.getElement();
        var toElement = toFocusableItem.getElement();

        var fromClientWidth = fromElement.clientWidth;
        var fromClientHeight = fromElement.clientHeight;
        var fromElementLeft = fromElement.offsetLeft;
        var fromElementRight = fromElementLeft + fromClientWidth;
        var fromElementTop = fromElement.offsetTop;
        var fromElementBottom = fromElementTop + fromElement.clientHeight;
        var fromElementCenterX = fromElementLeft + (fromClientWidth / 2);
        var fromElementCenterY = fromElementTop + (fromClientHeight / 2);

        var toClientWidth = toElement.clientWidth;
        var toClientHeight = toElement.clientHeight;
        var toElementLeft = toElement.offsetLeft;
        var toElementRight = toElementLeft + toClientWidth;
        var toElementTop = toElement.offsetTop;
        var toElementBottom = toElementTop + toClientHeight;
        var toElementCenterX = toElementLeft + (toClientWidth / 2);
        var toElementCenterY = toElementTop + (toClientHeight / 2);

        var distanceY = null;
        var distanceX = null;
        var toItemDistance = -1;

        if(direction.y === 0) {
            if(direction.x < 0) {
                // Move Left

                // The to element is on the left hand side
                if (toElementRight <= fromElementLeft) {
                    distanceX = fromElementLeft - toElementRight;
                }

                // To element is to left but may overlap?
                if (toElementCenterX <= fromElementLeft) {
                    if (distanceX !== undefined) {
                        distanceX = Math.min(distanceX, fromElementLeft - toElementCenterX);
                    } else {
                        distanceX = fromElementLeft - toElementCenterX;
                    }
                }

                if (toElementRight <= fromElementLeft) {
                    if (distanceX !== undefined) {
                        distanceX = Math.min(distanceX, fromElementLeft - toElementRight);
                    } else {
                        distanceX = fromElementLeft - toElementRight;
                    }
                }
            } else if(direction.x > 0) {
                // Move Right
                if (fromElementRight <= toElementLeft) {
                    distanceX = toElementLeft - fromElementRight;
                }

                if (fromElementRight <= toElementCenterX) {
                    if (distanceX !== undefined) {
                        distanceX = Math.min(distanceX, toElementCenterX - fromElementRight);
                    } else {
                        distanceX = toElementCenterX - fromElementRight;
                    }
                }

                if (fromElementLeft < toElementLeft) {
                    if (distanceX !== undefined) {
                        distanceX = Math.min(distanceX, toElementLeft - fromElementLeft);
                    } else {
                        distanceX = toElementLeft - fromElementLeft;
                    }
                }
            }

            distanceY = Math.min(Math.abs(fromElementCenterY - toElementTop),
               Math.abs(fromElementCenterY - toElementCenterY),
               Math.abs(fromElementCenterY - toElementBottom)) * 2;
        } else if(direction.x === 0) {
            if(direction.y > 0) {
                // Move Up
                if (toElementBottom <= fromElementTop) {
                    distanceY = fromElementTop - toElementBottom;
                }

                if (toElementCenterY <= fromElementTop) {
                    if (distanceY !== undefined) {
                        distanceY = Math.min(distanceY, fromElementTop - toElementCenterY);
                    } else {
                        distanceY = fromElementTop - toElementCenterY;
                    }
                }

                if (toElementBottom <= fromElementTop) {
                    if (distanceY !== undefined) {
                        distanceY = Math.min(distanceY, fromElementTop - toElementBottom);
                    } else {
                        distanceY = fromElementTop - toElementBottom;
                    }
                }
            } else if(direction.y < 0) {
                // Move Down

                // Handle when the view is above the current view
                if (fromElementBottom <= toElementTop) {
                    distanceY = toElementTop - fromElementBottom;
                }

                // If the item overlaps the currebt
                if (fromElementBottom <= toElementCenterY) {
                    if (distanceY !== undefined) {
                        distanceY = Math.min(distanceY, toElementCenterY - fromElementBottom);
                    } else {
                        distanceY = toElementCenterY - fromElementBottom;
                    }
                }

                if (fromElementTop < toElementTop) {
                    if (distanceY !== undefined) {
                        distanceY = Math.min(distanceY, toElementTop - fromElementTop);
                    } else {
                        distanceY = toElementTop - fromElementTop;
                    }
                }
            }

            distanceX = Math.min(Math.abs(fromElementCenterX - toElementLeft),
               Math.abs(fromElementCenterX - toElementCenterX),
               Math.abs(fromElementCenterX - toElementRight)) * 2;
        }

        // If either distance is undefined, the toItem is in the wrong direction,
        // so forget trying to move to it.
        if (distanceX !== null && distanceY !== null) {
            toItemDistance = this.calcDistance(distanceX, distanceY);
        }

        return toItemDistance;
    }**/

    this.calcDistance = function(x, y) {
        return Math.floor(Math.sqrt((x * x) + (y * y)));
    }
}

/**
* This method will add a focusable item to the controller
* @function
* @param {FocusableItem} item Focusable item to be handled by this
* FocusController
*/
FocusController.prototype.addFocusableItem = function (item) {
    if(this.isFocusableItem(item)) {
        return;
    }

    var itemIndex = this.getFocusableItemCount();
    this.pushFocusableItem(item);

    // This is essentially the dom element of the focusable item
    var element = item.getElement();
    
    // TODO: Need to handle passing in itemIndex
    element.addEventListener('click', function(e) {
        if(this.isMoving()) {
            return;
        }

        //var itemIndex = event.data.itemIndex;
        if(this.getCurrentlyFocusedItem()) {
            this.getCurrentlyFocusedItem().onItemClick();
        }
    }.bind(this), false);
};

FocusController.prototype.updateFocusGraph = function() {
    var itemCount = this.getFocusableItemCount();
    var markerColors = [
        '#1abc9c',
        '#2ecc71',
        '#3498db',
        '#9b59b6',
        '#34495e',
        '#f1c40f',
        '#e67e22',
        '#e74c3c',
        '#ecf0f1',
        '#95a5a6'
    ];
    for(var i = 0; i < itemCount; i++) {
        var focusableItem = this.getFocusableItem(i);
        this.updateNodeEdges(i);

        var markerIndex = i % markerColors.length;
        var markerColor = markerColors[markerIndex];

        var currentItemMetrics = this.getItemMetrics(focusableItem.getElement());

        if(focusableItem.getTopFocusItemIndex() !== null) {
            var newItemMetrics = this.getItemMetrics(this.getFocusableItem(focusableItem.getTopFocusItemIndex()).getElement());
            var xDist = newItemMetrics.center.x - currentItemMetrics.center.x;
            var yDist = currentItemMetrics.top - newItemMetrics.center.y;

            var angle = ((Math.atan2(xDist, yDist) * 180) / Math.PI) + 180;

            this.printDebugLine(this.calcDistance(xDist, yDist), (currentItemMetrics.center.x-5), currentItemMetrics.top, markerColor, angle);
        }

        if(focusableItem.getBottomFocusItemIndex() !== null) {
            var newItemMetrics = this.getItemMetrics(this.getFocusableItem(focusableItem.getBottomFocusItemIndex()).getElement());
            var xDist = currentItemMetrics.center.x - newItemMetrics.center.x;
            var yDist = newItemMetrics.center.y - currentItemMetrics.bottom;

            var angle = ((Math.atan2(xDist, yDist) * 180) / Math.PI) + 360;

            this.printDebugLine(this.calcDistance(xDist, yDist), (currentItemMetrics.center.x+5), currentItemMetrics.bottom, markerColor, angle);
        }

        if(focusableItem.getLeftFocusItemIndex() !== null) {
            var newItemMetrics = this.getItemMetrics(this.getFocusableItem(focusableItem.getLeftFocusItemIndex()).getElement());
            var xDist = newItemMetrics.center.x - currentItemMetrics.left;
            var yDist = newItemMetrics.center.y - currentItemMetrics.center.y;

            var angle = ((Math.atan2(xDist, yDist) * 180) / Math.PI) + 180;

            this.printDebugLine(this.calcDistance(xDist, yDist), currentItemMetrics.left, currentItemMetrics.center.y + 5, markerColor, angle);
        }

        if(focusableItem.getRightFocusItemIndex() !== null) {
            var newItemMetrics = this.getItemMetrics(this.getFocusableItem(focusableItem.getRightFocusItemIndex()).getElement());
            var xDist = newItemMetrics.center.x - currentItemMetrics.right;
            var yDist = currentItemMetrics.center.y - newItemMetrics.center.y;

            var angle = ((Math.atan2(xDist, yDist) * 180) / Math.PI) + 180;

            this.printDebugLine(this.calcDistance(xDist, yDist), currentItemMetrics.right, currentItemMetrics.center.y - 5, markerColor, angle);
        }
    }
}

FocusController.prototype.printDebugLine = function(height, startX, startY, color, angle) {
    var dotElement = document.createElement('div');
    var dotWidth = 20;
    dotElement.classList.add('marker');
    dotElement.classList.add('start');
    dotElement.style.position = 'absolute';
    dotElement.style.width = 5+'px';
    dotElement.style.height = height+'px';
    dotElement.style.left = startX+'px';
    dotElement.style.top = startY+'px';
    dotElement.style.backgroundColor = color;
    dotElement.style['-webkit-transform'] = 'rotate('+angle+'deg)';
    dotElement.style['-webkit-transform-origin'] = '0% 0%';
    document.body.appendChild(dotElement);
}

FocusController.prototype.updateNodeEdges = function(currentIndex) {
    var currentItem = this.getFocusableItem(currentIndex);
    var currentItemMetrics = this.getItemMetrics(currentItem.getElement());

    var itemCount = this.getFocusableItemCount();
    
    var markerColors = [
        '#1abc9c',
        '#2ecc71',
        '#3498db',
        '#9b59b6',
        '#34495e',
        '#f1c40f',
        '#e67e22',
        '#e74c3c',
        '#ecf0f1',
        '#95a5a6'
    ];

    var topElementDist;
    var bottomElementDist;
    var leftElementDist;
    var rightElementDist;
    for(var i = 0; i < itemCount; i++) {
        newItem = this.getFocusableItem(i);
        if(newItem == currentItem) {
            continue;
        }

        var markerIndex = currentIndex % markerColors.length;
        var markerColor = markerColors[markerIndex];

        var newItemMetrics = this.getItemMetrics(newItem.getElement());
        var distanceTop = this.getTopDistance(currentItemMetrics, newItemMetrics);
        var distanceBottom = this.getBottomDistance(currentItemMetrics, newItemMetrics);
        var distanceLeft = this.getLeftDistance(currentItemMetrics, newItemMetrics);
        var distanceRight = this.getRightDistance(currentItemMetrics, newItemMetrics);

        if(distanceTop !== null && (typeof topElementDist === 'undefined' || topElementDist > distanceTop)) {
            topElementDist = distanceTop;

            currentItem.setTopFocusItemIndex(i);
        }

        if(distanceBottom !== null && (typeof bottomElementDist === 'undefined' || bottomElementDist > distanceBottom)) {
            bottomElementDist = distanceBottom;

            currentItem.setBottomFocusItemIndex(i);
        }

        if(distanceLeft !== null && (typeof leftElementDist === 'undefined' || leftElementDist > distanceLeft)) {
            leftElementDist = distanceLeft;

            currentItem.setLeftFocusItemIndex(i);
        }

        if(distanceRight !== null && (typeof rightElementDist === 'undefined' || rightElementDist > distanceRight)) {
            rightElementDist = distanceRight;

            currentItem.setRightFocusItemIndex(i);
        }
    }
}

FocusController.prototype.getTopDistance = function(fromMetrics, toMetrics) {
    // Move Up
    var distance = {x: null, y: null};
    
    if (toMetrics.center.y < fromMetrics.center.y) {
        distance.y = fromMetrics.top - toMetrics.center.y;
    }

    distance.x = Math.min(Math.abs(fromMetrics.center.x - toMetrics.left),
               Math.abs(fromMetrics.center.x - toMetrics.center.x),
               Math.abs(fromMetrics.center.x - toMetrics.right)) * 2;

    if(distance.x === null || distance.y === null) {
        return null;
    }

    return this.calcDistance(distance.x, distance.y);
}

FocusController.prototype.getBottomDistance = function(fromMetrics, toMetrics) {
    // Move Down
    var distance = {x: null, y: null};
    if (fromMetrics.center.y < toMetrics.center.y) {
        distance.y = toMetrics.center.y - fromMetrics.center.y;
    }

    distance.x = Math.min(Math.abs(fromMetrics.center.x - toMetrics.left),
               Math.abs(fromMetrics.center.x - toMetrics.center.x),
               Math.abs(fromMetrics.center.x - toMetrics.right)) * 2;
    
    if(distance.x === null || distance.y === null) {
        return null;
    }

    return this.calcDistance(distance.x, distance.y);
}

FocusController.prototype.getLeftDistance = function(fromMetrics, toMetrics) {
    // Move Left
    var distance = {x: null, y: null};
    if (toMetrics.center.x < fromMetrics.center.x) {
        distance.x = fromMetrics.center.x - toMetrics.center.x;
    }

    distance.y = Math.min(
                    Math.abs(fromMetrics.center.y - toMetrics.top),
                    Math.abs(fromMetrics.center.y - toMetrics.center.y),
                    Math.abs(fromMetrics.center.y - toMetrics.bottom)
                ) * 2;

    if(distance.x === null || distance.y === null) {
        return null;
    }

    return this.calcDistance(distance.x, distance.y);
}

FocusController.prototype.getRightDistance = function(fromMetrics, toMetrics) {
    // Move Right
    var distance = {x: null, y: null};

    if (fromMetrics.center.x < toMetrics.center.x) {
        distance.x = toMetrics.center.x - fromMetrics.center.x;
    }

    distance.y = Math.min(Math.abs(fromMetrics.center.y - toMetrics.top),
               Math.abs(fromMetrics.center.y - toMetrics.center.y),
               Math.abs(fromMetrics.center.y - toMetrics.bottom)) * 2;

    if(distance.x === null || distance.y === null) {
        return null;
    }

    return this.calcDistance(distance.x, distance.y);
}

FocusController.prototype.getItemMetrics = function(item) {
    var clientRect = item.getBoundingClientRect();
    var metrics = {
        width: clientRect.width,
        height: clientRect.height,
        left: clientRect.left,
        right: item.offsetLeft + clientRect.width,
        top: clientRect.top,
        bottom: item.offsetTop + clientRect.height,
        center: {
            x: clientRect.left + (clientRect.width / 2),
            y: clientRect.top + (clientRect.height / 2)
        }
    };

    return metrics;
}

/**
* On a key press this method will handle moving the focus
* @function
* @param {int} event Browser key code
*/
FocusController.prototype.onKeyDown = function (event) {
    switch(event.keyCode) {
        case 9:
            // Tab
            break;
        case 37:
            // Left
            this.moveFocus({x: -1, y: 0});
            break;
        case 38:
            // Up
            this.moveFocus({x: 0, y: 1});
            break;
        case 39:
            // Right
            this.moveFocus({x: 1, y: 0});
            break;
        case 40:
            // Down
            this.moveFocus({x: 0, y: -1});
            break;
        case 13:
            // Enter
            if(this.getCurrentlyFocusedItem()) {
                this.getCurrentlyFocusedItem().onItemClick();
            }
            break;
    }
};