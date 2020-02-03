import React, { useCallback, useState, useEffect, memo } from "react";
import { Form, Input, Button, InputNumber } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

import { useDispatch, useSelector } from "react-redux";
import { 
  ID_CHECK_REQUEST, 
  ID_CHECK_NULLURE,
  NICK_CHECK_REQUEST,
  NICK_CHECK_NULLURE,
  SIGN_UP_REQUEST
} from "../reducers/user";

const Signup = memo(() => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState("");
  const [passwordErrorReason, setPasswordErrorReason] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [passwordCheckStatus, setPasswordCheckStatus] = useState("");
  const [passwordCompareErrorReason, setPasswordCompareErrorReason] = useState("");
  const [nick, setNick] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneErrorReason, setPhoneErrorReason] = useState("");
  const [phoneCheckStatus, setPhoneCheckStatus] = useState("");

  //redux
  const dispatch = useDispatch();
  const { isIdStatus, isNickStatus } = useSelector(state => state.user);

  //패스워드 정규식
  //패스워드 유효성 검사 함수 (최소 8자, 최소 하나의 문자, 하나의 숫자 및 하나의 특수문자)
  const passwordRegExp = /^(?=.*[a-zA-Z])(?=.*[!@#$%^&*()*+=-])(?=.*[0-9]).{8,12}$/;
  const phoneRegExp = /^\d{11}$/;

  //가입하기 클릭시(회원가입)
  const onSubmit = useCallback((e) => {
      e.preventDefault();
      // console.log(isIdStatus);
      // console.log(passwordStatus);
      // console.log(passwordCheckStatus);
      // console.log(isNickStatus);
      // console.log(phoneCheckStatus);
      //모든 입력 조건 만족시
      if (isIdStatus, passwordStatus, passwordCheckStatus, 
        isNickStatus, phoneCheckStatus === 'success') {
        //console.log('모든 조건 만족');
        return dispatch({
          type: SIGN_UP_REQUEST,
          data: {
            userId: id,
            password,
            nickname: nick,
            phone,
          }
        });
      } 
  }, [id, password, passwordCheck, nick, phone,
    isIdStatus, passwordStatus, passwordCheckStatus, isNickStatus, phoneCheckStatus]);

  //아이디 값 변화
  const onChangeId = useCallback((e) => {
      setId(e.target.value);
  }, [id]);

  //ID 중복 체크
  const onDuplicateCheckBlur = useCallback((e) => {
      if (id) {
        // console.log("id 존재");
        return dispatch({
          type: ID_CHECK_REQUEST,
          userId: id
        });
      }
  }, [id]);

  //ID 입력란에 포커스가 주어질 때 아이디 중복확인 표시 v 없애기
  const onDuplicateCheckFocus = useCallback((e) => {
    return dispatch({
      type: ID_CHECK_NULLURE
    });
  }, [id]);

  //패스워드
  const onChangePassword = useCallback((e) => {
      setPassword(e.target.value);
  }, [password]);

  //패스워드 포커스일 때 status 상태를 ""로 표현해서 v나 x 표시있으면 지우기
  const onPasswordRegexCheckFocus = useCallback((e) => {
      setPasswordStatus("");
  }, [password]);

  const onPasswordRegexCheckBlur = useCallback((e) => {
      // console.log(password);
      if (password.match(passwordRegExp)) {
        // console.log('정규식 표현 만족');
        setPasswordStatus("success");
        setPasswordErrorReason("");
      } else if (password.length >= 1) {
        setPasswordStatus("error");
        setPasswordErrorReason("최소 8자, 최대 12자 최소 하나의 문자, 하나의 숫자 및 하나의 특수문자");
      } else if (password.length === 0) {
        setPasswordStatus("");
        setPasswordErrorReason("");
      }
  }, [password]);

  useEffect(() => {
      //패스워드 정규식 표현 체크
      if (password.match(passwordRegExp)) {
        // console.log('정규식 표현 만족');
        setPasswordStatus("success");
        setPasswordErrorReason("");
      } else if (password.length >= 1) {
        setPasswordStatus("error");
        setPasswordErrorReason("최소 8자, 최대 12자 최소 하나의 문자, 하나의 숫자 및 하나의 특수문자");
      } else if (password.length === 0) {
        setPasswordStatus("");
        setPasswordErrorReason("");
      }

      //비밀번호가 일치하지 않으면 x 표시 일치하면 v표시
      if(password.length !== 0 & passwordCheck.length !== 0) {
        if (password !== passwordCheck) {
          setPasswordCheckStatus("error");
          setPasswordCompareErrorReason("비밀번호가 일치하지 않습니다.");
        } else {
          setPasswordCompareErrorReason("");
          setPasswordCheckStatus("success");
        }
      } else if(passwordCheck.length === 0) {
          setPasswordCheckStatus("");
      }

      //휴대폰 번호
      if (phone.length !== 0) {
        if(phoneRegExp.test(phone)) {
          setPhoneErrorReason("");
          setPhoneCheckStatus("success");
        } else {
          setPhoneErrorReason("규칙에 맞게 작성해주세요 ex)01012345678");
          setPhoneCheckStatus("error");
        }
      } else {
        setPhoneErrorReason("");
        setPhoneCheckStatus("");
      }
  }, [password, passwordCheck, phone]);

  //패스워드 확인 체크
  const onChangePasswordCheck = useCallback((e) => {
      if(password.length === 0) {
        setPasswordCheckStatus("");
        setPasswordCompareErrorReason("");
      }
      setPasswordCheck(e.target.value);
  }, [password]);

  //패스워드 확인 체크의 포커스가 주어졌을 때 에러 및 성공 아이콘 삭제
  const onPasswordCheckFocus = useCallback((e) => {
      setPasswordCheckStatus("");
      
      //패스워드 확인 입력란이 빈칸이면 에러문구 삭제
      if (passwordCheck.length === 0) {
        setPasswordCompareErrorReason("");
      }
  }, [passwordCheck]);

  //패스워드 확인 입력란을 벗어났을 때 패스워드와 패스워드 확인 내용 확인
  const onPasswordCheckBlur = useCallback((e) => {
      //패스워드와 패스워드 확인이 같지 않다면
      if (password.length !== 0 & passwordCheck.length !== 0) {
        if (password !== passwordCheck) {
            setPasswordCheckStatus("error");
            setPasswordCompareErrorReason("비밀번호가 일치하지 않습니다.");
        } else {
            setPasswordCompareErrorReason("");
            setPasswordCheckStatus("success");
        }
      } else if (passwordCheck.length === 0) {
        setPasswordCompareErrorReason("");
        setPasswordCheckStatus("");
      }
  }, [passwordCheck]);

  //닉네임 값 변화
  const onChangeNick = useCallback((e) => {
      setNick(e.target.value);
  }, [nick]);

  //닉네임 값 중복 확인(백단 서버와 통신)
  const onNickBlur = useCallback((e) => {
    if (nick) {
      return dispatch({
        type: NICK_CHECK_REQUEST,
        userNick: nick
      });
    }
  }, [nick]);

  //닉네임 값 포커스시 에러 및 성공 아이콘 삭제
  const onNickFocus = useCallback((e) => {
      return dispatch({
        type: NICK_CHECK_NULLURE
      });
  }, [nick]);

  //휴대폰 번호 변화 감지
  const onChangePhone = useCallback((e) => {
      setPhone(e.target.value);
  }, [phone]);

  const onPhoneFocus = useCallback((e) => {
      setPhoneCheckStatus("");
  }, [phone]);

  const onPhoneBlur = useCallback((e) => {
      if (phone.match(phoneRegExp)) {
        setPhoneCheckStatus("success");
      } else {
        setPhoneCheckStatus("error");
      }
  }, [phone]);

  return (
    <div style={{ margin: "0 auto", width: "80%" }}>
      <div
        style={{
          marginBottom: "20px",
          fontSize: "20px",
          textAlign: "center",
          color: "#9400D3",
          fontFamily: "bold"
        }}
      >
        회원가입
      </div>
      <Form onSubmit={onSubmit}>
        <Form.Item hasFeedback validateStatus={isIdStatus}>
          <Input
            maxLength={20}
            required
            onBlur={onDuplicateCheckBlur}
            onFocus={onDuplicateCheckFocus}
            name="user-id"
            style={{ height: "40px" }}
            value={id}
            placeholder=" ID"
            prefix={<FontAwesomeIcon icon={faUser} color="rgba(0,0,0,.25" />}
            onChange={onChangeId}
          />
        </Form.Item>
        <Form.Item hasFeedback validateStatus={passwordStatus}
          style={passwordErrorReason && {marginBottom: '2px'}}
        >
          <Input.Password
            maxLength={14}
            onBlur={onPasswordRegexCheckBlur}
            onFocus={onPasswordRegexCheckFocus}
            name="user-password"
            style={{ height: "40px" }}
            value={password}
            onChange={onChangePassword}
            required
            prefix={<FontAwesomeIcon icon={faLock} color="rgba(0,0,0,.25)" />}
            placeholder="Password"
          />
        </Form.Item>
        {
          passwordErrorReason && (
            <div style={{color: 'red', fontSize: '10px', marginBottom: '15px', fontWeight: 'bold'}}>{passwordErrorReason}</div>
          )
        }
        <Form.Item hasFeedback validateStatus={passwordCheckStatus}
          style={passwordCompareErrorReason && {marginBottom: '2px'}}
        >
          <Input.Password
            maxLength={14}
            onBlur={onPasswordCheckBlur}
            onFocus={onPasswordCheckFocus}
            name="user-password-check"
            style={{ height: "40px" }}
            value={passwordCheck}
            onChange={onChangePasswordCheck}
            required
            prefix={<FontAwesomeIcon icon={faLock} color="rgba(0,0,0,.25)" />}
            placeholder="Password Check"
          />
        </Form.Item>
        {
          passwordCompareErrorReason && (
            <div style={{color: 'red', fontSize: '11px', marginBottom: '15px', fontWeight: 'bold'}}>{passwordCompareErrorReason}</div>
          )
        }
        <Form.Item hasFeedback validateStatus={isNickStatus}>
          <Input
             maxLength={20}
            onBlur={onNickBlur}
            onFocus={onNickFocus}
            name="user-nick"
            style={{ height: "40px" }}
            value={nick}
            onChange={onChangeNick}
            required
            prefix={<FontAwesomeIcon icon={faLock} color="rgba(0,0,0,.25)" />}
            placeholder="NickName"
          />
        </Form.Item>
        <Form.Item hasFeedback validateStatus={phoneCheckStatus}
          style={phoneErrorReason && {marginBottom: '2px'}}
        >
          <Input
            onFocus={onPhoneFocus}
            onBlur={onPhoneBlur}
            maxLength={11}
            required
            name="user-phone"
            value={phone}
            onChange={onChangePhone}
            style={{ height: "40px" }}
            prefix={<FontAwesomeIcon icon={faLock} color="rgba(0,0,0,.25)" />}
            placeholder="Phone Number ex)01012345678"
          />
        </Form.Item>
        {
          phoneErrorReason && (
            <div style={{color: 'red', fontSize: '11px', marginBottom: '15px', fontWeight: 'bold'}}>{phoneErrorReason}</div>
          )
        }
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: "40%" }}>
            가입하기
          </Button>
          <Link href="/">
            <a>
              <Button type="primary" style={{ width: "40%", float: "right" }}>
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
