/**
 * External dependencies
 */
import { concat, difference, omitBy, omit, trim, uniq } from 'lodash';

/**
 * Internal dependencies
 */
import {
	WOOCOMMERCE_SERVICES_PACKAGES_ADD_PACKAGE,
	WOOCOMMERCE_SERVICES_PACKAGES_REMOVE_PACKAGE,
	WOOCOMMERCE_SERVICES_PACKAGES_EDIT_PACKAGE,
	WOOCOMMERCE_SERVICES_PACKAGES_DISMISS_MODAL,
	WOOCOMMERCE_SERVICES_PACKAGES_SET_IS_SAVING,
	WOOCOMMERCE_SERVICES_PACKAGES_SET_MODAL_ERRORS,
	WOOCOMMERCE_SERVICES_PACKAGES_UPDATE_PACKAGES_FIELD,
	WOOCOMMERCE_SERVICES_PACKAGES_SAVE_PACKAGE,
	WOOCOMMERCE_SERVICES_PACKAGES_TOGGLE_OUTER_DIMENSIONS,
	WOOCOMMERCE_SERVICES_PACKAGES_TOGGLE_ALL,
	WOOCOMMERCE_SERVICES_PACKAGES_TOGGLE_PACKAGE,
	WOOCOMMERCE_SERVICES_PACKAGES_SET_IS_FETCHING,
	WOOCOMMERCE_SERVICES_PACKAGES_INIT_PACKAGES_FORM,
} from '../action-types';

export const initialState = {
	modalErrors: {},
};

const isNullOrEmpty = ( value ) => null === value || '' === trim( value );

const reducers = {};

reducers[ WOOCOMMERCE_SERVICES_PACKAGES_ADD_PACKAGE ] = ( state ) => {
	const newState = Object.assign( {}, state, {
		showModal: true,
		mode: 'add',
	} );

	if ( 'edit' === state.mode || ! newState.packageData ) {
		newState.packageData = { is_user_defined: true };
	}

	return newState;
};

reducers[ WOOCOMMERCE_SERVICES_PACKAGES_EDIT_PACKAGE ] = ( state, action ) => {
	return Object.assign( {}, state, {
		showModal: true,
		modalReadOnly: false,
		mode: 'edit',
		packageData: action.package,
		showOuterDimensions: false,
	} );
};

reducers[ WOOCOMMERCE_SERVICES_PACKAGES_DISMISS_MODAL ] = ( state ) => {
	return Object.assign( {}, state, {
		modalErrors: {},
		showModal: false,
		showOuterDimensions: false,
	} );
};

reducers[ WOOCOMMERCE_SERVICES_PACKAGES_SET_MODAL_ERRORS ] = ( state, action ) => {
	return Object.assign( {}, state, {
		modalErrors: action.value,
	} );
};

reducers[ WOOCOMMERCE_SERVICES_PACKAGES_UPDATE_PACKAGES_FIELD ] = ( state, action ) => {
	const mergedPackageData = Object.assign( {}, state.packageData, action.values );
	const newPackageData = omitBy( mergedPackageData, isNullOrEmpty );
	return Object.assign( {}, state, {
		packageData: newPackageData,
		pristine: false,
	} );
};

reducers[ WOOCOMMERCE_SERVICES_PACKAGES_SAVE_PACKAGE ] = ( state, action ) => {
	const packageData = action.packageData;
	const custom = state.packages.custom || [];

	if ( packageData.box_weight ) {
		packageData.box_weight = Number.parseFloat( packageData.box_weight );
	}

	if ( packageData.max_weight ) {
		packageData.max_weight = Number.parseFloat( packageData.max_weight );
	}

	if ( 'index' in packageData ) {
		const { index } = packageData;
		custom[ index ] = omit( packageData, 'index' );
	} else {
		custom.push( packageData );
	}

	return {
		...state,
		showModal: false,
		mode: 'add',
		packageData: {
			is_user_defined: true,
		},
		packages: {
			...state.packages,
			custom,
		},
		showOuterDimensions: false,
		selectedPreset: null,
		pristine: false,
	};
};

reducers[ WOOCOMMERCE_SERVICES_PACKAGES_TOGGLE_OUTER_DIMENSIONS ] = ( state ) => {
	return {
		...state,
		showOuterDimensions: true,
	};
};

reducers[ WOOCOMMERCE_SERVICES_PACKAGES_REMOVE_PACKAGE ] = ( state, action ) => {
	const custom = [ ...state.packages.custom ];
	custom.splice( action.index, 1 );
	return {
		...state,
		packages: {
			...state.packages,
			custom,
		},
		pristine: false,
		showModal: false,
	};
};

reducers[ WOOCOMMERCE_SERVICES_PACKAGES_TOGGLE_ALL ] = ( state, { serviceId, groupId, checked } ) => {
	const groupPackages = state.predefinedSchema[ serviceId ][ groupId ].definitions.map( ( def ) => def.id );
	const selected = state.packages.predefined[ serviceId ];
	const newSelected = checked ? uniq( concat( selected, groupPackages ) ) : difference( selected, groupPackages );

	const newPredefined = {	...state.packages.predefined };
	newPredefined[ serviceId ] = newSelected;

	return {
		...state,
		packages: {
			...state.packages,
			predefined: newPredefined,
		},
		pristine: false,
	};
};

reducers[ WOOCOMMERCE_SERVICES_PACKAGES_TOGGLE_PACKAGE ] = ( state, { serviceId, packageId } ) => {
	const newPredefined = {	...state.packages.predefined };
	const newSelected = [ ...( newPredefined[ serviceId ] || [] ) ];
	const packageIndex = newSelected.indexOf( packageId );

	if ( -1 === packageIndex ) {
		newSelected.push( packageId );
	} else {
		newSelected.splice( packageIndex, 1 );
	}

	newPredefined[ serviceId ] = newSelected;

	return {
		...state,
		packages: {
			...state.packages,
			predefined: newPredefined,
		},
		pristine: false,
	};
};

reducers[ WOOCOMMERCE_SERVICES_PACKAGES_SET_IS_SAVING ] = ( state, action ) => {
	return Object.assign( {}, state, {
		isSaving: action.isSaving,
		pristine: ! action.isSaving, //set pristine after the form has been saved
	} );
};

reducers[ WOOCOMMERCE_SERVICES_PACKAGES_SET_IS_FETCHING ] = ( state, { isFetching } ) => {
	return { ...state,
		isFetching,
	};
};

reducers[ WOOCOMMERCE_SERVICES_PACKAGES_INIT_PACKAGES_FORM ] = ( state, {
	packages,
	dimensionUnit,
	weightUnit,
	packageSchema,
	predefinedSchema
} ) => {
	return { ...state,
		packages,
		dimensionUnit,
		weightUnit,
		packageSchema,
		predefinedSchema,
		packageData: state.packageData || {
			is_user_defined: true,
		},
	};
};

const packages = ( state = initialState, action ) => {
	if ( 'function' === typeof reducers[ action.type ] ) {
		return reducers[ action.type ]( state, action );
	}
	return state;
};

export default packages;
