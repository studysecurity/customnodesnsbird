import React from 'react';
import styled from 'styled-components';

const TagWrap = styled.span`
    border-radius: 50%;
    background-color: #87cefa;
    padding: 5px 5px;
    color: white;
    font-weight: bold;
    margin-right: 5px;
    word-wrap: break-word;
`;

const Hashtag = ({ hashtag }) => {
    return (
        <>
            {
                hashtag.map((v) => {
                    return(
                    <div key={v.id} style={{display: 'inline-block', marginTop: '10px'}}> 
                        <TagWrap>
                            #{v.tagName}
                        </TagWrap>    
                    </div>
                    )
                })
            }
        </>
    );
};

export default Hashtag;