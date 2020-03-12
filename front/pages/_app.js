import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import AppLayout from '../components/AppLayout';
import withRedux from 'next-redux-wrapper';
import withReduxSaga from 'next-redux-saga';
import { createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import reducer from '../reducers';
import { config } from '@fortawesome/fontawesome-svg-core';
import rootSaga from '../sagas';
import axios from 'axios';
import { LOAD_USER_REQUEST } from '../reducers/user';

//tagsinput
import 'react-tagsinput/react-tagsinput.css';
//video
import "video-react/dist/video-react.css";

//Fontawesome SSR
config.autoAddCss = false; // Tell Font Awesome to skip adding the CSS automatically since it's being imported above

const NodeSnsBird = ({ Component, store, pageProps }) => {
    return (
        <Provider store={store}> {/* 모든 컴포넌트의 redux state의 값을 사용할 수 있도록 제공 */}
            <Helmet
                title="NodeSnsBird"
                htmlAttributes={{ lang: 'ko'}}
                meta={[{
                    charSet: 'UTF-8',
                }, {
                    name: 'viewport', content: 'width=device-width,initial-scale=1.0, minimum-scale=1.0,maximum-scale=1.0,user-scalable=yes,viewport-fit=cover',
                }, {
                    'http-equiv': 'X-UA-Compatible', content: 'IE=edge',
                }, {
                    name: 'description', content: 'NodeSNSBird',
                }, {
                    name: 'og:description', content: 'NodeSNSBird',
                }, {
                    name: 'og:title', content: 'NodeSNSBird',
                }, {
                    property: 'og:type', content: 'website',
                }, {
                    property: 'og:image', content: 'https://nodesnsbird.ga/favicon.ico',
                }]}
                link={[{
                    rel: 'shortcut icon', href: '/favicon.ico',
                }, {
                    rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/antd/3.25.3/antd.css',
                }, {
                    rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css',
                }, {
                    rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css',
                }, {
                    rel: 'stylesheet', href: 'https://use.fontawesome.com/releases/v5.12.0/css/svg-with-js.css',
                }]}
            />
            <AppLayout>
                <Component {...pageProps} />
            </AppLayout>
        </Provider>
    );
}

// NodeSnsBird.propTypes = {
//     Component: PropTypes.elementType.isRequired,
//     store: PropTypes.object.isRequired,
//     pageProps: PropTypes.object.isRequired,
// };

NodeSnsBird.getInitialProps = async (context) => {
    // console.log("getInitialProps _app.js context 값 : ", context);
    const { ctx, Component } = context;
    let pageProps = {};
    //서버 사이드렌더링
    const state = ctx.store.getState();
    const cookie = ctx.isServer ? ctx.req.headers.cookie : '';
    //쿠키 넣기 (백엔드에 보내려고)
    //서버인지, 클라이언트인지 구분
    if (ctx.isServer && cookie) {
        axios.defaults.headers.Cookie = cookie;
    }
    if(!state.user.me) {
        ctx.store.dispatch({
            type: LOAD_USER_REQUEST,
        });
    }
    if(Component.getInitialProps) {
        // 404 status 반환하는 문제가 있음 (서버에서 확인해야함)
        pageProps = await Component.getInitialProps(ctx) || {};
    }
    // console.log('_app.js 실행');
    return { pageProps };
};

const configureStore = (initialState, options) => {
    // console.log("congiureStore 시작");
    //redux(reducers) 에서 사용하기 위해 미들웨어로 saga를 연결 시켜주는 작업
    const sagaMiddleware = createSagaMiddleware();
    const middlewares = [sagaMiddleware, (store) => (next) => (action) => {
        // console.log(action);
        next(action);
    }]; //saga 미들웨어 연결
    const enhancer = process.env.NODE_ENV === 'production'
    ? compose(applyMiddleware(...middlewares)) //배포 환경
    //개발환경
    : compose(
      applyMiddleware(...middlewares),
      !options.isServer && typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined' ? window.__REDUX_DEVTOOLS_EXTENSION__() : (f) => f,
    );
    const store = createStore(reducer, initialState, enhancer);
    // sagaMiddleware.run(rootSaga); //rootSaga를 sagamiddleware에 연결
    // 이부분이 있어야 서버사이드 렌더링을 해줄 수 있음.
    store.sagaTask = sagaMiddleware.run(rootSaga);
    return store;
};

export default withRedux(configureStore)(withReduxSaga(NodeSnsBird));