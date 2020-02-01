import { all, fork, takeEvery, delay, put } from 'redux-saga/effects';
import axios from 'axios';
import { 
    ID_CHECK_REQUEST,
    ID_CHECK_SUCCESS,
    ID_CHECK_FAILURE,
} from '../reducers/user';

//ID 중복 확인 (시작)
function idCheckAPI(userId) {
    return axios.post('/login');
}

function* idCheck(action) {
    try {
        // const result = yield call(idCheckAPI, action);
        yield delay(2000);
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

export default function* userSaga() {
    yield all([
        fork(watchId),
    ]);
}