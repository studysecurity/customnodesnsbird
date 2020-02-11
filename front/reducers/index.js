import { combineReducers } from 'redux';
import user from './user';
import post from './post';

//각각의 store(데이터)를 통합해주는 부분 (은행 역할)
const rootReducer = combineReducers({
    user,
    post,
});

export default rootReducer;