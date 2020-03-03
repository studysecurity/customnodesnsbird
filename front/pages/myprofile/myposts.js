import React from 'react';
import { useDispatch, useSelector } from 'react-redux'; 

const Myposts = () => {
    const dispatch = useDispatch();
    const { mainPosts } = useSelector(state => state.post);

    return (
        <>
        </>
    );
};

Myposts.getInitialProps = async (context) => {
    const state = context.store.getState();

    context.store.dispatch({
        type: 
        data: state.user.me && state.user.me.id,
    });
};

export default Myposts;