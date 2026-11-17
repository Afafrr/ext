import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifestVersion: 3,
  manifest: {
    name: 'Bookmark Organizer',
    description: 'Detect newly saved Chrome bookmarks. Activity stays on your device.',
    minimum_chrome_version: '102',
    permissions: ['bookmarks', 'storage'],
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
});
