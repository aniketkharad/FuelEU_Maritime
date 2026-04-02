import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        include: ['src/**/*.test.ts'],
        exclude: ['src/**/*.integration.test.ts'],
    },
    resolve: {
        alias: {
            '@core': path.resolve(__dirname, 'src/core'),
            '@adapters': path.resolve(__dirname, 'src/adapters'),
            '@shared': path.resolve(__dirname, 'src/shared'),
            '@infrastructure': path.resolve(__dirname, 'src/infrastructure'),
        },
    },
});
