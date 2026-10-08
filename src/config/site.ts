/**
 * Every piece of site-wide data lives here. Nothing in this file should ever
 * need a component edit to change.
 *
 * Values carrying the TODO prefix are placeholders awaiting confirmation from
 * the owner. A production build refuses to run while any remain.
 */

export const SITE = {
	name: 'Hibiscus Coral Inn',
	tagline: 'A small inn on Bantayan Island',
	/** The line under the name in the hero. */
	lede: 'A handful of quiet rooms, a short walk from the water.',
	/** Canonical origin, no trailing slash. Set before launch. */
	url: 'TODO_SITE_URL',
	locale: 'en',
	region: 'PH',
	description:
		'A small, owner-run inn on Bantayan Island, Cebu. Simple, quiet rooms a short walk from the beach — slow days, sunsets, and a long way from the crowds.',
	/** Geo-targeting for search. */
	place: {
		island: 'Bantayan Island',
		province: 'Cebu',
		country: 'Philippines',
		/** The pin of the Google Maps listing in CONTACT.mapsEmbedUrl. */
		latitude: '11.152634',
		longitude: '123.803262',
	},
} as const;

/**
 * The owners' dive centre. It is a separate business and will get its own
 * site; until then this site mentions it once and links out.
 */
export const DIVE_CENTRE = {
	name: 'Island Divers',
	/** Google Maps listing, which carries the dive centre's reviews. */
	url: 'https://maps.app.goo.gl/c6YD1M7N8WPJANvx8',
	/** Shown beside the link. Update when the review count moves. */
	rating: '4.9 on Google',
} as const;

/** Digits only for WhatsApp, no `+`. */
export const CONTACT = {
	whatsapp: '639773284208',
	email: 'TODO_EMAIL',
	address: 'TODO_ADDRESS',
	/** Opens Google Maps (or the app) at the inn's coordinates. */
	mapsUrl: 'https://www.google.com/maps/search/?api=1&query=11.152634%2C123.803262',
	/**
	 * Google Maps "Embed a map" URL for the inn's listing, satellite view.
	 * The `!1sen!2sph` pair sets English UI for the Philippines — Google
	 * fills in the browser's own language when you copy the code, so check
	 * it if this is ever replaced. Only loaded when a visitor asks for it;
	 * see LocationMap.astro.
	 */
	mapsEmbedUrl:
		'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1132.546384756392!2d123.80371689277882!3d11.152553102023319!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a863218d2bd3b7%3A0xfe2f9a1a27e6baa6!2sHibiscus%20Dive%20Inn!5e1!3m2!1sen!2sph!4v1791202501817!5m2!1sen!2sph',
	facebook: 'TODO_FACEBOOK_URL',
	instagram: 'TODO_INSTAGRAM_URL',
} as const;

/**
 * Cloudflare Web Analytics is cookieless, so no consent banner is needed.
 * The script is only injected once a real token is set — until then the site
 * ships with zero third-party JavaScript.
 */
export const ANALYTICS = {
	cloudflareToken: 'TODO_CLOUDFLARE_ANALYTICS_TOKEN',
} as const;

/**
 * The prefilled WhatsApp message.
 *
 * The point is that the owner receives a structured enquiry rather than
 * "hi is it free?". "Arriving from" is there because getting to Bantayan
 * depends on the last bus and ferry — it lets the owner say straight away
 * whether a guest can get across the same day.
 */
export const ENQUIRY_TEMPLATE = [
	`Hi ${SITE.name}! I'd like to ask about a stay.`,
	'',
	'Dates:',
	'Guests:',
	'Arriving from:',
].join('\n');
