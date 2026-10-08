/**
 * Every photograph the site needs.
 *
 * Missing photos are generated as solid-colour stand-ins by
 * `npm run images:placeholders`, at the target dimensions. Filenames match
 * what the real photograph should be, so swapping one in is a straight
 * overwrite — no code or content change.
 *
 * This list is also what gets sent to the owner when asking for photos, via
 * the table in the README.
 */

export type ImageSpec = {
	/** Filename in src/assets/images. */
	file: string;
	/** Target pixel dimensions of the photo we want from the owner. */
	width: number;
	height: number;
	/** Palette colour used for the stand-in, so placeholders read as deliberate. */
	placeholderColour: string;
	/** What the photograph should actually show. Written for a non-developer. */
	brief: string;
	/** Where it appears. */
	usedOn: string;
};

export const IMAGE_MANIFEST: readonly ImageSpec[] = [
	{
		file: 'hero.jpg',
		width: 2400,
		height: 1600,
		placeholderColour: '#C8693F',
		brief:
			'The strongest single photo of the place — currently a sunset swim off the beach. A wide shot of the inn, or the shoreline in front of it at golden hour, would be better still. Landscape; the name sits over the bottom-left.',
		usedOn: 'Homepage hero',
	},
	{
		file: 'about.jpg',
		width: 1600,
		height: 2000,
		placeholderColour: '#E3CDAE',
		brief:
			'The inn itself — the front, the garden, a veranda, or the owners. Something that shows what kind of place it is. Portrait orientation.',
		usedOn: 'About section',
	},
	{
		file: 'room-single.jpg',
		width: 1600,
		height: 1200,
		placeholderColour: '#D9B994',
		brief: 'The single room, shot from the doorway with the bed and the window in frame. Daylight.',
		usedOn: 'Rooms section',
	},
	{
		file: 'room-double.jpg',
		width: 1600,
		height: 1200,
		placeholderColour: '#CFA77E',
		brief: 'The double room, shot from the doorway so the whole room reads in one frame. Daylight.',
		usedOn: 'Rooms section',
	},
	{
		file: 'room-four-person.jpg',
		width: 1600,
		height: 1200,
		placeholderColour: '#C4956A',
		brief: 'The four-person room, wide enough to show all the beds. Daylight.',
		usedOn: 'Rooms section',
	},
	{
		file: 'island-divers.jpg',
		width: 1600,
		height: 1200,
		placeholderColour: '#2F6E8A',
		brief:
			'One friendly underwater shot for the small Island Divers mention — currently a turtle over sand. Bright and calm suits non-divers better than deep blue.',
		usedOn: 'Island Divers mention',
	},
];

/** Looks up a spec by filename. Throws early if a content file names an unknown image. */
export function imageSpec(file: string): ImageSpec {
	const spec = IMAGE_MANIFEST.find((entry) => entry.file === file);
	if (!spec) {
		throw new Error(
			`Unknown image "${file}". Add it to IMAGE_MANIFEST in src/config/images.ts, ` +
				`then run "npm run images:placeholders".`,
		);
	}
	return spec;
}
