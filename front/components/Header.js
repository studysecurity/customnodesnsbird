import React, { useCallback } from 'react';
import Link from 'next/link';
import { Input } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUser, 
} from '@fortawesome/free-solid-svg-icons';
import { faHeart, faCompass } from '@fortawesome/free-regular-svg-icons';

const Header = () => {

    //??
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
                <Link href="/follow">
                    <a style={{color :'inherit'}}>
                        <FontAwesomeIcon icon={faCompass} size="2x" style={{marginRight: '25px'}}/>
                    </a>
                </Link>
                <Link href="/follow">
                    <a style={{color : 'inherit'}}>
                        <FontAwesomeIcon icon={faHeart} size="2x" style={{marginRight: '25px'}}/>
                    </a>
                </Link>
                <FontAwesomeIcon icon={faUser} size="2x" />
            </div>
        </div>
    );
};

export default Header;