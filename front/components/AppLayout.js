import React, { useEffect, useState } from 'react';
import { Col, Row } from 'antd';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUserFriends, faComment } from '@fortawesome/free-solid-svg-icons';

const IntroWraper = styled.div`
    min-width: 360px;
    
    /* @media only screen and (max-width: 767px) {
          position:absolute;
          top:0;
          left:0;
          background-size:100%;
          opacity: 1;
          z-index:-1;
          width:100%;
          height:100%;
          background: url(https://cdn.crowdpic.net/detail-thumb/thumb_d_8EDF1F0D1B8C702C289B5B9C52A7B384.jpeg);
          background-repeat: no-repeat;
          background-position: center center;
          background-size: cover;
    } */
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

    return (
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
    );
}

export default AppLayout;