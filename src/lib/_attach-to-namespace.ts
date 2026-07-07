// Copyright 2013 Google Inc. All Rights Reserved.
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

type Namespace = Record<string, unknown>;

// Consumers load dpad-controller.js and debug-controller.js as separate
// <script> tags and expect both to land on the same window.gauntface.dpad
// namespace (see README "Using the library via CDN"). Each bundle calls this
// with its own exports so the second script to load merges into the
// namespace instead of replacing it.
export function attachToNamespace(path: string, exports: Namespace): void {
  const parts = path.split('.');
  let ref = window as unknown as Namespace;
  for (const part of parts.slice(0, -1)) {
    ref[part] = ref[part] || {};
    ref = ref[part] as Namespace;
  }
  const last = parts[parts.length - 1];
  ref[last] = Object.assign((ref[last] as Namespace) || {}, exports);
}
