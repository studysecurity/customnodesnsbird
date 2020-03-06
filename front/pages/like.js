import React, { useRef, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux'; 
import PostCard from '../containers/PostCard';
import { Empty } from 'antd';
import { LOAD_LIKE_POSTS_REQUEST } from '../reducers/post';

const Like = () => {
    const dispatch = useDispatch();
    const { mainPosts, hasMorePost} = useSelector(state => state.post);

    //infinite scroll paging
    const likecountRef = useRef([]);

    const onScroll = useCallback(() => {
        if (window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 600) {
            // console.log('hashtag.js lastId ê°’ : ', mainPosts[mainPosts.length - 1]);
            if (hasMorePost) {
                const lastId = mainPosts[mainPosts.length - 1] && mainPosts[mainPosts.length - 1].id;
                // console.log('front lastId ? : ', lastId);
                if(!likecountRef.current.includes(lastId)) {
                    dispatch({
                        type: LOAD_LIKE_POSTS_REQUEST,
                        lastId,
                    });
                    likecountRef.current.push(lastId);
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

Like.getInitialProps = async (context) => {
    context.store.dispatch({
        type: LOAD_LIKE_POSTS_REQUEST,
    });
};

export default Like;