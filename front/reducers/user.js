import produce from 'immer';

export const initialState = {
    isIdStatus: '', //아이디 중복 체크 상태
    isIdErrorReason: '', //아이디 에러 이유(아이디 중복됨 문구 표시)
    isNickStatus: '', //닉네임 중복 체크 상태
    isNickErrorReason: '', //닉네임 에러 이유(닉네임 중복 문구 표시)
    isSigningUp: false, //회원가입 시도중
    isSignedUp: false, //회원가입 성공
    isSignUpErrorReason: '', //회원가입 실패 사유
    isLoggingOut: false, //로그아웃 시도중
    isLoggingIn: false, //로그인 시도중
    isLoginErrorReason: '',//로그인 실패사유
    me: null, //내정보 (로그인 하면 내 정보가 있으므로 이걸로 판별)
    loadFollowList: [], //팔로우 리스트의 유저 정보들(팔로우 검색 및 유저 검색하여 팔로우 할 수 있게)
    loadFollowListErrorReason: '', //팔로우 리스트 에러 이유
    followErrorReason: '', //팔로우 요청시 에러 이유
};

export const ID_CHECK_REQUEST = 'ID_CHECK_REQUEST';
export const ID_CHECK_SUCCESS = 'ID_CHECK_SUCCESS';
export const ID_CHECK_FAILURE = 'ID_CHECK_FAILURE';
export const ID_CHECK_NULLURE = 'ID_CHECK_NULLURE';

export const NICK_CHECK_REQUEST = 'NICK_CHECK_REQUEST';
export const NICK_CHECK_SUCCESS = 'NICK_CHECK_SUCCESS';
export const NICK_CHECK_FAILURE = 'NICK_CHECK_FAILURE';
export const NICK_CHECK_NULLURE = 'NICK_CHECK_NULLURE';

export const SIGN_UP_REQUEST = 'SIGN_UP_REQUEST';
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS';
export const SIGN_UP_FAILURE = 'SIGN_UP_FAILURE';

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

export const LOAD_USER_REQUEST = 'LOAD_USER_REQUEST';
export const LOAD_USER_SUCCESS = 'LOAD_USER_SUCCESS';
export const LOAD_USER_FAILURE = 'LOAD_USER_FAILURE';

export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_FAILURE = 'LOGOUT_FAILURE';

export const LOAD_FOLLOWLIST_REQUEST = 'LOAD_FOLLOWLIST_REQUEST';
export const LOAD_FOLLOWLIST_SUCCESS = 'LOAD_FOLLOWLIST_SUCCESS';
export const LOAD_FOLLOWLIST_FAILURE = 'LOAD_FOLLOWLIST_FAILURE';

export const FOLLOW_USER_REQUEST = 'FOLLOW_USER_REQUEST';
export const FOLLOW_USER_SUCCESS = 'FOLLOW_USER_SUCCESS';
export const FOLLOW_USER_FAILURE = 'FOLLOW_USER_FAILURE';

export const UNFOLLOW_USER_REQUEST = 'UNFOLLOW_USER_REQUEST';
export const UNFOLLOW_USER_SUCCESS = 'UNFOLLOW_USER_SUCCESS';
export const UNFOLLOW_USER_FAILURE = 'UNFOLLOW_USER_FAILURE';


export default (state = initialState, action) => {
    return produce(state, (draft) => {
        switch (action.type) {
            case ID_CHECK_REQUEST: {
                draft.isIdStatus = 'validating';
                break;
            }

            case ID_CHECK_SUCCESS: {
                draft.isIdStatus = 'success';
                draft.isIdErrorReason = action.data;
                break;
            }

            case ID_CHECK_FAILURE: {
                draft.isIdStatus = 'error';
                draft.isIdErrorReason = action.error;
                break;
            }

            case ID_CHECK_NULLURE: {
                draft.isIdStatus = '';
                draft.isIdErrorReason = '';
                break;
            }

            case NICK_CHECK_REQUEST: {
                draft.isNickStatus = 'validating';
                break;
            }

            case NICK_CHECK_SUCCESS: {
                draft.isNickStatus = 'success';
                draft.isNickErrorReason = action.data;
                break;
            }

            case NICK_CHECK_FAILURE: {
                draft.isNickStatus = 'error';
                draft.isNickErrorReason = action.error;
                break;
            }

            case NICK_CHECK_NULLURE: {
                draft.isNickStatus = '';
                draft.isNickErrorReason = '';
                break;
            }

            case SIGN_UP_REQUEST: {
                draft.isSigningUp = true;
                draft.isSignedUp = false;
                draft.isSignUpErrorReason = '';
                break;
            }

            case SIGN_UP_SUCCESS: {
                draft.isSigningUp = false;
                draft.isSignedUp = true;
                break;
            }

            case SIGN_UP_FAILURE: {
                draft.isSigningUp = false;
                draft.isSignedUp = false;
                draft.isSignUpErrorReason = action.error; 
                break;
            }

            case LOGIN_REQUEST: {
                draft.isLoggingIn = true;
                draft.isLoginErrorReason = '';
                break;
            }

            case LOGIN_SUCCESS: {
                draft.isLoggingIn = false;
                draft.isLoginErrorReason = '';
                draft.me = action.data;
                // console.log('로그인 me 값 : ', draft.me);
                break;
            }

            case LOGIN_FAILURE: {
                draft.isLoggingIn = false;
                draft.isLoginErrorReason = '아이디 혹은 비밀번호가 일치하지 않습니다.';
                draft.me = null;
                break;
            }

            case LOAD_USER_REQUEST: {
                break;
            }

            case LOAD_USER_SUCCESS: {
                draft.me = action.data;
                break;
            }

            case LOAD_USER_FAILURE: {
                break;
            }

            case LOGOUT_REQUEST: {
                break;
            }

            case LOGOUT_SUCCESS: {
                draft.me = null;
                break;
            }

            case LOGOUT_FAILURE: {
                break;
            }

            case LOAD_FOLLOWLIST_REQUEST: {
                draft.loadFollowListErrorReason = '';
                draft.loadFollowList = [];
                break;
            }

            case LOAD_FOLLOWLIST_SUCCESS: {
                draft.loadFollowListErrorReason = '';
                draft.loadFollowList = action.data;
                break;
            }

            case LOAD_FOLLOWLIST_FAILURE: {
                draft.loadFollowListErrorReason = action.error;
                draft.loadFollowList = [];
                break;
            } 

            case FOLLOW_USER_REQUEST: {
                draft.followErrorReason = '';
                break;
            }

            case FOLLOW_USER_SUCCESS: {
                draft.followErrorReason = '';
                draft.me.Followings.unshift({ id: action.data });
                break;
            }

            case FOLLOW_USER_FAILURE: {
                draft.followErrorReason = action.error;
                break;
            }

            case UNFOLLOW_USER_REQUEST: {
                break;
            }

            case UNFOLLOW_USER_SUCCESS: {
                //action.data user의 id 값, followings에서 id 값이 user의 id 값과
                //같으면 팔로우 했다는 것이므로 팔로우 해제 
                const index = draft.me.Followings.findIndex(v => v.id === action.data);
                draft.me.Followings.splice(index, 1);
                break;
            }

            case UNFOLLOW_USER_FAILURE: {
                break;
            }
        }
    });
}