import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { Form, Input, Checkbox, Button, Divider } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

//styled component 리로드시 적용 안되는 문제점 해결
//https://velog.io/@sbinha/next.js-styled-components-%EC%8A%A4%ED%83%80%EC%9D%BC%EC%9D%B4-%EC%A0%81%EC%9A%A9%EC%A0%84%EC%97%90-%EB%A0%8C%EB%8D%94%EA%B0%80-%EB%90%98%EB%8A%94-%EB%AC%B8%EC%A0%9C-%ED%95%B4%EA%B2%B0%EB%B2%95

const LoginError = styled.div`
    color: red;
`;

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
    //임시로 로그인 에러 넣어둠
    const logInErrorReason = "아이디 또는 비밀번호를 확인하세요.";
    
    // 로그인 버튼 클릭
    const onSubmitForm = useCallback((e) => {
        e.preventDefault();

    });


    return (
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
                <Form.Item>
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
                {/* <LoginError>{logInErrorReason}</LoginError> */}
                <Form.Item>
                    <Checkbox>자동 로그인</Checkbox>
                    <a style={{float: "right"}}>비밀번호 찾기</a>
                    <Button type="primary" htmlType="submit" style={{width: '100%'}}>
                        로그인
                    </Button>
                    <Divider type="horizontal" style={{margin: "16px 0", backgroundColor: '#FFB6C1'}}/>
                    <Link href="/signup"><a><Button type="primary" style={{width: '100%'}}>회원가입</Button></a></Link>
                </Form.Item>
            </Form>
        </div>
    );
}

export default Index;