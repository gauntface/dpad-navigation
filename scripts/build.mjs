import {execFileSync} from 'node:child_process';
import {rmSync} from 'node:fs';
import * as esbuild from 'esbuild';

const BUILD_DIR = 'build';

// Browser <script> consumers load dpad-controller.js and debug-controller.js
// as separate tags and expect both to land on the same window.gauntface.dpad
// namespace (see README "Using the library via CDN"). esbuild's globalName
// assigns the whole namespace per-bundle, which would make the second script
// clobber the first, so each bundle instead exports to a private temp var and
// a footer merges that into the shared namespace.
function namespaceMergeFooter(exportsVar, namespacePath) {
  const parts = namespacePath.split('.');
  let footer = '';
  let ref = 'window';
  for (const part of parts) {
    footer += `${ref}.${part} = ${ref}.${part} || {};\n`;
    ref += `.${part}`;
  }
  footer += `Object.assign(${ref}, ${exportsVar});\ndelete window.${exportsVar};\n`;
  return footer;
}

function clean() {
  rmSync(BUILD_DIR, {recursive: true, force: true});
}

function buildNodeLib() {
  execFileSync('npx', ['tsc', '-p', 'tsconfig.node-lib.json'], {stdio: 'inherit'});
}

async function buildBrowserLib() {
  const entries = [
    {entry: 'src/lib/dpad-controller.ts', outfile: `${BUILD_DIR}/browser/dpad-controller.js`, exportsVar: '__dpadControllerExports'},
    {entry: 'src/lib/debug-controller.ts', outfile: `${BUILD_DIR}/browser/debug-controller.js`, exportsVar: '__debugControllerExports'},
  ];

  for (const {entry, outfile, exportsVar} of entries) {
    await esbuild.build({
      entryPoints: [entry],
      bundle: true,
      format: 'iife',
      globalName: exportsVar,
      outfile,
      footer: {js: namespaceMergeFooter(exportsVar, 'gauntface.dpad')},
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
