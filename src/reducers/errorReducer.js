import { GET_ERRORS } from '../actions/types';

const initialState = {};

export default function(state = initialState, action ) {
    switch(action.type) {
        case GET_ERRORS:
        	let errorResult = {};
        	errorResult[action.payload.param] = action.payload.message;
            return errorResult;
        default: 
            return state;
    }
}