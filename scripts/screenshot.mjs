// Headless screenshot of the sample app (and the docs app) so the agent can
// confirm the rewired site still renders the warm-editorial design.
// Usage:
//   node scripts/screenshot.mjs <base-url> <output-dir>
import puppeteer from 'puppeteer'
import { mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

const [, , baseUrl = 'http://127.0.0.1:4173', outDir = '/tmp/flux-ui-screens'] = process.argv

mkdirSync(outDir, { recursive: true })

const pages = ['/', '/approach', '/pricing']

const browser = await puppeteer.launch({ headless: 'shell' })
try {
  for (const path of pages) {
    const page = await browser.newPage()
    await page.setViewport({ width: 1280, height: 900 })
    const url = `${baseUrl}${path}`
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 })
    // Wait for fonts / entrance animations to settle.
    await new Promise((r) => setTimeout(r, 500))
    const dest = resolve(outDir, `${path === '/' ? 'home' : path.slice(1).replace(/\//g, '-')}.png`)
    await page.screenshot({ path: dest })
    const html = await page.content()
    const titles = await page.title()
    console.log(`✓ ${path} → ${dest} (title="${titles}", html=${html.length} bytes)`)
    await page.close()
  }
} finally {
  await browser.close()
}
