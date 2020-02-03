import React from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import Document, { Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components'; 

class MyDocument extends Document {
    static getInitialProps({renderPage}) {
        //스타일이 적용전에 렌더가 되는 문제 해결법
        //검색엔진이 봤을 때 디자인이 안되어있으므로 되어있게 서버사이드 렌더링을 통해 적용
        //참고 사이트 : https://velog.io/@sbinha/next.js-styled-components-%EC%8A%A4%ED%83%80%EC%9D%BC%EC%9D%B4-%EC%A0%81%EC%9A%A9%EC%A0%84%EC%97%90-%EB%A0%8C%EB%8D%94%EA%B0%80-%EB%90%98%EB%8A%94-%EB%AC%B8%EC%A0%9C-%ED%95%B4%EA%B2%B0%EB%B2%95
        const sheet = new ServerStyleSheet();
        const page = renderPage((App) => (props) => 
            sheet.collectStyles(<App {...props} />),
        );
        const styleTags = sheet.getStyleElement();
        return { ...page, helmet: Helmet.renderStatic(), styleTags };
    }

    render() {
        const { htmlAttributes, bodyAttributes, ...helmet} = this.props.helmet;
        const htmlAttrs = htmlAttributes.toComponent();
        const bodyAttrs = htmlAttributes.toComponent();

        return (
            <html {...htmlAttrs}>
                <Head>
                    {this.props.styleTags}
                    {Object.values(helmet).map(el => el.toComponent())}
                    {/* <style global jsx>
                        {`
                            html, body {
                                height: 100%;
                                width: 100%;
                                overflow: hidden;
                            }
                        `}
                    </style> */}
                </Head>
                <body {...bodyAttrs}>
                    <Main />
                    { /* expoler 스타일 적용안되는 것 최적화 하는 부분 */}
                    {process.env.NODE_ENV === 'production'
                        && <script src="https://polyfill.io/v3/polyfill.min.js?features=es6,es7,es8,es9,NodeList.prototype.forEach&flags=gated" />}
                    <NextScript />
                </body>
            </html>
        )
    }
}

// MyDocument.propTypes = {
//     helmet: PropTypes.object.isRequired,
//     styleTags: PropTypes.object.isRequired,
// };

export default MyDocument;