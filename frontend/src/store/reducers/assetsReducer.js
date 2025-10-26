import {
	ALL_ASSETS_REQUEST,
	ALL_ASSETS_SUCCESS,
	ALL_ASSETS_FAIL,
    CLEAR_ERRORS
} from '../constants/assetsConstants';

const initialState = [];

const assetsReducer = (state = initialState, action) => {

    switch (action.type) {
		case ALL_ASSETS_REQUEST:
			return {
                loading: true,
                assets: []
            }

		case ALL_ASSETS_SUCCESS:
			return {
                loading: false,
                assets: action.payload.assets,
                assetsCount: action.payload.assetsCount,
                resultsPerPage: action.payload.resultsPerPage,
                filteredAssetsCount: action.payload.filteredAssetsCount
            }

		case ALL_ASSETS_FAIL:
			return {
                loading: false,
                error: action.payload
            }
        
        case CLEAR_ERRORS:
            return {
                    ...state,
                    error: null
                }

		default:
			return state;
	}

}

export default assetsReducer;