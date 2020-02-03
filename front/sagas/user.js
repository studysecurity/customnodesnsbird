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
} from '../reducers/user';

//ID 중복 확인 (시작)
function idCheckAPI(userId) {
    // console.log('idCheckAPI : '+JSON.stringify(userId));
    // return axios.post('/login');
}

function* idCheck(action) {
    try {
        yield call(idCheckAPI, action);
        // const result = yield call(idCheckAPI, action);
        // yield delay(2000);
        // console.log("sagas에 유저 아이디 값 : ",action.userId);
        yield put({
            type: ID_CHECK_SUCCESS,
        });
    } catch (e) {
        console.error(e);
        yield put({
            type: ID_CHECK_FAILURE,
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
}

function* nickCheck(action) {
    try {
        yield call(nickCheckAPI, action);
        // yield delay(2000);
        // console.log("sagas에 닉네임 값 : ",action.userNick);
        yield put({
            type: NICK_CHECK_SUCCESS,
        });
    } catch (e) {
        console.error(e);
        yield put({
            type: NICK_CHECK_FAILURE,
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

export default function* userSaga() {
    yield all([
        fork(watchId),
        fork(watchNick),
        fork(watchSignUp),
    ]);
}