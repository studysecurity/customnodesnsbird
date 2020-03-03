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
            <Link href="/myprofile/myposts" key="twit" >
            <a>
                <div>작성<br />{me.Posts.length}</div>
            </a>
            </Link>,
            <Link href="/myprofile/following" key="following" >
            <a>
                <div>팔로잉<br />{me.Followings.length}</div>
            </a>
            </Link>,
            <Link href="/myprofile/follower" key="follower" >
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
        <Link href="/">
            <a>
                <Button type="primary" onClick={onLogout}>로그아웃</Button>
            </a>
        </Link>
        </Card>
    );
};



export default UserProfile;