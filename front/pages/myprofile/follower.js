import React, { useCallback } from 'react';
import styled from 'styled-components';
import { LOAD_FOLLOWERS_REQUEST, REMOVE_FOLLOWER_REQUEST } from '../../reducers/user';
import FollowList from '../../components/FollowList';
import { useDispatch, useSelector } from 'react-redux';

const CardWrapper = styled.div`
    background: white;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    transition: 0.3s;
    width: auto;
    margin: 30px -1px 0px;
    clear: both;
`;

const Follower = () => {
    const dispatch = useDispatch();
    const { followerList, hasMoreFollower } = useSelector(state => state.user);

    //팔로워 정보 더 가져오기
    const loadMoreFollowers = useCallback(() => {
        dispatch({
            type: LOAD_FOLLOWERS_REQUEST,
            offset: followerList.length,
        });
    }, [followerList.length]);

    //팔로워 삭제
    const onRemoveFollower = useCallback(userId => () => {
        dispatch({
            type: REMOVE_FOLLOWER_REQUEST,
            data: userId,
        });
    }, []);

    return (
        <CardWrapper>
            <FollowList
                header="팔로워 목록"
                hasMore={hasMoreFollower}
                onClickMore={loadMoreFollowers}
                data={followerList}
                onClickStop={onRemoveFollower}
            />
        </CardWrapper>
    );
};

Follower.getInitialProps = async (context) => {
    const state = context.store.getState();

    context.store.dispatch({
        type: LOAD_FOLLOWERS_REQUEST,
        data: state.user.me && state.user.me.id,
    });
};

export default Follower;
