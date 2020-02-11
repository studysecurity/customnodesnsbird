import React from 'react';
import styled from 'styled-components';
import { Card, Avatar } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRetweet, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { faHeart, faCommentDots } from '@fortawesome/free-regular-svg-icons';

const CardWrapper = styled.div`
    /* border: solid 1px #CCEEFF;  */
    /* padding: 0 10px; */
    /* margin-top: 150px; */
    z-index: 1;
`;

const PostCard = () => {
    
    
    return (
        <CardWrapper>
            <Card
                cover={
                    <img
                      alt="example"
                      src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                    />
                }

                actions={[
                    <FontAwesomeIcon icon={faRetweet} />,
                    <FontAwesomeIcon icon={faHeart} />,
                    <FontAwesomeIcon icon={faCommentDots} />,
                    <FontAwesomeIcon icon={faEllipsisH} />
                ]}
            >
                <span style={{ float: 'right' }}>{"2020.02.08"}</span>
                <Card.Meta
                    avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                    title="게시물 제목"
                    description="설명"
                />
            </Card>
            <Card
                cover={
                    <img
                      alt="example"
                      src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                    />
                }

                actions={[
                    <FontAwesomeIcon icon={faRetweet} />,
                    <FontAwesomeIcon icon={faHeart} />,
                    <FontAwesomeIcon icon={faCommentDots} />,
                    <FontAwesomeIcon icon={faEllipsisH} />
                ]}
            >
                <span style={{ float: 'right' }}>{"2020.02.08"}</span>
                <Card.Meta
                    avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                    title="게시물 제목"
                    description="설명"
                />
            </Card>
            <Card
                cover={
                    <img
                      alt="example"
                      src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                    />
                }

                actions={[
                    <FontAwesomeIcon icon={faRetweet} />,
                    <FontAwesomeIcon icon={faHeart} />,
                    <FontAwesomeIcon icon={faCommentDots} />,
                    <FontAwesomeIcon icon={faEllipsisH} />
                ]}
            >
                <span style={{ float: 'right' }}>{"2020.02.08"}</span>
                <Card.Meta
                    avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                    title="게시물 제목"
                    description="설명"
                />
            </Card>
        </CardWrapper>
    );
};

export default PostCard;