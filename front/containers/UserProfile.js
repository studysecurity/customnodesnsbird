import React, { useCallback, useEffect } from 'react';
import { Card, Avatar, Button } from 'antd';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { LOGOUT_REQUEST } from '../reducers/user';


const UserProfile = () => {
    const { me } = useSelector(state => state.user);
    const dispatch = useDispatch();

    const onLogout = useCallback(() => {
        dispatch({
            type: LOGOUT_REQUEST,
        });
        
    }, []);

    return (
        <Card
          actions={[
            <Link href="/profile" key="twit">
            <a>
                <div>작성<br />{0}</div>
            </a>
            </Link>,
            <Link href="/profile" key="following">
            <a>
                <div>팔로잉<br />{0}</div>
            </a>
            </Link>,
            <Link href="/profile" key="follower">
            <a>
                <div>팔로워<br />{0}</div>
            </a>
            </Link>,
          ]}
        >
        <Card.Meta
            avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"></Avatar>}
            title={me && me.userNick}
        />
        <Button type="primary" onClick={onLogout}>로그아웃</Button>
        </Card>
    );
};

export default UserProfile;