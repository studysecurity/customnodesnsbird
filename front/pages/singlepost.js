import React from 'react';
import { useSelector } from 'react-redux';
import { Empty } from 'antd';
import PostCard from '../containers/PostCard';
import { LOAD_SINGLE_POST_REQUEST } from '../reducers/post';
import Helmet from 'react-helmet';

const SinglePost = () => {
    const { mainPosts } = useSelector(state => state.post); 

    return (
    <>
        <Helmet
            title={`${mainPosts.User.userNick}님의 글`}
            description={mainPosts.content}
            meta={[{
                name: 'description', content: mainPosts.content,
            }, {
                property: 'og:title', content: `${mainPosts.User.userNick}님의 게시글`,
            }, {
                property: 'og:description', content: mainPosts.content,
            }, {
                property: 'og:image', content: mainPosts.Images[0] ? mainPosts.Images[0].src : 'https://nodesnsbird.ga/favicon.ico',
            }, {
                property: 'og:url', content: `https://nodesnsbird.ga/singlepost/${id}`,
            }]}
        />
        <div style={{marginTop: '30px'}}>
            {
                mainPosts.length !== 0 ?
                <PostCard post={mainPosts} />
                :
                <Empty />
            }
        </div>
    </>
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