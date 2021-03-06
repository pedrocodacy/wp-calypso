/**
 * External dependencies
 */
import React from 'react';
import classnames from 'classnames';
import { Card, Button } from '@automattic/components';
import { localize } from 'i18n-calypso';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import AppsBadge from 'blocks/get-apps/apps-badge';
import userAgent from 'lib/user-agent';
import { isDesktop } from 'lib/viewport';
import CardHeading from 'components/card-heading';
import appleStoreLogo from 'assets/images/customer-home/apple-store.png';
import googlePlayLogo from 'assets/images/customer-home/google-play.png';
import { sendEmailLogin } from 'state/auth/actions';
import { recordTracksEvent, withAnalytics } from 'state/analytics/actions';
import { getCurrentUserEmail } from 'state/current-user/selectors';

/**
 * Style dependencies
 */
import './style.scss';

export const GoMobileCard = ( { translate, email, sendMobileLoginEmail } ) => {
	const isDesktopView = isDesktop();
	const { isiPad, isiPod, isiPhone, isAndroid } = userAgent;
	const isIos = isiPad || isiPod || isiPhone;
	const showIosBadge = isDesktopView || isIos || ! isAndroid;
	const showAndroidBadge = isDesktopView || isAndroid || ! isIos;
	const showOnlyOneBadge = showIosBadge !== showAndroidBadge;

	const emailLogin = () => {
		sendMobileLoginEmail( email );
	};

	return (
		<Card className="go-mobile-card">
			<div className={ classnames( 'go-mobile-card__row', { 'has-2-cols': showOnlyOneBadge } ) }>
				<div className="go-mobile-card__title">
					<CardHeading>{ translate( 'Go Mobile' ) }</CardHeading>
					<h6 className="go-mobile-card__subheader">{ translate( 'Make updates on the go' ) }</h6>
				</div>
				<div className="go-mobile-card__app-badges">
					{ showIosBadge && (
						<AppsBadge
							storeLink="https://apps.apple.com/app/apple-store/id335703880?pt=299112&ct=calypso-customer-home&mt=8"
							storeName={ 'ios' }
							titleText={ translate( 'Download the WordPress iOS mobile app.' ) }
							altText={ translate( 'Apple App Store download badge' ) }
						>
							<img src={ appleStoreLogo } alt="" />
						</AppsBadge>
					) }
					{ showAndroidBadge && (
						<AppsBadge
							storeLink="https://play.google.com/store/apps/details?id=org.wordpress.android&referrer=utm_source%3Dcalypso-customer-home%26utm_medium%3Dweb%26utm_campaign%3Dmobile-download-promo-pages"
							storeName={ 'android' }
							titleText={ translate( 'Download the WordPress Android mobile app.' ) }
							altText={ translate( 'Google Play Store download badge' ) }
						>
							<img src={ googlePlayLogo } alt="" />
						</AppsBadge>
					) }
				</div>
			</div>
			{ isDesktopView && (
				<Button className="go-mobile-card__email-link-button" onClick={ emailLogin }>
					{ translate( 'Email download link' ) }
				</Button>
			) }
		</Card>
	);
};

const sendMobileLoginEmail = email =>
	withAnalytics(
		recordTracksEvent( 'calypso_customer_home_request_mobile_email_login' ),
		sendEmailLogin( email, { showGlobalNotices: true, isMobileAppLogin: true } )
	);

export default connect(
	state => {
		return {
			email: getCurrentUserEmail( state ),
		};
	},
	{
		sendMobileLoginEmail,
	}
)( localize( GoMobileCard ) );
