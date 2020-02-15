import React, { memo } from 'react';
import { Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { useSelector} from 'react-redux';

const FollowCard = memo(({followList, onFollow, onUnFollow}) => {
    const { me } = useSelector(state => state.user);

    return (
        <div style={{padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <FontAwesomeIcon icon={faUserCircle} style={{ height: '44px', width: '44px'}}/>
            <div style={{width: '80%', fontWeight: 'bold', marginLeft: '20px'}}>
                <span>{followList.userNick}</span>
            </div>
            <div>
                {
                    me.Followings && me.Followings.find(v => v.id === followList.id)
                    ? <Button onClick={onUnFollow(followList.id)} type="primary" style={{float: 'right'}}>팔로잉</Button>
                    : <Button onClick={onFollow(followList.id)} type="primary" style={{float: 'right'}}>팔로우</Button>
                }
            </div>
        </div>
    );
});

export default FollowCard;

