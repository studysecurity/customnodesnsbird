import produce from 'immer';

export const initialState = {
    isIdStatus: '', //아이디 중복 체크 상태
    isIdErrorReason: '', //아이디 에러 이유(아이디 중복됨 문구 표시)
    isNickStatus: '', //닉네임 중복 체크 상태
    isNickErrorReason: '', //닉네임 에러 이유(닉네임 중복 문구 표시)
};

export const ID_CHECK_REQUEST = 'ID_CHECK_REQUEST';
export const ID_CHECK_SUCCESS = 'ID_CHECK_SUCCESS';
export const ID_CHECK_FAILURE = 'ID_CHECK_FAILURE';
export const ID_CHECK_NULLURE = 'ID_CHECK_NULLURE';
export const NICK_CHECK_REQUEST = 'NICK_CHECK_REQUEST';
export const NICK_CHECK_SUCCESS = 'NICK_CHECK_SUCCESS';
export const NICK_CHECK_FAILURE = 'NICK_CHECK_FAILURE';
export const NICK_CHECK_NULLURE = 'NICK_CHECK_NULLURE';

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

            case NICK_CHECK_REQUEST: {
                draft.isNickStatus = 'validating';
                break;
            }

            case NICK_CHECK_SUCCESS: {
                draft.isNickStatus = 'success';
                break;
            }

            case NICK_CHECK_FAILURE: {
                draft.isNickStatus = 'error';
                break;
            }

            case NICK_CHECK_NULLURE: {
                draft.isNickStatus = '';
                break;
            }
        }
    });
}