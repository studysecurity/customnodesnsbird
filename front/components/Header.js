import React, { useCallback } from 'react';
import Link from 'next/link';
import { Input } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUser, 
} from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';

const Header = () => {

    //검색
    const onSearch = useCallback({

    }, []);

    return (
        <div style={{borderBottom: '1px solid #E2E2E2' ,backgroundColor: 'white', height: '77px', margin: '0 auto', display: 'flex'}}>
            <div style={{width: '33.3%', margin: 'auto 0', textAlign: 'center'}}>
                <Link href="/">
                <a style={{fontWeight: 'bold', fontStyle: 'italic', fontSize: '17px'}}>
                    NodeSNSBird
                </a>
                </Link>
            </div>
            <div style={{width: '33.3%', margin: 'auto 0', textAlign: 'center'}}>
            <Input.Search
                enterButton
                style={{ verticalAlign: 'middle'}}
                onSearch={onSearch}
            />
            </div>
            <div style={{width: '33.3%', margin: 'auto 0', textAlign: 'center'}}>
                <FontAwesomeIcon icon={faHeart} size="2x" style={{marginRight: '25px'}}/>
                <FontAwesomeIcon icon={faUser} size="2x" />
            </div>
        </div>
    );
};

export default Header;