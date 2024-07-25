import * as path from 'node:path';
import { defineConfig } from 'rspress/config';

export default defineConfig({
  root: path.join(__dirname, 'doc'),
  themeConfig: {
    footer: {
      message: '<a>Custom footer</a>',
    },
  },
});
