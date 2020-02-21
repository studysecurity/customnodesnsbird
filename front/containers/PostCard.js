import React, { memo } from 'react';
import styled from 'styled-components';
import { Card, Avatar } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRetweet, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { faHeart, faCommentDots } from '@fortawesome/free-regular-svg-icons';
import Slider from 'react-slick';

const CardWrapper = styled.div`
    /* border: solid 1px #CCEEFF;  */
    /* padding: 0 10px; */
    /* margin-top: 150px; */
    /* z-index: 1; */
`;

const PostCard = memo(({ post }) => {
    
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    return (
        <CardWrapper>
            <Card
                cover={
                <Slider
                    dots={true}
                    infinite={true}
                    arrows
                    speed={500}
                    slidesToShow={1}
                    slidesToScroll={1}
                >
                    <div>
                    <h3>1</h3>
                    </div>
                    <div>
                    <h3>2</h3>
                    </div>
                    <div>
                    <h3>3</h3>
                    </div>
                    <div>
                    <h3>4</h3>
                    </div>
                    <div>
                    <h3>5</h3>
                    </div>
                    <div>
                    <h3>6</h3>
                    </div>
              </Slider>
                }
                // cover={post.Images && post.Images[0]}
                actions={[
                    <FontAwesomeIcon key="retweet" icon={faRetweet} />,
                    <FontAwesomeIcon key="heart" icon={faHeart} />,
                    <FontAwesomeIcon key="dots" icon={faCommentDots} />,
                    <FontAwesomeIcon key="eslipsisH" icon={faEllipsisH} />
                ]}
            >
                <span style={{ float: 'right' }}>{"2020.02.08"}</span>
                <Card.Meta
                    avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                    description={post.content}
                />
            </Card>
        </CardWrapper>
    );
});

export default PostCard;