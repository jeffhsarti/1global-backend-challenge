import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'dist',
  target: 'es2020',
  format: ['cjs'],
  sourcemap: true,
  clean: true,
  dts: false,
  tsconfig: './tsconfig.json',
});
