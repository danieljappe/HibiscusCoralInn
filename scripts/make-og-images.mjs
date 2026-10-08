/**
 * Generates the Open Graph / Twitter card image from the hero photograph:
 * a 1200x630 crop with the inn's name set over a darkened lower edge.
 *
 * Re-run after replacing src/assets/images/hero.jpg. The output is always
 * overwritten, so the card never drifts from the hero.
 *
 * Run with `npm run images:og`.
 */

import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const OUT = join(ROOT, 'public');
mkdirSync(OUT, { recursive: true });

const WIDTH = 1200;
const HEIGHT = 630;

const escape = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/*
 * System fonts rather than the site's own: this is rasterised once here, so
 * requiring Fraunces to be installed on the machine would be a trap.
 */
const overlay = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
	<defs>
		<linearGradient id="scrim" x1="0" y1="1" x2="0" y2="0">
			<stop offset="0" stop-color="#1e100c" stop-opacity="0.85"/>
			<stop offset="0.55" stop-color="#1e100c" stop-opacity="0.2"/>
			<stop offset="1" stop-color="#1e100c" stop-opacity="0"/>
		</linearGradient>
	</defs>
	<rect width="${WIDTH}" height="${HEIGHT}" fill="url(#scrim)"/>
	<text x="72" y="500" font-family="Georgia, 'Times New Roman', serif" font-size="80"
		fill="#ffffff">${escape('Hibiscus Coral Inn')}</text>
	<text x="74" y="560" font-family="Helvetica, Arial, sans-serif" font-size="30"
		fill="#f8eee3">${escape('Rooms on Bantayan Island · Cebu · Philippines')}</text>
</svg>`;

await sharp(join(ROOT, 'src/assets/images/hero.jpg'))
	.rotate()
	.resize(WIDTH, HEIGHT, { fit: 'cover', position: 'attention' })
	.composite([{ input: Buffer.from(overlay) }])
	.jpeg({ quality: 82, mozjpeg: true })
	.toFile(join(OUT, 'og-default.jpg'));

console.log('  created  public/og-default.jpg  1200x630');
