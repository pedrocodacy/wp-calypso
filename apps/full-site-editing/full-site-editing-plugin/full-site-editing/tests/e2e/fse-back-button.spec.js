/**
 * External dependencies
 */
/* eslint-disable import/no-extraneous-dependencies */
import { createNewPost } from '@wordpress/e2e-test-utils';

describe( 'Full Site Editing Back Button', () => {
	it( 'Should navigate to a new post.', async () => {
		await createNewPost();
		const title = await page.title();
		expect( title ).toBe( 'Add New Post ‹ WordPress Develop — WordPress' );
	} );
} );
