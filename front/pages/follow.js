import React, { useCallback, useEffect } from 'react';
import Router from 'next/router';
import { Button, Empty } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { LOAD_FOLLOWLIST_REQUEST, FOLLOW_USER_REQUEST } from '../reducers/user';
import { useDispatch, useSelector } from 'react-redux';


const Follow = () => {
    const dispath = useDispatch();
    const { loadFollowList, me } = useSelector(state => state.user);

    const onFollow = useCallback(userId => () => {
        // console.log('onFollow 클릭');
        //여기서 userId 값은 팔로우를 받은 유저의 아이디 값임 이 값으로 이 유저에게 팔로우를 걸거임.
        // console.log('userId 값 : ', userId);
        dispath({
            type: FOLLOW_USER_REQUEST,
            data: userId, 
        });
    }, []);

    const onUnFollow = useCallback(() => {
        // console.log('onUnFOllow 클릭');
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
                            // console.log('값값 : ',loadFollowList),
                            // console.log('me 값 : ', me)
                            return (
                                <div key={i} style={{padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                    <FontAwesomeIcon icon={faUserCircle} style={{ height: '44px', width: '44px'}}/>
                                    <div style={{width: '80%', fontWeight: 'bold', marginLeft: '20px'}}>
                                        <span>{c.userNick}</span>
                                    </div>
                                    <div>
                                        {
                                            c.Followers && c.Followers.find(v => v.id === me.id) 
                                            ? <Button onClick={onUnFollow} type="primary" style={{float: 'right'}}>팔로잉</Button> 
                                            : <Button onClick={onFollow(c.id)} type="primary" style={{float: 'right'}}>팔로우</Button>
                                        }
                                    </div>
                                </div>
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
    context.store.dispatch({
        type: LOAD_FOLLOWLIST_REQUEST,
    });
};

export default Follow;