import { all, fork, takeEvery, delay, put, call } from 'redux-saga/effects';
import axios from 'axios';
import { 
    ID_CHECK_REQUEST,
    ID_CHECK_SUCCESS,
    ID_CHECK_FAILURE,
    NICK_CHECK_REQUEST,
    NICK_CHECK_SUCCESS,
    NICK_CHECK_FAILURE,
    SIGN_UP_REQUEST,
    SIGN_UP_SUCCESS,
    SIGN_UP_FAILURE,
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    LOAD_USER_REQUEST,
    LOAD_USER_SUCCESS,
    LOAD_USER_FAILURE,
    LOGOUT_REQUEST,
    LOGOUT_SUCCESS,
    LOGOUT_FAILURE,
    LOAD_FOLLOWLIST_REQUEST,
    LOAD_FOLLOWLIST_SUCCESS,
    LOAD_FOLLOWLIST_FAILURE,
} from '../reducers/user';

//ID 중복 확인 (시작)
function idCheckAPI(userId) {
    // console.log('idCheckAPI : '+JSON.stringify(userId));
    return axios.post('/user/signup/check', userId);
}

function* idCheck(action) {
    try {
        const result = yield call(idCheckAPI, action);
        // console.log('백그라운드 응답 값 : ', result);
        // console.log('idCheck action 값 : ', action);
        // const result = yield call(idCheckAPI, action);
        // yield delay(2000);
        // console.log("sagas에 유저 아이디 값 : ",action.userId);
        yield put({
            type: ID_CHECK_SUCCESS,
            data: result.data, //사용 가능한 아이디입니다. 라는 문구
        });
    } catch (e) {
        console.error(e);
        // console.log('궁금 : ',JSON.stringify(e));
        yield put({
            type: ID_CHECK_FAILURE,
            error: '이미 사용중인 아이디입니다.',
        });
    }
}

function* watchId() {
    yield takeEvery(ID_CHECK_REQUEST, idCheck);
}
//ID 중복 확인 (끝)

//닉네임 중복 확인 (시작)
function nickCheckAPI(userNick) {
    // console.log("userNick 값 : "+JSON.stringify(userNick));
    return axios.post('/user/signup/check', userNick);
}

function* nickCheck(action) {
    try {
        const result = yield call(nickCheckAPI, action);
        // yield delay(2000);
        // console.log("sagas에 닉네임 값 : ",action.userNick);
        yield put({
            type: NICK_CHECK_SUCCESS,
            data: result.data,
        });
    } catch (e) {
        console.error(e);
        yield put({
            type: NICK_CHECK_FAILURE,
            error: '이미 사용중인 닉네임입니다.',
        });
    }
}

function* watchNick() {
    yield takeEvery(NICK_CHECK_REQUEST, nickCheck);
}
//닉네임 중복 확인 (끝)

//회원가입 (시작)
function signUpAPI(signUpData) {
    // console.log("signUpAPI : "+JSON.stringify(signUpData));
    return axios.post('/user/signup', signUpData);
}

function* signUp(action) {
    try {
        yield call(signUpAPI, action.data);
        // console.log(action);
        // console.log(action.data);
        yield put({
            type: SIGN_UP_SUCCESS,
        });
    } catch (e) {
        console.error(e);
        yield put({
            type: SIGN_UP_FAILURE
        });
    }
}

function* watchSignUp() {
    yield takeEvery(SIGN_UP_REQUEST, signUp);
}

//회원가입 (끝)

//로그인 (시작)
function logInAPI(logInData) {
    // console.log("signUpAPI : "+JSON.stringify(signUpData));
    return axios.post('/user/login', logInData, {
        //쿠키 정보를 주고받음(백과 프론트쪽 통신)
        withCredentials: true,
    });
}

function* login(action) {
    try {
        const result = yield call(logInAPI, action.data);
        // console.log(action);
        // console.log(action.data);
        yield put({
            type: LOGIN_SUCCESS,
            data: result.data,
        });
    } catch (e) {
        console.error(e);
        yield put({
            type: LOGIN_FAILURE,
            error: e,
        });
    }
}

function* watchLogin() {
    yield takeEvery(LOGIN_REQUEST, login);
}
//로그인 (끝)

//유저 정보 쿠키로 불러오기 (시작)
function loadUserAPI() {
    return axios.get('/user', {
        withCredentials: true, // 클라이언트에서 요청 보낼 때는 브라우저가 쿠키를 같이 동봉해준다.
    }); // 서버 사이드 렌더링일 때는, 브라우저가 없다.
}

function* loadUser() {
    try {
        const result = yield call(loadUserAPI);
        // console.log('사가 쪾 값 : ',result);
        yield put({
           type: LOAD_USER_SUCCESS,
           data: result.data,
        });
    } catch(e) {
        console.error(e);
        yield put({
            type: LOAD_USER_FAILURE,
            error: e,
        });
    }
}

function* watchLoadUser() {
    yield takeEvery(LOAD_USER_REQUEST, loadUser);
}
//유저 정보 쿠키로 불러오기 (끝)

//로그아웃 (시작)
function logOutAPI() {
  // 서버에 요청을 보내는 부분
  return axios.post('/user/logout', {}, {
    withCredentials: true,
  });
}

function* logOut() {
    try {
        yield call(logOutAPI);
        yield put({ // put은 dispatch 동일
            type: LOGOUT_SUCCESS,
        });
    } catch(e) {
        console.error(e);
        yield put({
            type: LOGOUT_FAILURE,
            error: e,
        });
    }
}

function* watchLogOut() {
    yield takeEvery(LOGOUT_REQUEST, logOut);
}
//로그아웃 (끝)

//팔로우 (자기 자신 빼고 전체 유저 목록 가져오기) (시작)
function followListAPI() {
    return axios.post('/user/followList', {}, {
        withCredentials: true,
    });
}

function* followList() {
    try { 
        const result = yield call(followListAPI);
        // console.log('값 있냐? ', result);

        yield put({
            type: LOAD_FOLLOWLIST_SUCCESS,
            data: result.data,
        });
    } catch (e) {
        console.error(e);
        yield put({
            type: LOAD_FOLLOWLIST_FAILURE,
            error: e,
        });
    }
}

function* watchLoadFollowList() {
    yield takeEvery(LOAD_FOLLOWLIST_REQUEST, followList);
}
//팔로우 (자기 자신 빼고 전체 유저 목록 가져오기) (끝)

export default function* userSaga() {
    yield all([
        fork(watchId),
        fork(watchNick),
        fork(watchSignUp),
        fork(watchLogin),
        fork(watchLoadUser),
        fork(watchLogOut),
        fork(watchLoadFollowList)
    ]);
}