import React, { useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { LOAD_HASHTAG_POSTS_REQUEST } from '../reducers/post';
import { Empty } from 'antd';
import PostCard from '../containers/PostCard';

const Hashtag = ({ tag }) => {
    const dispatch = useDispatch();
    const { mainPosts, hasMorePost } = useSelector(state => state.post);

    //infinite scroll paging
    const hashcountRef = useRef([]);

    const onScroll = useCallback(() => {
        if (window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 600) {
            // console.log('hashtag.js lastId 값 : ', mainPosts[mainPosts.length - 1]);
            if (hasMorePost) {
                const lastId = mainPosts[mainPosts.length - 1] && mainPosts[mainPosts.length - 1].id;
                // console.log('front lastId ? : ', lastId);
                if(!hashcountRef.current.includes(lastId)) {
                    dispatch({
                        type: LOAD_HASHTAG_POSTS_REQUEST,
                        lastId,
                        data: tag,
                    });
                    hashcountRef.current.push(lastId);
                }
            }
        }
    }, [hasMorePost, mainPosts.length]);
    
    useEffect(() => {
        window.addEventListener('scroll', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
        };
    }, [mainPosts.length]);

    return (
        <div style={{marginTop: '30px'}}>
            {
                mainPosts.length !== 0 ?
                    mainPosts.map((c, i) => (
                        <PostCard key={i} post={c} />
                    ))
                    :
                    <Empty />
            }
        </div>
    );
};

Hashtag.propTypes = {
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