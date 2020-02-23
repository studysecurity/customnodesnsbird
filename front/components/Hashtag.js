import React from 'react';
import styled from 'styled-components';

const TagWrap = styled.span`
    border-radius: 50%;
    background-color: #87cefa;
    padding: 5px 5px;
    color: white;
    font-weight: bold;
    margin-right: 5px;
`;

const Hashtag = ({ hashtag }) => {
    return (
        <>
            {
                hashtag.map((v) => {
                    return(
                        <TagWrap>
                            #{v.tagName}
                        </TagWrap>    
                    )
                })
            }
        </>
    );
};

export default Hashtag;