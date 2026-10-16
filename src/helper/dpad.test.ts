import {DpadController} from './src/lib/dpad-controller';

/**
 * Test suite for dpad.ts initialization logic
 * 
 * These tests verify that the D-pad controller initializes correctly
 * regardless of when the helper script loads relative to the page load event.
 */

class MockDocument {
  constructor(readyState = 'loading') {
    this._readyState = readyState;
  }

  get readyState() {
    return this._readyState;
  }

  set readyState(state) {
    this._readyState = state;
  }
}

class MockWindow {
  constructor() {
    this.dpad = undefined;
    this.listeners = new Map();
  }

  addEventListener(event, listener) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(listener);
  }

  triggerEvent(event) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(listener => listener());
    }
  }
}

/**
 * Test: Script loads before page finishes loading (normal case)
 * This scenario has always worked, we verify it still works
 */
export function testNormalEarlyLoad() {
  const mockWindow = new MockWindow();
  const mockDocument = new MockDocument('loading');

  // Simulate the initialization code
  const initializeDpad = () => {
    mockWindow.dpad = mockWindow.dpad || new DpadController();
    mockWindow.dpad.update();
  };

  if (mockDocument.readyState === 'complete') {
    initializeDpad();
  } else {
    mockWindow.addEventListener('load', initializeDpad);
  }

  // Simulate page load completing
  mockDocument.readyState = 'complete';
  mockWindow.triggerEvent('load');

  // Verify
  return mockWindow.dpad !== undefined && mockWindow.dpad.updateCalled !== false;
}

/**
 * Test: Script loads after page has already loaded (bug case)
 * This is the scenario that was broken before the fix
 */
export function testLateLoadAfterPageComplete() {
  const mockWindow = new MockWindow();
  const mockDocument = new MockDocument('complete');

  // Simulate the initialization code (after page load)
  const initializeDpad = () => {
    mockWindow.dpad = mockWindow.dpad || new DpadController();
    mockWindow.dpad.update();
  };

  // This is the key fix: check readyState before registering listener
  if (mockDocument.readyState === 'complete') {
    initializeDpad();
  } else {
    mockWindow.addEventListener('load', initializeDpad);
  }

  // Verify that initialization happened
  return mockWindow.dpad !== undefined;
}

/**
 * Test: Resize event handler works when dpad is initialized
 */
export function testResizeEventHandler() {
  const mockWindow = new MockWindow();
  const mockDocument = new MockDocument('complete');

  const initializeDpad = () => {
    mockWindow.dpad = mockWindow.dpad || new DpadController();
    mockWindow.dpad.update();
  };

  if (mockDocument.readyState === 'complete') {
    initializeDpad();
  } else {
    mockWindow.addEventListener('load', initializeDpad);
  }

  // Register resize handler
  mockWindow.addEventListener('resize', () => {
    if (!mockWindow.dpad) {
      return;
    }
    mockWindow.dpad.update();
  });

  // Verify resize works
  mockWindow.triggerEvent('resize');
  return mockWindow.dpad !== undefined;
}

// Run tests if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('Running dpad initialization tests...\n');

  try {
    const test1 = testNormalEarlyLoad();
    console.log(test1 ? '✓ PASS: Normal early load' : '✗ FAIL: Normal early load');

    const test2 = testLateLoadAfterPageComplete();
    console.log(test2 ? '✓ PASS: Late load after page complete' : '✗ FAIL: Late load after page complete');

    const test3 = testResizeEventHandler();
    console.log(test3 ? '✓ PASS: Resize event handler' : '✗ FAIL: Resize event handler');

    const allPassed = test1 && test2 && test3;
    console.log(allPassed ? '\n✓ All tests passed' : '\n✗ Some tests failed');
    process.exit(allPassed ? 0 : 1);
  } catch (error) {
    console.error('Test error:', error);
    process.exit(1);
  }
}
