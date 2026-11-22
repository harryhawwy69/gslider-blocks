import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function Save( { attributes } ) {
	const { blockId, isSlideHidden } = attributes;

	const blockProps = useBlockProps.save( {
		// `is-slide-hidden` is what view.js prunes before Swiper counts slides
		className: `flexi-content-item swiper-slide ${ blockId }${
			isSlideHidden ? ' is-slide-hidden' : ''
		}`,
	} );

	return (
		<div { ...blockProps }>
			<div className="gslider-content-wrapper">
				<div className="gslider-content-inner-wrapper">
					<InnerBlocks.Content />
				</div>
			</div>
		</div>
	);
}
