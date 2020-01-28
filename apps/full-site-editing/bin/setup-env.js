/**
 **** WARNING: No ES6 modules here. Not transpiled! ****
 */
/* eslint-disable import/no-nodejs-modules */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
const runAll = require( 'npm-run-all' );

runAll( [ 'build', 'env install' ], {
	parallel: false,
	stdout: process.stdout,
	stderr: process.stderr,
	printLabel: true,
} );
