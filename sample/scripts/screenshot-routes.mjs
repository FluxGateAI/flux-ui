import puppeteer from 'puppeteer'
import { mkdirSync } from 'node:fs'
mkdirSync('/tmp/flux-ui-screens', { recursive: true })

const browser = await puppeteer.launch({ headless: 'shell' })
const pages = ['/', '/approach', '/pricing', '/try', '/showcase']
for (const path of pages) {
  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 900 })
  await page.goto('http://127.0.0.1:4173' + path, { waitUntil: 'networkidle0', timeout: 15000 })
  await new Promise(r => setTimeout(r, 800))
  const name = 'ember' + (path === '/' ? '-landing' : path.replace(/\//g, '-')) + '.png'
  await page.screenshot({ path: '/tmp/flux-ui-screens/' + name })
  console.log('✓ ' + path + ' → ' + name + ' (title=' + (await page.title()) + ')')
  await page.close()
}
await browser.close()
