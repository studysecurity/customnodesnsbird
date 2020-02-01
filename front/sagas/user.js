import { all, call, fork, takeEvery, delay } from 'redux-saga/effects';
import { 
    ID_CHECK_REQUEST,
    ID_CHECK_SUCCESS,
    ID_CHECK_FAILURE,
} from '../reducers/user';

//ID 중복 확인 (시작)
function idCheckAPI(userId) {
    // return 'success';
}

function* idCheck(action) {
    yield delay(2000);
        yield put({
            type: ID_CHECK_SUCCESS,
        });
    // try {
    //     // const result = yield call(idCheckAPI, action);
    //     yield delay(2000);
    //     yield put({
    //         type: ID_CHECK_SUCCESS,
    //     });
    // } catch (e) {
    //     console.error(e);
    //     yield put({
    //         type: ID_CHECK_FAILURE,
    //         reason: e.response && e.response.data,
    //     });
    // }
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