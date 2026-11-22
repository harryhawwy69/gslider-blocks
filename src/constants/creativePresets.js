import { __ } from '@wordpress/i18n';

/**
 * The Creative effect presets a slider can pick from.
 */
export const CREATIVE_PRESET_OPTIONS = [
	{ label: __( '3D Stack', 'gslider-blocks' ), value: 'stack' },
	{ label: __( 'Dynamic Tilt', 'gslider-blocks' ), value: 'tilt' },
	{ label: __( 'Depth Flip', 'gslider-blocks' ), value: 'depth' },
	{ label: __( 'Minimal Shift', 'gslider-blocks' ), value: 'shift' },
];

/**
 * The Swiper creativeEffect each preset maps to.
 *
 * `stack` is the configuration this block shipped before the presets
 * existed, so a slider saved with the creative effect keeps its motion.
 * The vertical direction swaps the horizontal travel for the vertical one
 * where the preset only names a horizontal pair.
 */
export const CREATIVE_PRESETS = {
	stack: {
		prev: { shadow: true, translate: [ '-120%', 0, -500 ] },
		next: { shadow: true, translate: [ '120%', 0, -500 ] },
	},
	tilt: {
		prev: {
			shadow: true,
			translate: [ '-20%', 0, -1 ],
			rotate: [ 0, 0, -10 ],
		},
		next: {
			shadow: true,
			translate: [ '100%', 0, 0 ],
			rotate: [ 0, 0, 0 ],
		},
	},
	depth: {
		prev: {
			shadow: true,
			translate: [ 0, 0, -800 ],
			rotate: [ 180, 0, 0 ],
		},
		next: {
			shadow: true,
			translate: [ 0, 0, -800 ],
			rotate: [ -180, 0, 0 ],
		},
	},
	shift: {
		prev: { shadow: false, translate: [ '-20%', 0, -200 ], opacity: 0 },
		next: { shadow: false, translate: [ '100%', 0, 0 ], opacity: 1 },
	},
};

/**
 * Return the creativeEffect of a preset, travelled vertically if asked.
 *
 * @param {string}  preset   Preset name; an unknown one answers `stack`.
 * @param {boolean} vertical Whether the slider direction is vertical.
 * @return {Object} The Swiper creativeEffect configuration.
 */
export const creativeEffectFor = ( preset, vertical ) => {
	const chosen = CREATIVE_PRESETS[ preset ] || CREATIVE_PRESETS.stack;
	const swapped = vertical
		? {
				prev: {
					...chosen.prev,
					translate: [
						0,
						chosen.prev.translate[ 0 ],
						chosen.prev.translate[ 2 ],
					],
				},
				next: {
					...chosen.next,
					translate: [
						0,
						chosen.next.translate[ 0 ],
						chosen.next.translate[ 2 ],
					],
				},
		  }
		: chosen;
	return swapped;
};
