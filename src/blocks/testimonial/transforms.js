import { createBlock } from '@wordpress/blocks';
import attributes from './attributes';

/**
 * Convert a rich-text value (HTML markup) to plain text. Testimonials store
 * their text and author as plain strings, so formatting tags must not leak in.
 *
 * @param {string|*} value The rich-text value from a core quote block.
 * @return {string} Plain text without HTML tags or entities.
 */
const toPlainText = ( value ) => {
	if ( ! value ) {
		return '';
	}
	const doc = new window.DOMParser().parseFromString(
		String( value ),
		'text/html'
	);
	return ( doc.body.textContent || '' ).trim();
};

/**
 * Return the quote text of one source block. A pullquote keeps its text in
 * `value`; a quote keeps it in its paragraph children.
 *
 * @param {Object} blockAttributes The source block's attributes.
 * @param {Array}  innerBlocks     The source block's children.
 * @return {string} The plain-text quote.
 */
const quoteText = ( blockAttributes, innerBlocks ) => {
	if ( blockAttributes?.value !== undefined ) {
		return toPlainText( blockAttributes.value );
	}
	return innerBlocks
		.map( ( block ) => toPlainText( block.attributes?.content ) )
		.filter( Boolean )
		.join( ' ' );
};

/**
 * Convert the selected core/quote and core/pullquote blocks into one
 * testimonial slider, one slide per quote, its citation as the author.
 *
 * @param {Array} blocks      Attributes of each selected block.
 * @param {Array} innerBlocks Inner blocks of each selected block.
 * @return {Object} The Testimonial block.
 */
const toTestimonial = ( blocks, innerBlocks ) => {
	const base = JSON.parse(
		JSON.stringify( attributes.sliderItems.default[ 0 ] )
	);

	const sliderItems = blocks.map( ( blockAttributes, index ) => ( {
		...base,
		id: `item-${ index + 1 }`,
		testimonialTitle: '',
		testimonialText: quoteText( blockAttributes, innerBlocks[ index ] ),
		authorName: toPlainText( blockAttributes?.citation ),
		authorDesignation: '',
		authorImage: {
			url: '',
			id: '',
			alt: '',
		},
		ratingNumber: 5,
	} ) );

	return createBlock( 'gslider-blocks/testimonial', { sliderItems } );
};

const transforms = {
	from: [
		{
			type: 'block',
			blocks: [ 'core/quote', 'core/pullquote' ],
			isMultiBlock: true,
			transform: toTestimonial,
		},
	],
};

export default transforms;
