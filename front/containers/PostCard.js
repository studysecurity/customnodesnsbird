import React, { memo, useCallback, useState } from 'react';
import styled from 'styled-components';
import { Card, Avatar, Popover, Button, Modal } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRetweet, faEllipsisH, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { faHeart, faCommentDots } from '@fortawesome/free-regular-svg-icons';
import PostImages from '../components/PostImages';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { REMOVE_POST_REQUEST } from '../reducers/post';
import Hashtag from '../components/Hashtag';

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
    //모달창
    const [visible, setVisible] = useState(false);

    console.log('PostCard의 post 값 : ', post);

    //게시글 삭제
    const onRemovePost = useCallback(postId => () => {
        dispatch({
            type: REMOVE_POST_REQUEST,
            data: postId,
        });
    });

    //모달 창
    const showModal = useCallback(() => {
        setVisible(true);
    }, []);

    const handleCancel = useCallback(() => {
        setVisible(false);
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
                    <FontAwesomeIcon key="heart" icon={faHeart} />,
                    <FontAwesomeIcon key="dots" icon={faCommentDots} />,
                    <Popover
                        key="ellipsis"
                        content={(
                            <Button.Group>
                                {
                                    id && post.UserId === id ? 
                                        (
                                            <>
                                                {/* <Button>수정</Button> */}
                                                <Button type="danger" onClick={onRemovePost(post.id)}>삭제</Button>
                                            </>
                                        )
                                        : <Button>신고</Button>
                                }
                            </Button.Group>
                        )}
                    >
                        <FontAwesomeIcon key="eslipsisH" icon={faEllipsisH} />
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
                       좋아요 ~개 혹은 조회 ~회
                </span>
            </div>
            <div style={{marginTop: '15px'}}>
                <Hashtag hashtag={post.Hashtags} />
            </div>
            </Card>
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
    </>
    );
});

export default PostCard;