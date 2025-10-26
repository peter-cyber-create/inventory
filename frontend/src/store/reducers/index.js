import { combineReducers } from 'redux';
import assetsReducer from "./assetsReducer";
import userReducer from './userReducer';

const rootReducer = combineReducers({
    assets: assetsReducer,
    auth: userReducer
});

export default rootReducer;