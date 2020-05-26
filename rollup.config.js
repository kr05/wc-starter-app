import { createDefaultConfig } from '@open-wc/building-rollup';
import copy from 'rollup-plugin-copy';
import workbox from 'rollup-plugin-workbox';

// if you need to support IE11 use "modern-and-legacy-config" instead.
// import { createCompatibilityConfig } from '@open-wc/building-rollup';
// export default createCompatibilityConfig({ input: './index.html' });

const config = createDefaultConfig({ input: './index.html' });

export default {
  ...config,
  output: {
      ...config.output,
      dir: 'server/build'
  },
  plugins: [
    ...config.plugins,
    copy({
      targets: [
        { src: 'manifest.json', dest: 'server/build' },
        { src: 'images/**/*', dest: 'server/build/images' }
      ]
    }),
    workbox({
      /** @type {'generateSW'|'injectManifest'} default 'generateSW' */
      mode: 'injectManifest',
      /** @type {Function} default fancy render */
      render: ({ swDest, count, size }) => console.log(
        '📦', swDest,
        '#️⃣', count,
        '🐘', size,
      )
    })
  ]
};