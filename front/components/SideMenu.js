import React from 'react';
import { Menu } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChalkboard } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

const SideMenu = () => {

    return (
        <Menu
        style={{ 
          width: '100%',
          height: '100vh',
          borderRight: '1px solid #E2E2E2',
        }}
        mode="inline"
        >
        <Menu.SubMenu
          key="sub4"
          title={
            <span>
              <span style={{fontWeight: 'bold'}}>MENU</span>
            </span>
          }
        >
          <Menu.Item key="1">
            <FontAwesomeIcon icon={faChalkboard} style={{marginRight: '20px'}}/>
            <div style={{display: 'inline-block'}}>
              <Link href="/board">
                <a style={{color: 'inherit'}}>
                  자유 게시판
                </a>
              </Link>
            </div>
          </Menu.Item>
        </Menu.SubMenu>
      </Menu>
    );
};

export default SideMenu;