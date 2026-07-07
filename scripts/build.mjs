import {execFileSync} from 'node:child_process';
import {rmSync} from 'node:fs';
import * as esbuild from 'esbuild';

const BUILD_DIR = 'build';

function clean() {
  rmSync(BUILD_DIR, {recursive: true, force: true});
}

function buildNodeLib() {
  execFileSync('npx', ['tsc', '-p', 'tsconfig.node-lib.json'], {stdio: 'inherit'});
}

async function buildBrowserLib() {
  // These entry points (rather than src/lib/*.ts directly) are what call
  // attachToNamespace, so dpad-controller.js and debug-controller.js merge
  // onto the same window.gauntface.dpad namespace when loaded as separate
  // <script> tags (see README "Using the library via CDN") instead of the
  // second script clobbering the first.
  const entries = [
    {entry: 'src/browser/dpad-controller.ts', outfile: `${BUILD_DIR}/browser/dpad-controller.js`},
    {entry: 'src/browser/debug-controller.ts', outfile: `${BUILD_DIR}/browser/debug-controller.js`},
  ];

  for (const {entry, outfile} of entries) {
    await esbuild.build({
      entryPoints: [entry],
      bundle: true,
      format: 'iife',
      outfile,
    });
  }
}

async function buildBrowserHelper() {
  // Preserves the historical build/helper/helper/*.js layout (an artifact of
  // the old gulp config) since that's the path published npm/CDN consumers
  // already reference in the README.
  const entries = [
    {entry: 'src/helper/dpad.ts', outfile: `${BUILD_DIR}/helper/helper/dpad.js`},
    {entry: 'src/helper/dpad-debugger.ts', outfile: `${BUILD_DIR}/helper/helper/dpad-debugger.js`},
  ];

  for (const {entry, outfile} of entries) {
    await esbuild.build({
      entryPoints: [entry],
      bundle: true,
      format: 'iife',
      outfile,
    });
  }
}

async function main() {
  clean();
  buildNodeLib();
  await buildBrowserLib();
  await buildBrowserHelper();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
