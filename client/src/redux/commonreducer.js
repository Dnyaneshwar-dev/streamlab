import { VIDEOSTREAM, SCREENSTREAM, PAYLOAD } from "./actions";

const initialState = {
    videostream:null,
    screenstream:null
}

const commonReducer = (state = initialState,{type, data, payload}) => {
    switch(type){
        case VIDEOSTREAM:
            return {...state,videostream:data };
        case SCREENSTREAM:
        case PAYLOAD:
            return {...state,payload: payload};
        default:
            return state;
    }
}

export default commonReducer