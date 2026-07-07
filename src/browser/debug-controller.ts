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

// Browser <script>-tag entry point for build/browser/debug-controller.js.
// Kept separate from src/lib/debug-controller.ts (which is also the source
// for the Node CJS build and must not touch `window`).
import {attachToNamespace} from '../lib/_attach-to-namespace';
import {DebugController} from '../lib/debug-controller';

attachToNamespace('gauntface.dpad', {DebugController});
