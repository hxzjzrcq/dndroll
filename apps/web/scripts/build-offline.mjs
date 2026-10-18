/**
 * 把 Vite 产物内联成单个可双击打开的 dist-offline/index.html。
 * 将 <script src> 与 <link rel=stylesheet> 替换为内联内容，并移除 modulepreload。
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
let html = readFileSync(join(dist, 'index.html'), 'utf8');

html = html.replace(/<script[^>]*src="\.\/(assets\/[^"]+\.js)"[^>]*><\/script>/g, (_, src) => {
  const js = readFileSync(join(dist, src), 'utf8').replaceAll('</script', '<\\/script');
  return `<script type="module">\n${js}\n</script>`;
});

html = html.replace(/<link[^>]*href="\.\/(assets\/[^"]+\.css)"[^>]*\/?>/g, (_, href) => {
  const css = readFileSync(join(dist, href), 'utf8');
  return `<style>\n${css}\n</style>`;
});

html = html.replace(/<link rel="modulepreload"[^>]*>/g, '');

if (html.includes('src="./assets/') || html.includes('href="./assets/')) {
  throw new Error('offline inline incomplete: external asset references remain');
}

mkdirSync(join(root, 'dist-offline'), { recursive: true });
writeFileSync(join(root, 'dist-offline', 'index.html'), html);
// Unambiguous end-user entry alongside the project README.
writeFileSync(join(root, '../..', 'DNDROLL-离线版.html'), html);
console.log(`dist-offline/index.html written (${(html.length / 1024).toFixed(1)} KiB)`);
