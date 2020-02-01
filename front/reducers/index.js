import { combineReducers } from 'redux';
import user from './user';

//각각의 store(데이터)를 통합해주는 부분 (은행 역할)
const rootReducer = combineReducers({
    user
});

export default rootReducer;