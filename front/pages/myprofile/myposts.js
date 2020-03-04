import React from 'react';
import { useSelector } from 'react-redux'; 
import { LOAD_USER_POSTS_REQUEST } from '../../reducers/post';
import PostCard from '../../containers/PostCard';
import { Empty } from 'antd';

const Myposts = () => {
    const { mainPosts } = useSelector(state => state.post);

    return (
        <div style={{marginTop: '20px'}}>
            {
            mainPosts.length !== 0 ? 
            mainPosts.map(c => (
                <PostCard key={c.id} post={c} />
            ))
            :
            <Empty />
            }
        </div>
    );
};

Myposts.getInitialProps = async (context) => {
    const state = context.store.getState();

    context.store.dispatch({
        type: LOAD_USER_POSTS_REQUEST,
        data: state.user.me && state.user.me.id,
    });
};

export default Myposts;