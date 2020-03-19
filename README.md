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
| :----: | :---- |
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
| express | 웹 프레임워크 |
| express-session | 세션 |


   
  
