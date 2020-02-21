import React, { useEffect, useState } from 'react';
import { Col, Row } from 'antd';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faUserFriends, 
  faComment, 
  faUser, 
  faHeart, 
  faDove,
  faHome,
} from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import UserProfile from '../containers/UserProfile';
import SideMenu from './SideMenu';
import Header from '../components/Header';
import { LOAD_USER_REQUEST } from '../reducers/user';
import Router from 'next/router';

const IntroWraper = styled.div`
    min-width: 360px;
`;

const HeaderRow = styled.div`
    /* margin-Bottom: 10px; */
    width: 100%; 
    height: 77px; 
    top: 0; 
    left: 0;
    position: fixed;
    z-index: 100;
`;
const useWindowSize = () => {
    const isClient = typeof window === 'object';

    const getSize = () => {
        return {
            width: isClient ? window.innerWidth : undefined,
            height: isClient ? window.innerHeight : undefined
        };
    }

    const [windowSize, setWindowSize] = useState(getSize);

    useEffect(() => {
        if (!isClient) {
            return false;
        }

        const handleResize = () => {
            setWindowSize(getSize());
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowSize;
}



const AppLayout = ({children}) => {
    //반응형 디바이스 가로 크기 측정 
    const size = useWindowSize();
    const dispatch = useDispatch();
    const { me } = useSelector(state => state.user);

    // console.log('AppLayout 값 : ', me);

    return (
      <>
        { 
          me ? 
          (
            <IntroWraper>
            {
              size.width < 768 ?
              (
              <>
              <Row style={{height: '45px', width: '100%', position: 'fixed', borderBottom: '1px solid #87CEFA'}}>
                <Col md={24}>
                  <div style={{height: '45px',  display: 'flex'}}>
                    <FontAwesomeIcon icon={faDove} style={{color: '#87CEFA', margin: 'auto 10'}} size="2x"/>
                    <Link href="/">
                      <a style={{fontWeight: 'bold', fontStyle: 'italic', fontSize: '17px', margin: 'auto 0'}}>
                        NodeSNSBird
                      </a>
                    </Link>
                  </div>
                </Col>
              </Row>
              <Row style={{top: '45px', bottom: '45px', width: '100%'}}>
                <Col md={24}>
                  본문 내용
                  {/* 나중에 손봐야함*/}
                </Col>
              </Row>
              <Row type="flex" style={{height: '45px', position: 'fixed', bottom: '0', width: '100%', borderTop: '1px solid #87CEFA'}}>
                <Col md={6} span={6} style={{margin: 'auto auto', textAlign: 'center'}}>
                  <FontAwesomeIcon icon={faHome} size="2x" />
                </Col>
                <Col md={6} span={6} style={{margin: 'auto auto', textAlign: 'center'}}>
                  <FontAwesomeIcon icon={faSearch} size="2x"/>
                </Col>
                <Col md={6} span={6} style={{margin: 'auto auto', textAlign: 'center'}}>
                  <FontAwesomeIcon icon={faHeart} size="2x"/>
                </Col>
                <Col md={6} span={6} style={{margin: 'auto auto', textAlign: 'center'}}>
                  <FontAwesomeIcon icon={faUser} size="2x"/>
                </Col>
              </Row>
              </>
              ) 
              : 
              (
              <>
              <HeaderRow >
                <Col md={24} >
                  <Header />
                </Col>
              </HeaderRow>
              <Row gutter={20} style={{zIndex: '50' ,top: '77px', marginLeft: '0px', marginRight: '0px'}}>
                <Col md={6} style={{position: 'fixed', paddingTop: '5px'}}>
                  <SideMenu />
                </Col>
                <Col md={12} style={{left: '25%'}}>
                  {children}
                </Col>
                <Col md={6} style={{position: 'fixed', left: '75%', paddingTop: '5px'}}>
                  <UserProfile /> 
                </Col>
              </Row>
              </>
              )
            }
            </IntroWraper>
          )
          :
          (
            <IntroWraper>
                <Row type="flex" style={{height: '100vh'}}>
                    {
                      size.width < 768 ? 
                      (
                        <>
                          <Col xs={24} sm={24} >
                            <Row type="flex" align="middle" style={{height: '100%'}}>
                              <Col xs={24} sm={24}>
                                {children}
                              </Col>
                            </Row>
                          </Col>
                        </>
                      )
                      :
                      (
                      <>
                        <Col md={12} lg={12} xl={12} xxl={12} style={{backgroundColor: '#40E0D0'}}>
                            <Row type="flex" align="middle" style={{height: '100%'}}>
                              <Col md={24} lg={24} xl={24} xxl={24}>
                                <div style={{color: 'white', fontSize: '25px', margin: '0 auto', width: '80%'}}>
                                  <div style={{marginBottom: '25px'}}> 
                                    <FontAwesomeIcon icon={faSearch} />
                                    <span style={{marginLeft: '15px'}}>관심사를 팔로우하세요.</span>
                                  </div>
                                  <div style={{marginBottom: '25px'}}>
                                    <FontAwesomeIcon icon={faUserFriends} />
                                    <span style={{marginLeft: '15px'}}>
                                      사람들이 무엇에 대해 이야기하고 있는지 알아보세요.
                                    </span>
                                  </div>
                                  <div>
                                    <FontAwesomeIcon icon={faComment} />
                                    <span style={{marginLeft: '15px'}}>대화에 참여하세요.</span>
                                  </div>
                                </div>
                              </Col>
                            </Row>
                        </Col>
                        <Col md={12} lg={12} xl={12} xxl={12} >
                          <Row type="flex" align="middle" style={{height: '100%'}}>
                            <Col md={24} lg={24} xl={24} xxl={24} >
                              {children}
                            </Col>
                          </Row>
                        </Col>
                      </>
                      )
                    }
                </Row> 
            </IntroWraper>
          )
        }
      </>
    );
}

export default AppLayout;
