import React, { useCallback } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import FollowList from '../../components/FollowList';
import { LOAD_FOLLOWINGS_REQUEST, UNFOLLOW_USER_REQUEST } from '../../reducers/user';

const CardWrapper = styled.div`
    background: white;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    transition: 0.3s;
    width: auto;
    margin: 30px -1px 0px;
    clear: both;
`;

const Following = () => {
    const dispatch = useDispatch();
    const { followingList, hasMoreFollowing } = useSelector(state => state.user);
    
    //팔로잉 정보 더 가져오기
    const loadMoreFollowings = useCallback(() => {
        dispatch({
            type: LOAD_FOLLOWINGS_REQUEST,
            offset: followingList.length,
        });
    }, [followingList.length]);

    //언팔로우
    const onUnfollow = useCallback(userId => () => {
        dispatch({
            type: UNFOLLOW_USER_REQUEST,
            data: userId,
        });
    }, []);

    return (
        <CardWrapper>
            <FollowList
                header="팔로잉 목록"
                hasMore={hasMoreFollowing}
                onClickMore={loadMoreFollowings}
                data={followingList}
                onClickStop={onUnfollow}
            /> 
        </CardWrapper>
    );
};

Following.getInitialProps = async (context) => {
    const state = context.store.getState();

    context.store.dispatch({
        type: LOAD_FOLLOWINGS_REQUEST,
        data: state.user.me && state.user.me.id,
    });
};

export default Following;