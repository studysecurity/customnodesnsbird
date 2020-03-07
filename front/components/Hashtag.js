import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

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
                        <Link
                            href={{ pathname: '/hashtag', query: { tag: v.tagName }}}
                            as={`/hashtag/${v.tagName}`}
                            key={v.id}
                        >
                            <a>
                                <div style={{display: 'inline-block', marginTop: '10px'}}> 
                                    <TagWrap>
                                        #{v.tagName}
                                    </TagWrap>    
                                </div>
                            </a>
                        </Link>
                    )
                })
            }
        </>
    );
};

export default Hashtag;