import {
	ALL_ASSETS_REQUEST,
	ALL_ASSETS_SUCCESS,
	ALL_ASSETS_FAIL,
    CLEAR_ERRORS
} from '../constants/assetsConstants';

import API from '../../helpers/api'

export const getAssets = (keyword = '', model, assetType, currentPage) => async (dispatch) => {
    try {
        dispatch({type: ALL_ASSETS_REQUEST})

        console.log("Actions Asset Type =====>", assetType)
        // console.log("model =====>", model)
        // console.log("department =====>", department)

        let link = `/assets?keyword=${keyword}&page=${currentPage}`

        // if (model) {
        //     link = `/assets?keyword=${keyword}&page=${currentPage}&model=${model}`
        // } 
        
        // if (assetType) {
        //     link = `/assets?keyword=${keyword}&page=${currentPage}&assetType=${assetType}`
        // }

        // if (department) {
        //     link = `/assets?keyword=${keyword}&page=${currentPage}&department=${department}`
        // }

        const {data} = await API.get(link)
        
        dispatch({
            type: ALL_ASSETS_SUCCESS,
            payload: data
        })
        
    } catch (error) {
        dispatch({
            type: ALL_ASSETS_FAIL,
            payload: error.response.data.message
        })
        
    }

}