import React from 'react';
import PropTypes from 'prop-types';
import { LOAD_HASHTAG_POSTS_REQUEST } from '../reducers/post';
import { useDispatch, useSelector } from 'react-redux';
import { Empty } from 'antd';

const Hashtag = ({ tag }) => {
    const dispatch = useDispatch();
    const { mainPosts } = useSelector(state => state.post);

    return (
        <div style={{marginTop: '30px'}}>
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

Hashtag.prototype = {
    tag: PropTypes.string.isRequired,
};

Hashtag.getInitialProps = async (context) => {
    const tag = context.query.tag;
    // console.log('hashtag getInitialProps : ', tag);
    context.store.dispatch({
        type: LOAD_HASHTAG_POSTS_REQUEST,
        data: tag,
    });
    return { tag }; 
};

export default Hashtag;