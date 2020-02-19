import produce from 'immer';

export const initialState = {
    mainPosts: [], //화면에 보일 포스트들
    imagePaths: [], //미리보기 이미지 경로
    addPostErrorReason: '', //포스트 업로드 실패 사유
    isAddingPost: false, //포스트 업로드 중
    postAdded: false, //포스트 업로드 성공 여부
};

export const ADD_POST_REQUEST = 'ADD_POST_REQUEST';
export const ADD_POST_SUCCESS = 'ADD_POST_SUCCESS';
export const ADD_POST_FAILURE = 'ADD_POST_FAILURE';

export const UPLOAD_IMAGES_REQUEST = 'UPLOAD_IMAGES_REQUEST';
export const UPLOAD_IMAGES_SUCCESS = 'UPLOAD_IMAGES_SUCCESS';
export const UPLOAD_IMAGES_FAILURE = 'UPLOAD_IMAGES_FAILURE';

export const REMOVE_IMAGE = 'REMOVE_IMAGE';

export default (state = initialState, action) => {
    return produce(state, (draft) => {
        switch (action.type) {
            case UPLOAD_IMAGES_REQUEST: {
                break;
            }

            case UPLOAD_IMAGES_SUCCESS: {
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
                draft.mainPosts.unshift(action.data);
                draft.postAdded = true;
                break;
            }

            case ADD_POST_FAILURE: {
                draft.isAddingPost= false;
                draft.addPostErrorReason = action.error;
                draft.postAdded = false;
                break;
            }
        }
    });
};