const esbuild = require('esbuild')

const setup = async () => {
    await esbuild.build({
        entryPoints: ['./src/index.ts'],
        bundle: true,
        platform: 'node',
        outdir: 'dist/',
    })
}

setup()