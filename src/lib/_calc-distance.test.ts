/**
 * Test suite for calcDistance function
 * Verifies that precision loss bug is fixed and that distance calculations
 * correctly distinguish between close elements.
 */

import { calcDistance } from './_calc-distance';

// Test result tracking
let testsPassed = 0;
let testsFailed = 0;

// Helper function for assertions
function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`✓ ${message}`);
    testsPassed++;
  } else {
    console.log(`✗ ${message}`);
    testsFailed++;
  }
}

function assertClose(value: number, expected: number, tolerance: number, message: string) {
  const isClose = Math.abs(value - expected) < tolerance;
  assert(isClose, `${message} (got ${value.toFixed(4)}, expected ${expected.toFixed(4)})`);
}

console.log('=========================================');
console.log('calcDistance Function Test Suite');
console.log('=========================================\n');

// Test 1: Basic 3-4-5 triangle
console.log('Test Group 1: Basic Euclidean Distance');
const dist345 = calcDistance(3, 4);
assertClose(dist345, 5, 0.0001, 'calcDistance(3, 4) should be 5');

// Test 2: Negative coordinates should work the same
const distNeg = calcDistance(-3, -4);
assertClose(distNeg, 5, 0.0001, 'calcDistance(-3, -4) should be 5');

// Test 3: Zero distance
const distZero = calcDistance(0, 0);
assertClose(distZero, 0, 0.0001, 'calcDistance(0, 0) should be 0');

console.log('\nTest Group 2: Sub-pixel Precision (Critical for Bug Fix)');

// Test 4: Elements at distances that used to floor to the same value
// This is the CORE of the bug fix
const dist10_1 = calcDistance(0, 10.1);
const dist10_9 = calcDistance(0, 10.9);

assertClose(dist10_1, 10.1, 0.0001, 'calcDistance(0, 10.1) should return 10.1 (not 10)');
assertClose(dist10_9, 10.9, 0.0001, 'calcDistance(0, 10.9) should return 10.9 (not 10)');

// Verify they are distinguishable
assert(dist10_1 !== dist10_9, 'calcDistance should distinguish 10.1 from 10.9');
assert(dist10_1 < dist10_9, '10.1 should be less than 10.9');

console.log('\nTest Group 3: Floating Point Accuracy');

// Test 5: Various floating point combinations
const dist5_5_7_2 = calcDistance(5.5, 7.2);
const expected5_5_7_2 = Math.sqrt(5.5 * 5.5 + 7.2 * 7.2);
assertClose(dist5_5_7_2, expected5_5_7_2, 0.0001, 'calcDistance(5.5, 7.2) returns correct value');

// Test 6: Very small sub-pixel differences
const dist1_01 = calcDistance(0, 1.01);
const dist1_02 = calcDistance(0, 1.02);
assert(dist1_01 < dist1_02, 'calcDistance should distinguish 1.01 from 1.02 pixels');
assert(dist1_02 - dist1_01 > 0.001, 'Difference between 1.01 and 1.02 should be preserved');

console.log('\nTest Group 4: Neighbor Selection Logic');

// Simulate the actual neighbor selection logic from dpad-controller.ts
function selectClosestNeighbor(
  candidates: Array<{ name: string; distance: number }>
): { index: number; distance: number } {
  let minDist: number | undefined;
  let selectedIndex = -1;

  candidates.forEach((candidate, index) => {
    if (typeof minDist === 'undefined' || minDist > candidate.distance) {
      minDist = candidate.distance;
      selectedIndex = index;
    }
  });

  return { index: selectedIndex, distance: minDist! };
}

// Test 7: The actual bug scenario
const candidates = [
  { name: 'Element A (farther)', distance: calcDistance(0, 10.9) },  // 10.9
  { name: 'Element B (closer)', distance: calcDistance(0, 10.1) },   // 10.1
];

const selected = selectClosestNeighbor(candidates);
assert(
  selected.index === 1,
  'Neighbor selection correctly chooses Element B (index 1) as it has distance 10.1'
);
assert(
  selected.distance === candidates[1].distance,
  'Selected distance should be 10.1, not 10.9'
);

console.log('\nTest Group 5: Edge Cases');

// Test 8: Very large coordinates
const distLarge = calcDistance(10000, 10000);
const expectedLarge = Math.sqrt(10000 * 10000 + 10000 * 10000);
assertClose(distLarge, expectedLarge, 0.01, 'calcDistance works with large numbers');

// Test 9: Very small coordinates
const distSmall = calcDistance(0.001, 0.002);
const expectedSmall = Math.sqrt(0.001 * 0.001 + 0.002 * 0.002);
assertClose(distSmall, expectedSmall, 0.000001, 'calcDistance works with very small numbers');

console.log('\n=========================================');
console.log(`Results: ${testsPassed} passed, ${testsFailed} failed`);
console.log('=========================================');

if (testsFailed > 0) {
  process.exit(1);
}
