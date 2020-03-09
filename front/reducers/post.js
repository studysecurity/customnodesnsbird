import produce from 'immer';

export const initialState = {
    mainPosts: [], //화면에 보일 포스트들
    imagePaths: [], //미리보기 이미지 경로
    addPostErrorReason: '', //포스트 업로드 실패 사유
    isAddingPost: false, //포스트 업로드 중
    postAdded: false, //포스트 업로드 성공 여부
    isAddingComment: false, //댓글 업로드 중 표시
    commentAdded: false, //댓글 업로드
};

export const ADD_POST_REQUEST = 'ADD_POST_REQUEST';
export const ADD_POST_SUCCESS = 'ADD_POST_SUCCESS';
export const ADD_POST_FAILURE = 'ADD_POST_FAILURE';

export const UPLOAD_IMAGES_REQUEST = 'UPLOAD_IMAGES_REQUEST';
export const UPLOAD_IMAGES_SUCCESS = 'UPLOAD_IMAGES_SUCCESS';
export const UPLOAD_IMAGES_FAILURE = 'UPLOAD_IMAGES_FAILURE';

export const REMOVE_IMAGE = 'REMOVE_IMAGE';

export const LOAD_MAIN_POSTS_REQUEST = 'LOAD_MAIN_POSTS_REQUEST';
export const LOAD_MAIN_POSTS_SUCCESS = 'LOAD_MAIN_POSTS_SUCCESS';
export const LOAD_MAIN_POSTS_FAILURE = 'LOAD_MAIN_POSTS_FAILURE';

export const REMOVE_POST_REQUEST = 'REMOVE_POST_REQUEST';
export const REMOVE_POST_SUCCESS = 'REMOVE_POST_SUCCESS';
export const REMOVE_POST_FAILURE = 'REMOVE_POST_FAILURE';

export const LIKE_POST_REQUEST = 'LIKE_POST_REQUEST';
export const LIKE_POST_SUCCESS = 'LIKE_POST_SUCCESS';
export const LIKE_POST_FAILURE = 'LIKE_POST_FAILURE';

export const UNLIKE_POST_REQUEST = 'UNLIKE_POST_REQUEST';
export const UNLIKE_POST_SUCCESS = 'UNLIKE_POST_SUCCESS';
export const UNLIKE_POST_FAILURE = 'UNLIKE_POST_FAILURE';

export const ADD_COMMENT_REQUEST = 'ADD_COMMENT_REQUEST';
export const ADD_COMMENT_SUCCESS = 'ADD_COMMENT_SUCCESS';
export const ADD_COMMENT_FAILURE = 'ADD_COMMENT_FAILURE';

export const LOAD_COMMENTS_REQUEST = 'LOAD_COMMENTS_REQUEST';
export const LOAD_COMMENTS_SUCCESS = 'LOAD_COMMENTS_SUCCESS';
export const LOAD_COMMENTS_FAILURE = 'LOAD_COMMENTS_FAILURE';

export const MODIFY_LOAD_POST_IMAGES_REQUEST = 'MODIFY_LOAD_POST_IMAGES_REQUEST'; 
export const MODIFY_LOAD_POST_IMAGES_CLEARED = 'MODIFY_LOAD_POST_IMAGES_CLEARED';

export const MODIFY_POST_REQUEST = 'MODIFY_POST_REQUEST';
export const MODIFY_POST_SUCCESS = 'MODIFY_POST_SUCCESS';
export const MODIFY_POST_FAILURE = 'MODIFY_POST_FAILURE';

export const LOAD_USER_POSTS_REQUEST = 'LOAD_USER_POSTS_REQUEST';
export const LOAD_USER_POSTS_SUCCESS = 'LOAD_USER_POSTS_SUCCESS';
export const LOAD_USER_POSTS_FAILURE = 'LOAD_USER_POSTS_FAILURE';

export const LOAD_HASHTAG_POSTS_REQUEST = 'LOAD_HASHTAG_POSTS_REQUEST';
export const LOAD_HASHTAG_POSTS_SUCCESS = 'LOAD_HASHTAG_POSTS_SUCCESS';
export const LOAD_HASHTAG_POSTS_FAILURE = 'LOAD_HASHTAG_POSTS_FAILURE';

export const LOAD_LIKE_POSTS_REQUEST = 'LOAD_LIKE_POSTS_REQUEST';
export const LOAD_LIKE_POSTS_SUCCESS = 'LOAD_LIKE_POSTS_SUCCESS';
export const LOAD_LIKE_POSTS_FAILURE = 'LOAD_LIKE_POSTS_FAILURE';

export const LOAD_FOLLOW_POSTS_REQUEST = 'LOAD_FOLLOW_POSTS_REQUEST';
export const LOAD_FOLLOW_POSTS_SUCCESS = 'LOAD_FOLLOW_POSTS_SUCCESS';
export const LOAD_FOLLOW_POSTS_FAILURE = 'LOAD_FOLLOW_POSTS_FAILURE';

export const LOAD_SINGLE_POST_REQUEST = 'LOAD_SINGLE_POST_REQUEST';
export const LOAD_SINGLE_POST_SUCCESS = 'LOAD_SINGLE_POST_SUCCESS';
export const LOAD_SINGLE_POST_FAILURE = 'LOAD_SINGLE_POST_FAILURE';

