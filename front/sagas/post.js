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
    LIKE_POST_REQUEST,
    LIKE_POST_SUCCESS,
    LIKE_POST_FAILURE,
    UNLIKE_POST_REQUEST,
    UNLIKE_POST_SUCCESS,
    UNLIKE_POST_FAILURE,
    ADD_COMMENT_REQUEST,
    ADD_COMMENT_SUCCESS,
    ADD_COMMENT_FAILURE,
    LOAD_COMMENTS_REQUEST,
    LOAD_COMMENTS_SUCCESS,
    LOAD_COMMENTS_FAILURE,
    MODIFY_POST_REQUEST,
    MODIFY_POST_SUCCESS,
    MODIFY_POST_FAILURE,
} from '../reducers/post';
import { ADD_POST_TO_ME, REMOVE_POST_OF_ME } from '../reducers/user';

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
        yield put({ // post reducer의 데이터를 수정
           type: ADD_POST_SUCCESS,
           data: result.data,
        });
        yield put({ // user reducer의 데이터를 수정
            type: ADD_POST_TO_ME,
            data: result.data.id,
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
    return axios.get('/posts', {
        withCredentials: true,
    });
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
        yield put({
            type: REMOVE_POST_OF_ME,
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

//좋아요 (시작)
function likePostAPI(postId) {
    return axios.post(`/post/${postId}/like`, {}, {
        withCredentials: true,
    });
}

function* likePost(action) {
    try {
        const result = yield call(likePostAPI, action.data); //action.data는 postid값
        yield put({
            type: LIKE_POST_SUCCESS,
            data: {
                postId: action.data,
                userId: result.data.userId,
            },
        });
    } catch(e) {
        console.error(e);
        yield put({
            type: LIKE_POST_FAILURE,
        });
    }
}

function* watchLikePost() {
    yield takeLatest(LIKE_POST_REQUEST, likePost);
}
//좋아요 (끝)

//좋아요 취소(시작)
function unlikePostAPI(postId) {
    return axios.delete(`/post/${postId}/like`, {
        withCredentials: true,
    });
}

function* unlikePost(action) {
    try {
        const result = yield call(unlikePostAPI, action.data);
        yield put({
            type: UNLIKE_POST_SUCCESS,
            data: {
                postId: action.data,
                userId: result.data.userId,
            },
        });
    } catch(e) {
        console.error(e);
        yield put({
           type: UNLIKE_POST_FAILURE, 
        });
    }
}

function* watchUnlikePost(){
    yield takeLatest(UNLIKE_POST_REQUEST, unlikePost);
}
//좋아요 취소(끝)

//댓글 추가(시작)
function addCommentAPI(data) {
    return axios.post(`/post/${data.postId}/comment`, { content: data.content }, {
        withCredentials: true,
    });
}

function* addComment(action) {
    try {
        const result = yield call(addCommentAPI, action.data);
        yield put({
            type: ADD_COMMENT_SUCCESS,
            data: {
                postId: action.data.postId,
                comment: result.data,
            },
        });
    } catch(e) {
        console.error(e);
        yield put({
            type: ADD_COMMENT_FAILURE,
        });
    }
} 

function* watchAddComment() {
    yield takeLatest(ADD_COMMENT_REQUEST, addComment);
}
//댓글 추가(끝)

//댓글 내용 가져오기 (시작)
function loadCommentsAPI(postId) {
    return axios.get(`/post/${postId}/comments`);
}

function* loadComments(action) {
    try { 
        const result = yield call(loadCommentsAPI, action.data);
        yield put({
            type: LOAD_COMMENTS_SUCCESS,
            data: {
                postId: action.data,
                comments: result.data,
            },
        });
    } catch(e) {
        console.error(e);
        yield put({
            type: LOAD_COMMENTS_FAILURE,
        });
    }
}

function* watchLoadComments() {
    yield takeLatest(LOAD_COMMENTS_REQUEST, loadComments);
}
//댓글 내용 가져오기 (끝)

//게시글 수정(시작)
function modifyPostAPI(postData) {
    return axios.post('/post/modify', postData, {
        withCredentials: true,
    });
}

function* modifyPost(action) {
    try {
        const result = yield call(modifyPostAPI, action.data);
        console.log('modifyPost result 값 : ', result);
        yield put({
            type: MODIFY_POST_SUCCESS,
            data: result.data.id,
        });
    } catch(e) {
        console.error(e);
        yield put({
            type: MODIFY_POST_FAILURE,
        });
    }
}

function* watchModifyPost() {
    yield takeLatest(MODIFY_POST_REQUEST, modifyPost);
}
//게시글 수정(끝)

export default function* postSaga() {
    yield all([
        fork(watchUploadImages),
        fork(watchAddPost),
        fork(watchLoadMainPosts),
        fork(watchRemovePost),
        fork(watchLikePost),
        fork(watchUnlikePost),
        fork(watchAddComment),
        fork(watchLoadComments),
        fork(watchModifyPost),
    ]);
};