import { basename, resolve } from 'node:path'
import { promises as fs } from 'node:fs'
import { fileURLToPath } from 'node:url'
import fg from 'fast-glob'

async function run() {
  const __dirname = fileURLToPath(new URL('.', import.meta.url))
  // fix cjs exports
  const files = await fg('*.cjs', {
    ignore: ['index.cjs', 'chunk-*', 'types.cjs', 'loaders.cjs'],
    absolute: true,
    cwd: resolve(__dirname, '../dist'),
  })
  for (const file of files) {
    console.log('[postbuild]', basename(file))
    let code = await fs.readFile(file, 'utf8')
    code = code.replace('exports.default =', 'module.exports =')
    code += 'exports.default = module.exports;'
    await fs.writeFile(file, code)
  }
}

run()
