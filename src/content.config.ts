import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Content collections.
 *
 * Every schema is strict so a malformed edit fails the build rather than
 * shipping broken. Fields that are not yet confirmed by the owner are typed as
 * plain strings so they can hold a `TODO_` placeholder — the placeholder guard,
 * not Zod, is what stops those reaching production.
 */

/** A value awaiting confirmation, e.g. `TODO_RATE_DOUBLE` or a real figure. */
const unconfirmed = z.string().min(1);

/** Filename of a photo in src/assets/images, e.g. `room-double.jpg`. */
const imageFile = z.string().regex(/^[a-z0-9-]+\.(jpg|png|webp)$/, {
	message: 'Use a lowercase, hyphenated filename with an extension, e.g. room-double.jpg',
});

const rooms = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/rooms' }),
	schema: z.object({
		title: z.string(),
		/** Display order in the rooms section. Lower is first. */
		order: z.number().int(),
		/** How many people the room sleeps. Confirmed: rooms are 1, 2 and 4 person. */
		sleeps: z.number().int().positive(),
		/** One or two sentences on the card. */
		summary: z.string().max(240),
		/** Indicative nightly rate. Placeholder until the owner confirms. */
		rate: unconfirmed,
		/** Qualifier shown beside the rate, e.g. "per night, two sharing". */
		rateNote: z.string().optional(),
		features: z.array(z.string()).default([]),
		image: imageFile,
		imageAlt: z.string().min(1),
		draft: z.boolean().default(false),
	}),
});

/** One leg of the journey to the inn. Durations and fares are unconfirmed. */
const journeyLeg = z.object({
	from: z.string(),
	to: z.string(),
	/** e.g. "Bus, direct". */
	mode: z.string(),
	duration: unconfirmed,
	cost: unconfirmed,
	note: z.string().optional(),
});

/**
 * One file per homepage section. Headings and body copy all live here, so
 * changing any of it is a one-file edit.
 */
const pages = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
	schema: z.object({
		title: z.string(),
		/** Optional short lead-in shown above the body copy. */
		intro: z.string().optional(),
		image: imageFile.optional(),
		imageAlt: z.string().optional(),
		/** Link label, where a section links somewhere. */
		linkLabel: z.string().optional(),
		/** getting-here.md only. Every leg must be confirmed with the owner. */
		legs: z.array(journeyLeg).optional(),
		/** getting-here.md only. Times change with the season. */
		schedules: z.array(z.object({ label: z.string(), value: unconfirmed })).optional(),
	}),
});

export const collections = { rooms, pages };
