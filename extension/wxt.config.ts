import { defineConfig } from 'wxt';
import { readdir } from 'node:fs/promises';
import { resolve } from 'node:path';

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifestVersion: 3,
  manifest: {
    name: 'Bookmark Organizer',
    description: 'Detect newly saved Chrome bookmarks. Activity stays on your device.',
    minimum_chrome_version: '127',
    permissions: ['bookmarks', 'storage', 'offscreen', 'unlimitedStorage'],
    host_permissions: ['https://huggingface.co/*', 'https://*.hf.co/*', 'https://*.huggingface.co/*'],
    optional_permissions: ['scripting'],
    optional_host_permissions: ['http://*/*', 'https://*/*'],
    content_security_policy: {
      extension_pages: "script-src 'self' 'wasm-unsafe-eval'; object-src 'none'; worker-src 'self'; connect-src 'self' https://huggingface.co https://*.hf.co https://*.huggingface.co",
    },
    icons: {
      16: 'icons/16.png',
      32: 'icons/32.png',
      48: 'icons/48.png',
      128: 'icons/128.png',
    },
    action: {
      default_title: 'Bookmark Organizer — recent saves',
      default_icon: {
        16: 'icons/16.png',
        32: 'icons/32.png',
        48: 'icons/48.png',
      },
    },
  },
  vite: () => ({
    resolve: { conditions: ['onnxruntime-web-use-extern-wasm'] },
    build: { target: 'chrome127' },
  }),
  hooks: {
    async 'build:publicAssets'(_wxt, files) {
      for (const name of await readdir('node_modules/onnxruntime-web/dist')) {
        if (name.startsWith('ort-wasm') && /\.(mjs|wasm)$/.test(name)) {
          files.push({ absoluteSrc: resolve('node_modules/onnxruntime-web/dist', name), relativeDest: `vendor/${name}` });
        }
      }
      files.push({ absoluteSrc: resolve('node_modules/@huggingface/transformers/LICENSE'), relativeDest: 'TRANSFORMERS-LICENSE' });
    },
  },
});
