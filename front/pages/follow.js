import React, { useCallback, useEffect } from 'react';
import Router from 'next/router';
import { Empty } from 'antd';
import { 
    LOAD_FOLLOWLIST_REQUEST, 
    FOLLOW_USER_REQUEST,
    LOAD_FOLLOWINGS_REQUEST,
    UNFOLLOW_USER_REQUEST, 
} from '../reducers/user';
import { useDispatch, useSelector } from 'react-redux';
import FollowCard from '../components/FollowCard';


const Follow = () => {
    const dispath = useDispatch();
    const { loadFollowList, me } = useSelector(state => state.user);

    const onFollow = useCallback(userId => () => {
        console.log('onFollow 클릭');
        //여기서 userId 값은 팔로우를 받은 유저의 아이디 값임 이 값으로 이 유저에게 팔로우를 걸거임.
        console.log('onFollow userId 값 : ', userId);
        dispath({
            type: FOLLOW_USER_REQUEST,
            data: userId, 
        });
    }, []);

    const onUnFollow = useCallback(userId => () => {
        console.log('onUnFOllow 클릭');
        console.log('onUnFollow userId 값 : ', userId);

        dispath({
            type: UNFOLLOW_USER_REQUEST,
            data: userId,
        });
    }, []);

    //메인 화면으로 이동 (안그러면 follow 링크 그대로 남아있어서 이상하게 나옴)
    useEffect(() => {
        if(!me) {
            Router.push('/');
        }
    }, [me]);

    return (
        <>
            <div>
                <h4 style={{fontWeight: 'bold', marginTop: '20px'}}>팔로우</h4>
            </div>
            <div style={{backgroundColor: '#F3F0F0'}}>
            {
                loadFollowList.length === 0 ? 
                (
                    <>
                        <Empty />
                    </>
                )
                :
                (
                <>
                    {
                        loadFollowList.map((c, i) => {
                            return (
                                <FollowCard key={i} followList={c} onFollow={onFollow} onUnFollow={onUnFollow} />
                            );
                        })
                    }
                </>
                )
            }

            </div>
        </>
    );
};

Follow.getInitialProps = async (context) => {
    // console.log(Object.keys(context));
    //팔로우할 유저의 목록들을 가져온다.
    context.store.dispatch({
        type: LOAD_FOLLOWLIST_REQUEST,
    });

    //me에 팔로잉 목록들을 가져온다. me의 팔로잉의 아이디 값과 팔로우 유저의 
    //아이디 값이 같으면 me가 팔로우한 대상임을 판별
    context.store.dispatch({
        type: LOAD_FOLLOWINGS_REQUEST,
    });
};

export default Follow;