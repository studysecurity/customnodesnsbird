import React from 'react';
import { useSelector } from 'react-redux';
import { Empty } from 'antd';
import PostCard from '../containers/PostCard';
import { LOAD_SINGLE_POST_REQUEST } from '../reducers/post';

const SinglePost = () => {
    const { mainPosts } = useSelector(state => state.post); 

    return (
        <div style={{marginTop: '30px'}}>
            {
                mainPosts.length !== 0 ?
                <PostCard post={mainPosts} />
                :
                <Empty />
            }
        </div>
    );
};

SinglePost.getInitialProps = async (context) => {
    const singlePostId = parseInt(context.query.id, 10);
    // console.log('Single Post getInitialProps : ', singlePostId);

    context.store.dispatch({
        type: LOAD_SINGLE_POST_REQUEST,
        data: singlePostId,
    });
    return { singlePostId };
};

export default SinglePost;