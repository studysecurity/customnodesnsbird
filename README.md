NODESNSBIRD (SNS)
-------------------------------------------------------


Technology && Tool
-------------------------------------------------------
* Language & Framework : React.js, Express.js, Next.js, Node.js, Sequelize, Redux.js
* Database : Mysql, AWS S3
* Work tools : Visual Studio Code
* Server : AWS ec2


주요기능(main Function)
-------------------------------
* 회원가입/로그인
* 게시글(전체공개용) / 팔로우한 사람만 볼 수 있는 게시글(친구만 공개) / 나만 볼 수 있는 게시글(나만 공개)
* 게시글 업로드(이미지, 동영상) 및 수정 및 삭제 
* 좋아요 기능
* 댓글 기능
* 태그 검색 및 태그별 게시글 모아보기
* 게시글 이동


폴더 구조(Folder Structure)
----------------------------
* 백엔드(Back-end)
  * config : Sequelize 환경 설정
  * models : Sequelize DB 테이블 구성
  * passport : 로그인 기능
  * routes : RESTAPI
  * uploads : local 파일 업로드 폴더(실제 서비스 사용시 AWS S3로 대체됩니다.)
  
* 프론트엔드 (Front-end)
  * components : 재사용 컴포넌트
  * config : Back-end 통신 URL 환경 설정
  * containers : 리듀서 통신을 하는 컴포넌트
  * pages : 페이지
  * reducers : action(동작)
  * sagas : Back-end 통신
  
* lambda : AWS S3 업로드시 이미지 리사이징


## 패키지(Package)
| 모듈 | 역할 |
| :---- | :---- |
| fortawesome/fontawesome-svg-core | 아이콘 라이브러리 |
| fortawesome/free-brands-svg-icons | 아이콘 라이브러리 |
| fortawesome/free-regular-svg-icons | 아이콘 라이브러리 |
| fortawesome/free-solid-svg-icons | 아이콘 라이브러리 |
| fortawesome/react-fontawesome | 아이콘 라이브러리 |
| next/bundle-analyzer | 웹팩 파일 크기의 시각화 |
| zeit/next-css | next의 stylesheet css 추가 |
| antd | ant-design |
| axios | 통신 라이브러리 |
| compression-webpack-plugin | 웹팩 압축 |
| cookie-parser | 쿠키 분석 라이브러리 |
| cross-env | 다양한 OS의 다른 환경변수 설정과는 상관없이 동일한 환경변수 설정 제공 |
| dotenv | 환경 설정 내용 파일 |
| express-session | 세션 |
| greenlock-express | HTTPS 자동 갱신 |
| immer | 객체의 불변성 유지 값을 쉽게 업데이트 하는 기능 제공 |
| moment | 시간 Format 형식 쉽게 사용 |
| morgan | 로깅 |
| next-redux-saga | next redux saga |
| next-redux-wrapper | next redux saga 사용에 필요한 redux 저장소용 |
| prop-types | props type 체크 |
| react-dom | React의 Dom 및 서버 렌더러에 진입점 역할 |
| react-helmet | 문서의 head 역할(봇이 무슨 사이트인지 파악하는데 사용) |
| react-redux | react redux |
| react-slick | 이미지 및 동영상 슬라이더 |
| react-tagsinput | 태그 라이브러리 |
| react-video-thumbnail | 동영상 썸네일 이미지 표시 라이브러리 |
| redirect-https | http -> https 전환 |
| redux | redux |
| redux-saga | redux saga |
| styled-components | custom css 라이브러리 |
| video-react | 동영상 라이브러리 |







   
  
