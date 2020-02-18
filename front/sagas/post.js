import { all, fork, takeLatest, put, call } from 'redux-saga/effects';
import axios from 'axios';
import { 
    ADD_POST_REQUEST,
    ADD_POST_SUCCESS,
    ADD_POST_FAILURE,
    UPLOAD_IMAGES_REQUEST,
    UPLOAD_IMAGES_SUCCESS,
    UPLOAD_IMAGES_FAILURE, 
} from '../reducers/post';

//게시글 이미지 업로드 (시작)
function uploadImagesAPI(formData) {
    return axios.post('/post/images', formData, {
        withCredentials: true,
    });
}

function* uploadImages(action) {
    try {
        const result = yield call(uploadImagesAPI, action.data);
        yield put({
            type: UPLOAD_IMAGES_SUCCESS,
            data: result.data,
        });
    } catch(e) {
        console.error(e);
        yield put({
            type: UPLOAD_IMAGES_FAILURE,
            error: e, 
        });
    }
}

function* watchUploadImages() {
    yield takeLatest(UPLOAD_IMAGES_REQUEST, uploadImages);
}
//게시글 이미지 업로드 (끝)

//게시글 작성 (시작)
function addPostAPI(postData) {
    return axios.post('/post', postData, {
        withCredentials: true,
    });
}

function* addPost(action) {
    try {
        const result = yield call(addPostAPI, action.data);
        yield put({
           type: ADD_POST_SUCCESS,
           data: result.data,
        });
    } catch(e) {
        console.error(e);
        yield put({
            type: ADD_POST_FAILURE,
            error: e,
        });
    }
}

function* watchAddPost() {
    yield takeLatest(ADD_POST_REQUEST, addPost);
}
//게시글 작성 (끝)

export default function* postSaga() {
    yield all([
        fork(watchUploadImages),
        fork(watchAddPost),
    ]);
};