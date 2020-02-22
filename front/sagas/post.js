import { all, fork, takeLatest, put, call } from 'redux-saga/effects';
import axios from 'axios';
import { 
    ADD_POST_REQUEST,
    ADD_POST_SUCCESS,
    ADD_POST_FAILURE,
    UPLOAD_IMAGES_REQUEST,
    UPLOAD_IMAGES_SUCCESS,
    UPLOAD_IMAGES_FAILURE, 
    LOAD_MAIN_POSTS_REQUEST,
    LOAD_MAIN_POSTS_SUCCESS,
    LOAD_MAIN_POSTS_FAILURE,
    REMOVE_POST_REQUEST,
    REMOVE_POST_SUCCESS,
    REMOVE_POST_FAILURE,
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

//메인 게시글 불러오기(시작)
//이부분은 무한스크롤링 하면 더 기능 추가해줘야 함
function loadMainPostsAPI() {
    return axios.get('/posts');
}

function* loadMainPosts(action) {
    //이부분은 무한스크롤링 하면 더 기능 추가해줘야 함
    try {
        const result = yield call(loadMainPostsAPI);
        yield put({
            type: LOAD_MAIN_POSTS_SUCCESS,
            data: result.data,
        });
    } catch(e) {
        yield put({
            type: LOAD_MAIN_POSTS_FAILURE,
        });
    }
}

function* watchLoadMainPosts() {
    yield takeLatest(LOAD_MAIN_POSTS_REQUEST, loadMainPosts);
}
//메인 게시글 불러오기(끝)

//게시글 삭제(시작)
function removePostAPI(postId) {
    return axios.delete(`/post/${postId}`, {
        withCredentials: true,
    });
}

function* removePost(action) {
    try {
        const result = yield call(removePostAPI, action.data);
        // console.log('removePost 값 : ', result);
        yield put({
            type: REMOVE_POST_SUCCESS,
            data: result.data,
        });
    } catch(e) {
        console.error(e);
        yield put({
            type: REMOVE_POST_FAILURE,
        })
    }
}

function* watchRemovePost() {
    yield takeLatest(REMOVE_POST_REQUEST, removePost);
}
//게시글 삭제(끝)

export default function* postSaga() {
    yield all([
        fork(watchUploadImages),
        fork(watchAddPost),
        fork(watchLoadMainPosts),
        fork(watchRemovePost),
    ]);
};