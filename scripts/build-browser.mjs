import { build } from 'esbuild';
await build({entryPoints:['packages/core/src/index.ts'],bundle:true,platform:'browser',format:'iife',globalName:'DndRoll',target:'es2022',outfile:'packages/core/dist/dndroll.browser.js',sourcemap:true});
console.log('Built ESM, TypeScript declarations, and standalone browser bundle.');
