import produce from 'immer';

export const initialState = {
    isIdStatus: '', //??? ?? ??
};

export const ID_CHECK_REQUEST = 'ID_CHECK_REQUEST';
export const ID_CHECK_SUCCESS = 'ID_CHECK_SUCCESS';
export const ID_CHECK_FAILURE = 'ID_CHECK_FAILURE';
export const ID_CHECK_NULLURE = 'ID_CHECK_NULLURE';

export default (state = initialState, action) => {
    return produce(state, (draft) => {
        switch (action.type) {
            case ID_CHECK_REQUEST: {
                draft.isIdStatus = 'validating';
                break;
            }

            case ID_CHECK_SUCCESS: {
                draft.isIdStatus = 'success';
                break;
            }

            case ID_CHECK_FAILURE: {
                draft.isIdStatus = 'error';
                break;
            }

            case ID_CHECK_NULLURE: {
                draft.isIdStatus = '';
                break;
            }
        }
    });
}