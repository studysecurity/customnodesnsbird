import React, { useCallback } from 'react';
import { Button, Empty } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { LOAD_FOLLOWLIST_REQUEST } from '../reducers/user';
import { useDispatch, useSelector } from 'react-redux';


const Follow = () => {
    const dispath = useDispatch();
    const { loadFollowList } = useSelector(state => state.user);

    const onFollow = useCallback(() => {

    }, []);

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
                        console.log(loadFollowList),
                        loadFollowList.map(c => {
                            return (
                                <div style={{padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                    <FontAwesomeIcon icon={faUserCircle} style={{ height: '44px', width: '44px'}}/>
                                    <div style={{width: '80%', fontWeight: 'bold', marginLeft: '20px'}}>
                                        <span>{c.userNick}</span>
                                    </div>
                                    <div>
                                        <Button onClick={onFollow} type="primary" style={{float: 'right'}}>팔로우</Button>
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