import React, { useCallback } from 'react';
import { Card, Avatar, Button } from 'antd';
import Link from 'next/link';

const UserProfile = () => {

    const onLogout = useCallback(() => {

    }, []);

    return (
        <Card
          actions={[
            <Link href="/profile" prefetch key="twit">
            <a>
                <div>작성<br />{0}</div>
            </a>
            </Link>,
            <Link href="/profile" prefetch key="following">
            <a>
                <div>팔로잉<br />{0}</div>
            </a>
            </Link>,
            <Link href="/profile" prefetch key="follower">
            <a>
                <div>팔로워<br />{0}</div>
            </a>
            </Link>,
          ]}
        >
        <Card.Meta
            avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"></Avatar>}
            title="card title"
        />
        <Button type="primary" onClick={onLogout}>로그아웃</Button>
        </Card>
    );
};

export default UserProfile;