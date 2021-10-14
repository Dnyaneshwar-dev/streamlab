import { VIDEOSTREAM, SCREENSTREAM } from "./actions";

const initialState = {
    videostream:0,
    screenstream:0
}

const commonReducer = (state = initialState, action, stream,...rest) => {
    switch(action){
        case VIDEOSTREAM:
            return {...state,videostream:stream };
        case SCREENSTREAM:
            return {...state,screenstream:stream};
        default:
            return state;
    }
}

export default commonReducer