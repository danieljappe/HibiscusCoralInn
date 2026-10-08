/**
 * Verifies every foreground/background pairing the site actually uses against
 * WCAG 2.1 AA. Mirrors src/styles/tokens.css — keep the two in step. Sun
 * yellow is the trap here: lovely as a fill, unusable as text on a light tone.
 *
 * Run with `npm run check:contrast`.
 */

const PALETTE = {
	ink: '#2A1E19',
	'ink-soft': '#5C4A40',
	sea: '#1B5873',
	hibiscus: '#B3302A',
	'hibiscus-deep': '#962520',
	sun: '#E9A23B',
	'sun-pale': '#F5C46A',
	white: '#FFFFFF',
	linen: '#FBF6EE',
	'linen-raised': '#FFFDF9',
	sand: '#F5EBDA',
	'sand-raised': '#FFFBF4',
	warm: '#EFDDC4',
	'warm-raised': '#FBF3E7',
	ochre: '#E8C9A4',
	'ochre-raised': '#F6E6D0',
	plum: '#2C2134',
	'plum-raised': '#3A2C43',
	'plum-fg': '#F8EEE3',
	'plum-fg-soft': '#D4C3CF',
};

/** The four light tones, each with its raised (card) surface. */
const LIGHT_SURFACES = [
	'linen',
	'linen-raised',
	'sand',
	'sand-raised',
	'warm',
	'warm-raised',
	'ochre',
	'ochre-raised',
];

/** Text pairings: [foreground, background, label, minimum ratio] */
const PAIRS = [
	// --- light tones: every surface gets body, muted, link and focus ---
	...LIGHT_SURFACES.flatMap((bg) => [
		['ink', bg, 'body text', 4.5],
		['ink-soft', bg, 'muted text', 4.5],
		['sea', bg, 'links', 4.5],
		['ink', bg, 'focus ring', 3],
	]),
	['white', 'hibiscus', 'CTA label on hibiscus fill', 4.5],
	['white', 'hibiscus-deep', 'CTA label, hovered', 4.5],

	// --- plum (contact and footer) ---
	['plum-fg', 'plum', 'body text', 4.5],
	['plum-fg-soft', 'plum', 'muted text', 4.5],
	['plum-fg-soft', 'plum-raised', 'muted text on raised', 4.5],
	['sun-pale', 'plum', 'links', 4.5],
	['sun-pale', 'plum', 'focus ring', 3],
	['plum', 'sun-pale', 'CTA label on sun fill', 4.5],
	['plum', 'sun', 'CTA label, hovered', 4.5],
];

const DECORATIVE = [];

/** Pairings that must NOT be used. Guards against regressions. */
const FORBIDDEN = [
	['sun', 'linen', 'sun yellow as text on a light tone'],
	['hibiscus', 'plum', 'hibiscus red as text on plum'],
];

function toLinear(channel) {
	const c = channel / 255;
	return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function luminance(hex) {
	const value = hex.replace('#', '');
	const [r, g, b] = [0, 2, 4].map((i) => parseInt(value.slice(i, i + 2), 16));
	return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function contrast(a, b) {
	const [x, y] = [luminance(PALETTE[a]), luminance(PALETTE[b])].sort((m, n) => n - m);
	return (x + 0.05) / (y + 0.05);
}

let failures = 0;
console.log('\n  Contrast audit — WCAG 2.1\n');

for (const [fg, bg, label, min] of PAIRS) {
	const ratio = contrast(fg, bg);
	const pass = ratio >= min;
	if (!pass) failures++;
	const mark = pass ? '  ok ' : 'FAIL';
	console.log(
		`  ${mark}  ${ratio.toFixed(2).padStart(5)}:1  (min ${min})  ${fg} on ${bg} — ${label}`,
	);
}

console.log('');
for (const [fg, bg, label] of DECORATIVE) {
	const ratio = contrast(fg, bg);
	console.log(`  deco  ${ratio.toFixed(2).padStart(5)}:1  (n/a)      ${fg} on ${bg} — ${label}`);
}

console.log('');
for (const [fg, bg, why] of FORBIDDEN) {
	const ratio = contrast(fg, bg);
	console.log(`  note  ${ratio.toFixed(2).padStart(5)}:1  ${fg} on ${bg} — forbidden: ${why}`);
	if (ratio >= 4.5) {
		console.log('        ^ this pairing now passes; the note above is stale.');
	}
}

if (failures > 0) {
	console.error(`\n  ${failures} pairing(s) below the minimum.\n`);
	process.exit(1);
}
console.log(`\n  All ${PAIRS.length} pairings pass.\n`);
