import React, { useState, useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Form, Input, Checkbox, Button, Divider, Empty } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { SIGN_UP_FAILURE, LOGIN_REQUEST, LOAD_USER_REQUEST } from '../reducers/user';
import PostForm from '../containers/PostForm';
import PostCard from '../containers/PostCard';
import { 
    LOAD_MAIN_POSTS_REQUEST,
} from '../reducers/post';


//styled component 리로드시 적용 안되는 문제점 해결
//https://velog.io/@sbinha/next.js-styled-components-%EC%8A%A4%ED%83%80%EC%9D%BC%EC%9D%B4-%EC%A0%81%EC%9A%A9%EC%A0%84%EC%97%90-%EB%A0%8C%EB%8D%94%EA%B0%80-%EB%90%98%EB%8A%94-%EB%AC%B8%EC%A0%9C-%ED%95%B4%EA%B2%B0%EB%B2%95

const CircleLogo = styled.img`
  display: block;
  position: relative;
  margin: 0 auto;
  margin-bottom: 40px;
  height: 80px;
  width: 80px;
  background: url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/38816/twitter-32.png') center center no-repeat, #f39c12;
  border-radius: 50%;
  box-shadow: 1px 1px 2px rgba(0,0,0,.3);
`;

export const useInput = (initValue = null) => {
    const [value, setter] = useState(initValue);
    const handler = useCallback((e) => {
        setter(e.target.value);
    }, []);
    return [value, handler];
};

const Index = () => {
    const [id, onChangeId] = useInput('');
    const [password, onChangePassword] = useInput('');
    
    //회원가입이 true 로 되어있으면 다시 회원가입 화면으로 못넘어가므로 false로 변경
    const dispatch = useDispatch();
    const { isSignedUp, isLoggingIn, me, isLoginErrorReason } = useSelector(state => state.user);
    
    //메인화면의 게시글 정보 가져오기
    const { mainPosts, hasMorePost } = useSelector(state => state.post);
    //인피니티 스크롤 페이징
    const countRef = useRef([]);

    //인피니티 스크롤 페이징
    const onScroll = useCallback(() => {
        // console.log(window.scrollY, document.documentElement.clientHeight, document.documentElement.scrollHeight);
        if (window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 600){
            if (hasMorePost) {
                const lastId = mainPosts[mainPosts.length - 1] && mainPosts[mainPosts.length - 1].id;
                //페이지네이션시 리덕스요청이 여러개 보내는 현상이 있는데 요청을 한번만 가게 제한.
                if (!countRef.current.includes(lastId)) { 
                    dispatch({
                        type: LOAD_MAIN_POSTS_REQUEST,
                        lastId,
                    });
                    countRef.current.push(lastId);
                }
            }
        }
    }, [hasMorePost, mainPosts.length]);

    useEffect(() => {
        window.addEventListener('scroll', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
        };
    }, [mainPosts.length]);


    // 로그인 버튼 클릭
    const onSubmitForm = useCallback((e) => {
        e.preventDefault();

        return dispatch({
            type: LOGIN_REQUEST,
            data: {
                userId: id,
                password,
            },
        });
    }, [id, password]);

    useEffect(() => {
        //회원가입이 true 로 되어있으면 다시 회원가입 화면으로 못넘어가므로 false로 변경
        if (isSignedUp) {
            return dispatch({
                type: SIGN_UP_FAILURE,
            });
        }
    }, [isSignedUp]);

    useEffect(() => {
        dispatch({
            type: LOAD_MAIN_POSTS_REQUEST,
        });
    }, []);

    return (
        <>
        {
            !me ?
            (
            <div style={{margin: '0 auto', width: '80%'}}>
                <Form onSubmit={onSubmitForm}>
                    <CircleLogo />
                    <Form.Item>
                        <Input 
                            name="user-id"
                            style={{height: '40px'}}
                            value={id}
                            onChange={onChangeId}
                            required
                            prefix={<FontAwesomeIcon icon={faUser} color="rgba(0,0,0,.25)" />}
                            placeholder=" ID" />
                    </Form.Item>
                    <Form.Item style={isLoginErrorReason && {marginBottom: '2px'}}>
                        <Input 
                            name="user-password"
                            style={{height: '40px'}}
                            value={password}
                            onChange={onChangePassword}
                            required
                            prefix={<FontAwesomeIcon icon={faLock} color="rgba(0,0,0,.25)" />}
                            type="password"
                            placeholder="Password" />
                    </Form.Item>
                    <div style={{color: 'red', fontWeight: 'bold'}}>{isLoginErrorReason}</div>
                    <Form.Item>
                        <Checkbox>자동 로그인</Checkbox>
                        <a style={{float: "right"}}>비밀번호 찾기</a>
                        <Button 
                            type="primary" htmlType="submit" style={{width: '100%'}}
                            loading={isLoggingIn}
                        >
                            로그인
                        </Button>
                        <Divider type="horizontal" style={{margin: "16px 0", backgroundColor: '#FFB6C1'}}/>
                        <Link href="/signup"><a><Button type="primary" style={{width: '100%'}}>회원가입</Button></a></Link>
                    </Form.Item>
                </Form>
            </div>
            ) 
            :
            (
            <>
                <PostForm />
                {
                    // mainPosts.length !== 0 ?
                    mainPosts.map((c) => {
                        return (
                            <PostCard key={c.id} post={c} /> 
                        );
                    })
                    // :
                    // <Empty />
                }
            </>
            )
        }
        </>
    );
}

Index.getInitialProps = async (context) => {
    // console.log('index.js 실행 : ', state.user.me && state.user.me.id);
    // console.log('여기 실행됨?');
    // context.store.dispatch({
    //     type: LOAD_MAIN_POSTS_REQUEST,
    // });
};

export default Index;