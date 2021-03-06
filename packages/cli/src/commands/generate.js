import parseArgs from 'minimist'
import consola from 'consola'

import { loadNuxtConfig } from '../common/utils'

export default async function generate() {
  const { Nuxt } = await import('@nuxt/core')
  const { Builder, Generator } = await import('@nuxt/builder')

  const argv = parseArgs(process.argv.slice(2), {
    alias: {
      h: 'help',
      c: 'config-file',
      s: 'spa',
      u: 'universal'
    },
    boolean: ['h', 's', 'u', 'build'],
    string: ['c'],
    default: {
      c: 'nuxt.config.js',
      build: true
    }
  })

  if (argv.help) {
    process.stderr.write(`
    Description
      Generate a static web application (server-rendered)
    Usage
      $ nuxt generate <dir>
    Options
      --spa              Launch in SPA mode
      --universal        Launch in Universal mode (default)
      --config-file, -c  Path to Nuxt.js config file (default: nuxt.config.js)
      --help, -h         Displays this message
      --no-build         Just run generate for faster builds when just dynamic routes changed. Nuxt build is needed before this command.
  `)
    process.exit(0)
  }

  const options = await loadNuxtConfig(argv)

  options.dev = false // Force production mode (no webpack middleware called)

  const nuxt = new Nuxt(options)
  const builder = new Builder(nuxt)
  const generator = new Generator(nuxt, builder)

  const generateOptions = {
    init: true,
    build: argv.build
  }

  return generator
    .generate(generateOptions)
    .then(() => {
      process.exit(0)
    })
    .catch(err => consola.fatal(err))
}
