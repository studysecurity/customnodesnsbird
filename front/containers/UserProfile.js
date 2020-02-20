import React, { useCallback, useEffect } from 'react';
import { Card, Avatar, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { LOGOUT_REQUEST } from '../reducers/user';
import Link from 'next/link';

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
            <Link href="/profile" key="twit" prefetch>
            <a>
                <div>작성<br />{me.Posts.length}</div>
            </a>
            </Link>,
            <Link href="/profile" key="following" prefetch>
            <a>
                <div>팔로잉<br />{me.Followings.length}</div>
            </a>
            </Link>,
            <Link href="/profile" key="follower" prefetch>
            <a>
                <div>팔로워<br />{me.Followers.length}</div>
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