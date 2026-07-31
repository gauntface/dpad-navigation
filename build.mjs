import {rmSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import * as path from 'node:path';
import * as esbuild from 'esbuild';

rmSync('build', {recursive: true, force: true});

execFileSync('npx', ['tsc', '-p', 'tsconfig.json'], {stdio: 'inherit'});

// Each of these is loaded as an independent <script> tag (per the README), so
// they need to merge their exports into window.gauntface.dpad rather than
// overwrite it. esbuild's dotted globalName only guards the top-level var,
// not nested properties, so merge into the namespace ourselves via a footer.
for (const entry of ['src/lib/dpad-controller.ts', 'src/lib/debug-controller.ts']) {
  const name = path.basename(entry, '.ts');
  await esbuild.build({
    entryPoints: [entry],
    outfile: `build/browser/${name}.js`,
    bundle: true,
    format: 'iife',
    globalName: '__dpadBundleExports',
    target: 'es2019',
    footer: {
      js: 'window.gauntface = window.gauntface || {};\n' +
        'window.gauntface.dpad = Object.assign(window.gauntface.dpad || {}, __dpadBundleExports);',
    },
  });
}

await esbuild.build({
  entryPoints: [
    'src/helper/dpad.ts',
    'src/helper/dpad-debugger.ts',
  ],
  outdir: 'build/helper/helper',
  bundle: true,
  format: 'iife',
  target: 'es2019',
});
