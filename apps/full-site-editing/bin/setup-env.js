/**
 **** WARNING: No ES6 modules here. Not transpiled! ****
 */
/* eslint-disable import/no-nodejs-modules */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
const { execSync } = require('child_process');

const fseDir = process.cwd();
// Change to wp-calypso root:
process.chdir( '../../' );

console.log( process.cwd() );

execSync( 'npm ci' );

process.chdir( fseDir );
// Require it after running the install script
const runAll = require( 'npm-run-all' );

runAll( [ 'build', 'env install' ], {
	parallel: false,
	stdout: process.stdout,
	stderr: process.stderr,
	printLabel: true,
} );