export default (state = initialState, action) => {
    return produce(state, (draft) => {
        switch (action.type) {
            case UPLOAD_IMAGES_REQUEST: {
                break;
            }

            case UPLOAD_IMAGES_SUCCESS: {
                // console.log('UPLOAD_IMAGES_SUCCESS : ', JSON.stringify(action.data));
                action.data.forEach((p) => {
                    draft.imagePaths.push(p);
                });
                break;
            }

            case UPLOAD_IMAGES_FAILURE: {
                break;
            }

            case REMOVE_IMAGE: {
                const index = draft.imagePaths.findIndex((v, i) => i === action.index);
                draft.imagePaths.splice(index, 1);
                break;
            }

            case ADD_POST_REQUEST: {
                draft.isAddingPost = true;
                draft.addPostErrorReason = '';
                draft.postAdded = false;
                break;
            }

            case ADD_POST_SUCCESS: {
                draft.isAddingPost = false;
                if (action.data.auth === 0) {
                    draft.mainPosts.unshift(action.data);
                }
                draft.postAdded = true;
                draft.imagePaths = [];
                break;
            }

            case ADD_POST_FAILURE: {
                draft.isAddingPost= false;
                draft.addPostErrorReason = action.error;
                draft.postAdded = false;
                break;
            }

            case LOAD_MAIN_POSTS_REQUEST:
            case LOAD_LIKE_POSTS_REQUEST:
            case LOAD_FOLLOW_POSTS_REQUEST:
            case LOAD_HASHTAG_POSTS_REQUEST: 
            case LOAD_USER_POSTS_REQUEST: {
                draft.mainPosts = !action.lastId ? [] : draft.mainPosts;
                draft.hasMorePost = action.lastId ? draft.hasMorePost : true;
                // console.log('LOAD_POSTS_REQUEST hasMorePost 값 : ', draft.hasMorePost);
                // console.log('LastId value : ', action.lastId && action.lastId);
                break;
            }

            case LOAD_MAIN_POSTS_SUCCESS: 
            case LOAD_LIKE_POSTS_SUCCESS:
            case LOAD_FOLLOW_POSTS_SUCCESS:
            case LOAD_HASHTAG_POSTS_SUCCESS:
            case LOAD_USER_POSTS_SUCCESS: {
                // console.log('LOAD_HASHTAG_POSTS_SUCCESS : ', action.data);
                action.data.forEach((d) => {
                    draft.mainPosts.push(d);
                });
                draft.hasMorePost = action.data.length === 10;
                // console.log('LOAD_POSTS_SUCCESS hasMorePost 값 : ', draft.hasMorePost);
                break;
            }

            case LOAD_MAIN_POSTS_FAILURE: 
            case LOAD_LIKE_POSTS_FAILURE:
            case LOAD_FOLLOW_POSTS_FAILURE:
            case LOAD_HASHTAG_POSTS_FAILURE:
            case LOAD_USER_POSTS_FAILURE: {
                break;
            }

            case REMOVE_POST_REQUEST: {
                break;
            }

            case REMOVE_POST_SUCCESS: {
                const index = draft.mainPosts.findIndex(v => v.id === action.data);
                // console.log('REMOVE_POST_SUCCESS action.data 값 : ',action.data );
                draft.mainPosts.splice(index, 1);
                break;
            }

            case REMOVE_POST_FAILURE: {
                break;
            }

            case LIKE_POST_REQUEST: {
                break;
            }

            case LIKE_POST_SUCCESS: {
                const postIndex = draft.mainPosts.findIndex(v => v.id === action.data.postId);
                draft.mainPosts[postIndex].Likers.unshift({ id: action.data.userId });
                break;
            }

            case LIKE_POST_FAILURE: {
                break;
            }

            case UNLIKE_POST_REQUEST: {
                break;
            }

            case UNLIKE_POST_SUCCESS: {
                const postIndex = draft.mainPosts.findIndex(v => v.id === action.data.postId);
                const likeIndex = draft.mainPosts[postIndex].Likers.findIndex(v => v.id === action.data.userId);
                draft.mainPosts[postIndex].Likers.splice(likeIndex, 1);
                break;
            }

            case UNLIKE_POST_FAILURE: {
                break;
            }

            case ADD_COMMENT_REQUEST: {
                draft.isAddingComment = true;
                draft.commentAdded = false;
                break;
            }

            case ADD_COMMENT_SUCCESS: {
                const postIndex = draft.mainPosts.findIndex(v => v.id === action.data.postId);
                draft.mainPosts[postIndex].Comments.push(action.data.comment);
                draft.isAddingComment = false;
                draft.commentAdded = true;
                break;
            }

            case ADD_COMMENT_FAILURE: {
                draft.isAddingComment = false;
                break;
            }

            case LOAD_COMMENTS_REQUEST: {
                break;
            }

            case LOAD_COMMENTS_SUCCESS: {
                const postIndex = draft.mainPosts.findIndex(v => v.id === action.data.postId);
                draft.mainPosts[postIndex].Comments = action.data.comments;
                break;
            }
            
            case LOAD_COMMENTS_FAILURE: {
                break;
            }

            case MODIFY_LOAD_POST_IMAGES_REQUEST: {
                // console.log('IMAGES_REQUEST : ', action.data);
                action.data.forEach((p) => {
                    draft.imagePaths.push(p.src);
                });
                break;
            }

            case MODIFY_LOAD_POST_IMAGES_CLEARED: {
                draft.imagePaths = [];
                break;
            }

            case MODIFY_POST_REQUEST: {
                break;
            }

            case MODIFY_POST_SUCCESS: {
                console.log('MODIFY_POST_SUCCESS : ', action.data);
                draft.mainPosts.unshift(action.data);
                break;
            }

            case MODIFY_POST_FAILURE: {
                break;
            }

            case LOAD_SINGLE_POST_REQUEST: {
                draft.mainPosts = [];
                break;
            }

            case LOAD_SINGLE_POST_SUCCESS: {
                draft.mainPosts = action.data;
                break;
            }

            case LOAD_SINGLE_POST_FAILURE: {
                break;
            }
        }
    });
};