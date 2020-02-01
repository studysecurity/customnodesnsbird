import React, { useCallback, useState, useEffect, memo } from 'react';
import { Form, Input, Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { useInput }  from './index';
import styled from 'styled-components';
import Link from 'next/link';

import { useDispatch, useSelector } from 'react-redux';
import { ID_CHECK_REQUEST, ID_CHECK_NULLURE } from '../reducers/user';

const SignupError = styled.div`
    color: red;
`;

const Signup = memo(() => {
    const [id, setId] = useState('');
    const [password, onChangePassword] = useInput('');
    const [passwordCheck, setPasswordCheck] = useState('');
    //패스워드, 패스워드 확인 같은지 여부
    const [passwordError, setPasswordError] = useState(false);
    const [nick, setNick] = useState('');

    //redux
    const dispatch = useDispatch();
    const { isIdStatus } = useSelector(state => state.user);

    //가입하기 클릭시(회원가입)
    const onSubmit = useCallback((e) => {
        e.preventDefault();
        
    }, [id, password, passwordCheck, nick]);

    //아이디 (중복 체크 및 변화감지)
    const onChangeId = useCallback((e) => {
        //아이디 중복 체크하는 부분을 실시간으로 해줘야 할거 같음
        setId(e.target.value);
    }, [id]);

    const onDuplicateCheck = useCallback((e) => {
        if(id) {
            console.log('id 존재');
            return dispatch({
                type: ID_CHECK_REQUEST,
                userId: id,
            });
        }
    }, [id]);

    const onDuplicateCheckOut = useCallback((e) => {
        return dispatch({   
            type: ID_CHECK_NULLURE,
        });
    }, []);

    //비밀번호, 비밀번호 확인 체크
    const onChangePasswordCheck = useCallback((e) => {
        //패스워드, 패스워드 확인이 다르면 true로 변경
        setPasswordError(e.target.value !== password);
        setPasswordCheck(e.target.value);
    }, [password]);

    //닉네임 변경 감지
    const onChangeNick = useCallback((e) => {
        //여기도 추후에 실시간 닉네임 중복검사 해줘야 할듯
        setNick(e.target.value);
    }, [nick]);

    return (
        <div style={{margin: '0 auto', width: '80%'}}>
            <div style={{marginBottom: '20px', fontSize: '20px', textAlign: 'center', color: '#9400D3', fontFamily: 'bold'}}>
                회원가입
            </div>
            <Form onSubmit={onSubmit}>
                <Form.Item hasFeedback validateStatus={isIdStatus}>
                    <Input
                        onBlur={onDuplicateCheck}
                        onFocus={onDuplicateCheckOut}
                        required
                        name="user-id"
                        style={{height: '40px'}}
                        value={id}
                        placeholder=" ID"
                        prefix={<FontAwesomeIcon icon={faUser} color="rgba(0,0,0,.25" />}
                        onChange={onChangeId} />
                </Form.Item>
                <Form.Item>
                    <Input.Password
                        name="user-password"
                        style={{height: '40px'}}
                        value={password}
                        onChange={onChangePassword}
                        required
                        prefix={<FontAwesomeIcon icon={faLock} color="rgba(0,0,0,.25)" />}
                        placeholder="Password" />
                </Form.Item>
                <Form.Item>
                    <Input.Password
                        name="user-password-check"
                        style={{height: '40px'}}
                        value={passwordCheck}
                        onChange={onChangePasswordCheck}
                        required
                        prefix={<FontAwesomeIcon icon={faLock} color="rgba(0,0,0,.25)" />}
                        placeholder="Password Check" />
                </Form.Item>
                {passwordError && <SignupError>비밀번호가 일치하지 않습니다.</SignupError>}
                <Form.Item>
                    <Input
                        name="user-nick"
                        style={{height: '40px'}}
                        value={nick}
                        onChange={onChangeNick}
                        required
                        prefix={<FontAwesomeIcon icon={faLock} color="rgba(0,0,0,.25)" />}
                        placeholder="NickName" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{width: '40%'}}>
                            가입하기
                    </Button>
                    <Link href="/">
                        <a>
                            <Button type="primary" style={{width: '40%', float: 'right'}}>
                                    취소
                            </Button>
                        </a>
                    </Link>
                </Form.Item>
            </Form>
        </div>
    );
}, []);

export default Signup;