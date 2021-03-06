import React from 'react';
import Slider from 'react-slick';
import { backUrl } from '../config/config';
import styled from 'styled-components';

import { Player } from 'video-react';

const SliderWrap = styled(Slider)`
    z-index: 50;

    .slick-prev {
        z-index: 100;
        left: 10px;
    }

    .slick-next {
        z-index: 100;
        right: 10px;
    }

    .slick-next::before,
    .slick-prev::before {
        color: #f5f5f5;
    }

    .video-react-big-play-button {
        display: none;
    }
`;

const PostImages = ({ images }) => {

    return (
    <>
        <SliderWrap
            dots={true}
            infinite={true}
            speed={500}
            slidesToShow={1}
            slidesToScroll={1}
            adaptiveHeight={true}
        >
            {
                images.map((v) => {
                    //확장자
                    const fileExtension = v.src.slice(v.src.lastIndexOf(".")+1).toLowerCase();

                    return (
                         fileExtension !== 'mp4' && fileExtension !== 'mp3' ?
                            <div 
                                key={v.id}
                            >
                                <img
                                    src={process.env.NODE_ENV !== 'production' ? `${backUrl}/${v.src}` : `${v.src.replace(/original\//, 'thumb/')}`} 
                                    style={{
                                        objectFit: 'fill',
                                        minWidth: '100%',
                                        minHeight: '500px',
                                        maxWidth: '100%',
                                        maxHeight: '500px',
                                        width: 'auto',
                                        height: 'auto',
                                    }}
                                />
                            </div>
                            :
                            <div key={v.id}>
                                <Player
                                    playsInline
                                    src={process.env.NODE_ENV !== 'production' ? `${backUrl}/${v.src}` : `${decodeURI(v.src)}`}
                                >
                                </Player>
                            </div>
                    );
                })
            }
        </SliderWrap>
    </>
    );
};

export default PostImages;