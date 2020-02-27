import React, { memo, useCallback, useState } from 'react';
import styled from 'styled-components';
import { Card, Avatar, Popover, Button, Modal, List } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRetweet, faEllipsisH, faUserCircle, faHeart } from '@fortawesome/free-solid-svg-icons';
import { faCommentDots } from '@fortawesome/free-regular-svg-icons';
import PostImages from '../components/PostImages';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { 
    REMOVE_POST_REQUEST, 
    LIKE_POST_REQUEST, 
    UNLIKE_POST_REQUEST,
    LOAD_COMMENTS_REQUEST,
} from '../reducers/post';
import Hashtag from '../components/Hashtag';
import CommentForm from '../containers/CommentForm';
import PostForm from '../containers/PostForm';

const CardWrapper = styled.div`
    /* border: solid 1px #CCEEFF;  */
    /* padding: 0 10px; */
    /* margin-top: 150px; */
    /* z-index: 1; */
    background: white;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    transition: 0.3s;
    width: auto;
    margin: 0px -1px 40px;
    clear: both;
`;

const CardHeader = styled.div`
    border: 1px solid #e8e8e8;
    padding: 10px;
    display: flex;
    align-items: center;

    & > div:nth-child(2) {
        margin-left: 10px;
        width: 100%;
    }

    & span {
        font-weight: bold;
    }
`;

const CustomModal = styled(Modal)`
    .ant-modal-body {
        padding: 0px;
    }

    & span {
        font-weight: bold;
    }
`;

const PostCard = memo(({ post }) => {
    const dispatch = useDispatch();
    //유저의 아이디 인덱스 값
    const id = useSelector(state => state.user.me && state.user.me.id);
    //상단 모달창
    const [visible, setVisible] = useState(false);
    //글 수정 모달창
    const [modifyModal, setModifyModal] = useState(false);
    //좋아요
    const liked = id && post.Likers && post.Likers.find(v => v.id === id);
    //댓글
    const [commentFormOpened, setCommentFormOpened] = useState(false);
    //글 수정 모달을 가리는 popover을 없애기
    const [visiblePopover, setVisiblePopover] = useState(false);

    console.log('PostCard의 post 값 : ', post);


    //popover 창 제어
    const onChangePopover = useCallback(() => {
        setVisiblePopover(prev => !prev);
    }, []);

    //게시글 삭제
    const onRemovePost = useCallback(postId => () => {
        onChangePopover();
        dispatch({
            type: REMOVE_POST_REQUEST,
            data: postId,
        });
    }, []);

    //게시글 수정 모달창
    const onModifyPost = useCallback(() => {
        //글수정 모달 띄워주고 popover이 글 수정 모달을 덮어버리므로 지우기
        onChangePopover();
        //글수정 모달 보여주기
        setModifyModal(true);
    }, []);

    const onModifyPostCancel = useCallback(() => {
        setModifyModal(false);
    }, []);

    //상단 모달창
    const showModal = useCallback(() => {
        setVisible(true);
    }, []);

    const handleCancel = useCallback(() => {
        setVisible(false);
    }, []);

    //좋아요 기능
    const onToggleLike = useCallback(() => {
        if (liked) { //좋아요 누른 상태
            dispatch({
                type: UNLIKE_POST_REQUEST,
                data: post.id,
            });
        } else { //좋아요 안누른 상태   
            dispatch({
                type: LIKE_POST_REQUEST,
                data: post.id,
            });
        }
    }, [id, post && post.id, liked]);

    //댓글
    const onToggleComment = useCallback(() => {
        setCommentFormOpened(prev => !prev);
        if (!commentFormOpened) {
            dispatch({
                type: LOAD_COMMENTS_REQUEST,
                data: post.id,
            });
        }
    }, []);

    return (
    <>
        <CardWrapper>
            <CardHeader>
                <div>
                    <FontAwesomeIcon icon={faUserCircle} style={{ height: '30px', width: '30px'}}/>
                </div>
                <div>
                    <span>
                        {post.User.userNick}
                    </span>
                    <span style={{float: 'right'}}>
                        <FontAwesomeIcon 
                            key="eslipsisHHeader" 
                            icon={faEllipsisH} 
                            onClick={showModal}
                            style={{
                                cursor: 'pointer',
                            }}
                        />
                    </span>
                    <span style={{float: 'right', paddingRight: '15px'}}>
                        {moment(post.createdAt).format('YYYY.MM.DD HH:mm')}
                    </span>
                </div>
            </CardHeader>
            <Card
                cover={post.Images && <PostImages images={post.Images} />}
                actions={[
                    <FontAwesomeIcon key="retweet" icon={faRetweet} />,
                    <FontAwesomeIcon 
                        key="heart" 
                        icon={faHeart} 
                        onClick={onToggleLike}
                        style={liked ? {color: 'red'} : {color: 'none'}} 
                    />,
                    <FontAwesomeIcon key="dots" icon={faCommentDots} onClick={onToggleComment} />,
                    <Popover
                        key="ellipsis"
                        visible={visiblePopover}
                        content={(
                            <Button.Group>
                                {
                                    id && post.UserId === id ? 
                                        (
                                            <>
                                                <Button style={{color: '#adc6ff'}} onClick={onModifyPost}>수정</Button>
                                                <Button type="danger" onClick={onRemovePost(post.id)}>삭제</Button>
                                            </>
                                        )
                                        : <Button>신고</Button>
                                }
                            </Button.Group>
                        )}
                    >
                        <FontAwesomeIcon key="eslipsisH" icon={faEllipsisH} onClick={onChangePopover} />
                    </Popover>,
                ]}
            >
            <div>
                <span style={{fontWeight: 'bold'}}>
                    {post.content}
                </span>
            </div>
            <div style={{marginTop: '15px'}}>
                <span style={{fontWeight: 'bold'}}>
                    좋아요 {post.Likers.length.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}개
                </span>
            </div>
            <div style={{marginTop: '15px'}}>
                <Hashtag hashtag={post.Hashtags} />
            </div>
            </Card>
            {
                commentFormOpened && (
                    <>
                        <CommentForm post={post} />
                        <List
                            header={`${post.Comments ? post.Comments.length : 0} 댓글`}
                            itemLayout="horizontal"
                            dataSource={post.Comments || []}
                            renderItem={item => (
                                console.log('item 값 : ', item),
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                        title={item.User.userNick}
                                        description={item.content}
                                    />
                                </List.Item>
                            )}
                        />
                    </>
                )
            }
        </CardWrapper>

        <CustomModal
          centered={true}
          closable={false}
          visible={visible}
          footer={null}
        >
            <Button block={true}>
                <span>
                    팔로우 혹은 팔로우 취소
                </span>
            </Button>
            <Button block={true}>
                <span>
                    게시물로 이동
                </span>
            </Button>
            <Button block={true} onClick={handleCancel} type="danger">
                취소
            </Button>
        </CustomModal>

        <CustomModal
          centered={true}
          closable={false}
          visible={modifyModal}
          onOk={onModifyPostCancel}
          cancelText="수정"
          okText="취소"
        //   footer={null}
        >
        <div style={{padding: '10px'}}>
            <PostForm modifyPost={post} />
        </div>
        </CustomModal>
    </>
    );
});

export default PostCard;