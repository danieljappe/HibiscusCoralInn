import { SITE, CONTACT } from '../config/site';
import { isPlaceholder } from './placeholders';

/**
 * Structured data.
 *
 * Search is how most guests will find the inn, so this is treated as a
 * feature rather than a chore. Unconfirmed values are omitted rather than
 * emitted as `TODO_` strings — publishing a placeholder as though it were data
 * is worse than publishing nothing, and a production build cannot ship
 * placeholders anyway.
 */

/** Drops keys whose values are undefined, null, empty, or still placeholders. */
function clean<T extends Record<string, unknown>>(input: T): Partial<T> {
	return Object.fromEntries(
		Object.entries(input).filter(([, value]) => {
			if (value === undefined || value === null) return false;
			if (typeof value === 'string') return value.length > 0 && !isPlaceholder(value);
			if (Array.isArray(value)) return value.length > 0;
			return true;
		}),
	) as Partial<T>;
}

const absolute = (path: string, site: URL | undefined) =>
	site ? new URL(path, site).href : undefined;

function address() {
	return clean({
		'@type': 'PostalAddress',
		streetAddress: CONTACT.address,
		addressLocality: SITE.place.island,
		addressRegion: SITE.place.province,
		addressCountry: 'PH',
	});
}

function geo() {
	if (isPlaceholder(SITE.place.latitude) || isPlaceholder(SITE.place.longitude)) return undefined;
	return {
		'@type': 'GeoCoordinates',
		latitude: SITE.place.latitude,
		longitude: SITE.place.longitude,
	};
}

/** The inn itself, with each room type as an Accommodation. */
export function lodgingBusinessSchema(options: {
	site: URL | undefined;
	ogImage: string;
	rooms: { title: string; sleeps: number }[];
}) {
	const { site, ogImage, rooms } = options;

	return clean({
		'@context': 'https://schema.org',
		'@type': 'LodgingBusiness',
		'@id': absolute('/#lodging', site),
		name: SITE.name,
		description: SITE.description,
		url: absolute('/', site),
		image: absolute(ogImage, site),
		address: address(),
		geo: geo(),
		hasMap: CONTACT.mapsUrl,
		email: CONTACT.email,
		telephone: `+${CONTACT.whatsapp}`,
		contactPoint: [
			clean({
				'@type': 'ContactPoint',
				telephone: `+${CONTACT.whatsapp}`,
				contactType: 'reservations',
				areaServed: 'PH',
				availableLanguage: 'en',
			}),
		],
		sameAs: [CONTACT.facebook, CONTACT.instagram].filter((url) => !isPlaceholder(url)),
		containsPlace: rooms.map((room) =>
			clean({
				'@type': 'Accommodation',
				name: room.title,
				occupancy: {
					'@type': 'QuantitativeValue',
					maxValue: room.sleeps,
					unitCode: 'C62',
				},
			}),
		),
	});
}

/** Helps search engines render the site name. */
export function websiteSchema(site: URL | undefined) {
	return clean({
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		'@id': absolute('/#website', site),
		name: SITE.name,
		url: absolute('/', site),
		inLanguage: SITE.locale,
	});
}
