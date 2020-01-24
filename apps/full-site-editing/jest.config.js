/**
 * Test configuration for the FSE plugin.
 *
 * Will match files such that:
 *   1. Must be in the apps/full-site-editing/ directory
 *   2. Must have .test.EXT or .spec.EXT at the end of the filename
 *   3. EXT (above) must be one of js, ts, jsx, or tsx.
 */

/* eslint-disable import/no-extraneous-dependencies */

const suffix = process.argv.includes( 'e2e' ) ? 'spec' : 'test';

// @wordpress/scripts manually adds additional Jest config ontop of
// @wordpress/jest-preset-default so we pull in this file to extend it
const defaults = require( '@wordpress/scripts/config/jest-unit.config.js' );
const path = require( 'path' );

const config = {
	...defaults,
	rootDir: path.normalize( '../../' ), // To detect wpp-calypso root node_modules
	testMatch: [ `${ __dirname }/**/?(*.)${ suffix }.[jt]s?(x)` ],
	setupFilesAfterEnv: [
		...( defaults.setupFilesAfterEnv || [] ), // extend if present
		'<rootDir>/apps/full-site-editing/bin/js-unit-setup',
	],
};

module.exports = config;
