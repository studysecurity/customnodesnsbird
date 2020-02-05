import { all, call } from 'redux-saga/effects';
import axios from 'axios';
import user from './user';
import { backUrl } from '../config/config';

axios.defaults.baseURL = `${backUrl}/api`;

export default function* rootSaga() {
    yield all([
        call(user)
    ]);
}