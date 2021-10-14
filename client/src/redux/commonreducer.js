import { VIDEOSTREAM, SCREENSTREAM } from "./actions";

const initialState = {
    videostream:null,
    screenstream:null
}

const commonReducer = (state = initialState,{type, data}) => {
    switch(type){
        case VIDEOSTREAM:
            return {...state,videostream:data };
        case SCREENSTREAM:
            return {...state,screenstream:data};
        default:
            return state;
    }
}

export default commonReducer