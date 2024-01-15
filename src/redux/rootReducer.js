// ** Reducers Imports
import layout from "./layout";
import navbar from "./navbar";
import auth from './authentication'

const rootReducer = { 
    auth,
    navbar, 
    layout 
};

export default rootReducer;
