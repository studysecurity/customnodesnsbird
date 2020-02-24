import React from 'react';
import Slider from 'react-slick';
import { backUrl } from '../config/config';
import styled from 'styled-components';

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
        >
            {
                images.map((v) => {
                    return (
                        <div key={v.id}>
                            <img
                                src={`${backUrl}/${v.src}`} 
                                style={{
                                    objectFit: 'fill',
                                    minWidth: '100%',
                                    minHeight: '300px',
                                    maxWidth: '100%',
                                    maxHeight: '300px',
                                    width: '100%',
                                    height: '100%',
                                }}
                            />
                        </div>
                    );
                })
            }
        </SliderWrap>
    </>
    );
};

export default PostImages;