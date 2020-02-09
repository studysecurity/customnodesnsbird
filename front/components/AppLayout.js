import React, { useEffect, useState } from 'react';
import { Col, Row, Menu, Input, Layout } from 'antd';
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
import SideMenu from './SidMenu';
import PostForm from '../containers/PostForm';
import PostCard from '../containers/PostCard';

const IntroWraper = styled.div`
    min-width: 360px;
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
    const { Header, Footer, Content, Sider } = Layout;

    const onSearch = (() => {

    });

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
              <Row type="flex" style={{zIndex: 2,marginBottom: '10px', width: '100%', height: '77px', top: 0, borderBottom: '1px solid #CCEEFF' }}>
                <Col md={24} >
                  <div style={{maxWidth: '975px', height: '77px', margin: '0 auto', display: 'flex'}}>
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
                      <FontAwesomeIcon icon={faHeart} size="2x" style={{marginRight: '25px', color: 'red'}}/>
                      <FontAwesomeIcon icon={faUser} size="2x" />
                    </div>
                  </div>
                </Col>
              </Row>
              <Row gutter={20} style={{zIndex: 1, marginLeft: '0px', marginRight: '0px'}}>
                <Col md={6}>
                  <SideMenu />
                </Col>
                <Col md={12} >
                  <PostForm />
                  <hr style={{border: 'solid 5px rgb(230, 236, 240)', marginBottom: '2px', }} />
                  <PostCard />
                </Col>
                <Col md={6} >
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
                            <Row type="flex" align="middle" style={{height: '100%', backgroundColor: '#40E0D0'}}>
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