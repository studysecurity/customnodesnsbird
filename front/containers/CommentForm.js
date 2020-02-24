import React, { useCallback, useState, useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { ADD_COMMENT_REQUEST } from '../reducers/post';

const CommentForm = ({post}) => {
    const dispatch = useDispatch();
    const [commentText, setCommentText] = useState('');
    const { commentAdded, isAddingComment } = useSelector(state => state.post);

    //등록
    const onSubmitComment = useCallback((e) => {
        e.preventDefault();

        return dispatch({
            type: ADD_COMMENT_REQUEST,
            data: {
                postId: post.id,
                content: commentText,
            },
        });
    }, [commentText]);

    useEffect(() => {
        setCommentText('');
    }, [commentAdded === true]);

    //게시글 입력부분
    const onChangeCommentText = useCallback((e) => {
        setCommentText(e.target.value);
    }, []);

    return (
        <Form onSubmit={onSubmitComment}>
            <Form.Item>
                <Input.TextArea rows={4} value={commentText} onChange={onChangeCommentText} style={{width: '90%'}}/>
                <Button type="primary" htmlType="submit" loading={isAddingComment} style={{width: '10%', height: '98px'}}>댓글</Button>
            </Form.Item>
        </Form>
    );
};

CommentForm.PropTypes = {
    post: PropTypes.object.isRequired,
};

export default CommentForm;