import React, { memo, useCallback, useState, useEffect, useRef } from 'react';
import { Form, Input, Button, Select } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { 
    ADD_POST_REQUEST, 
    UPLOAD_IMAGES_REQUEST, 
    REMOVE_IMAGE,
    MODIFY_POST_REQUEST,
    MODIFY_LOAD_POST_IMAGES_CLEARED,
} from '../reducers/post';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faImage } from '@fortawesome/free-solid-svg-icons';

import TagsInput from 'react-tagsinput';
import styled from 'styled-components';
import { backUrl } from '../config/config';
import VideoThumbnail from 'react-video-thumbnail';

// const PostFormWrapper = styled.div`
//     background: white;
//     box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
//     transition: 0.3s;
//     width: auto;
//     margin: 0px -1px 60px;
//     clear: both;
// `;

const VideoWrapper = styled.div`
    display: inline-block; 
    position: relative; 
    border: 1px solid #E2E2E2;

    /* 동영상 썸네일 크기 */
    & .react-thumbnail-generator > img {
        width: 250px;
        height: 160px;
    }
`;

const PostForm = memo(({ modifyPost, onModifyPostCancel, onModifyPostOk }) => {
    const dispatch = useDispatch();
    const [text, setText] = useState('');
    //작성글이 없을 때 비활성화
    const [disableButton, setdisableButton] = useState(true);
    const { imagePaths, isAddingPost, postAdded } = useSelector(state => state.post);
    const imageInput = useRef();

    //글 수정 버튼 비활성화
    const [disabledModifyButton, setdisabledModifyButton] = useState(false);

    // console.log('modifyPost 값 : ', modifyPost);
    // console.log('Object.keys(modifyPost).length 값 : ', Object.keys(modifyPost).length);

    //정규표현식 (한글, 영어 태그 인식)
    // const hashtags = /#([ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-z|A-Z])+/gi;
    // const hashtag = /#((\w|[\u00C0-\uFFDF])+)/gi;

    //게시물 공개 여부 설정
    const [setting, setSetting] = useState();

    //react-tagsinput 라이브러리
    const [tags, setTags] = useState({
        tags: [],
    });

    //react-tagsinput 라이브러리
    const onChangeTags = useCallback((tags) => {
        setTags({tags});
    }, []);

    //텍스트 입력 변화 감지
    const onChangeText = useCallback((e) => {
        setText(e.target.value);
        // console.log('작동함?', e.target.value);
    }, []);

    //이미지 변화 감지
    const onChangeImages = useCallback((e) => {
        const imageFormData = new FormData();
        [].forEach.call(e.target.files, (f) => {
            imageFormData.append('image', f);
        });

        //이미지 업로드 요청
        dispatch({
            type: UPLOAD_IMAGES_REQUEST,
            data: imageFormData,
        });
    }, []);
    
    //이미지 업로드 
    const onClickImageUpload = useCallback(() => {
        imageInput.current.click();
    }, [imageInput.current]);

    //게시글 업로드 성공시 글자 내용 다 삭제
    useEffect(() => {
        if (postAdded) {
            setText('');
            setTags({
                tags: []
            });
        }
    }, [postAdded]);

    //작성란을 다 안채우면 작성 버튼 비활성화
    useEffect(() => {
        if(!modifyPost.id) {
            // console.log('글작성 부분');
            if (text && text.trim() && setting && tags.tags.length !== 0 && imagePaths.length !== 0) {
                setdisableButton(false);
            } else {
                setdisableButton(true);
            }
        } else {
            // console.log('글 수정 부분');
            // console.log('text 값 : ',text);
            // console.log('settings 값 : ',setting);
            // console.log('tags.tags 값 : ', tags.tags);
            // console.log('imagePaths 값 : ', imagePaths);
            // console.log('분기 값 : ', text && text.trim() && tags.tags.length !== 0 && imagePaths.length !== 0 );
            //게시글 수정 버튼 활성화 여부
            if ( text && text.trim() && tags.tags.length !== 0 && imagePaths.length !== 0) {
                setdisabledModifyButton(false);
            } else {
                setdisabledModifyButton(true);
            }
        }
    }, [text, setting, tags.tags, imagePaths, modifyPost.id]);

    //게시글 수정 초기값 설정
    useEffect(() => {
        //modifyPost 객체 값이 없는지 판별
        if (Object.keys(modifyPost).length !== 0) {
            // console.log('modifyPost 있다 : ', modifyPost);
            setSetting(modifyPost.auth);
            setText(modifyPost.content);
            const tags = modifyPost.Hashtags.map(v => {
                const tagNames = v.tagName;
                // console.log('tagNames 값 : ', tagNames);
                return tagNames;
            });
            // console.log('result 값 : ',tags);
            setTags({tags});
        } 
    }, [Object.keys(modifyPost).length]);

    //게시물 업로드
    const onSubmit = useCallback((e) => {
        // console.log('게시물 업로드 쪽 왔다..');
        e.preventDefault();

        //게시글 작성
        const formData = new FormData();

        //formData에 이미지 추가
        imagePaths.forEach((i) => {
            formData.append('image', i);
        }); 
        //formData에 글 추가
        formData.append('content', text);
        //formData에 게시물 공개여부 및 태그 내용 추가
        formData.append('postVisibility', setting.key);
        // console.log('tags.tags 값 : ',tags);
        formData.append('tags', tags.tags);

        //이부분에서 게시글 업로드인지 수정인지 판별하고 싶어요!!
        return dispatch({
            type: ADD_POST_REQUEST,
            data: formData,
        });
    }, [text, imagePaths, tags.tags, setting && setting.key]);

    //게시글 수정
    const onModify = useCallback((e) => {   
        // console.log('게시물 수정 쪽 onModify 실행');
        e.preventDefault();

        //게시글 수정
        const formData = new FormData();

        // console.log('게시물 수정 imagePaths: ',imagePaths);
        imagePaths.forEach((i) => {
            formData.append('image', i);
        });

        formData.append('content', text);
        formData.append('postVisibility', setting.key ? setting.key : setting);
        formData.append('tags', tags.tags);
        formData.append('postId', modifyPost.id);

        dispatch({
            type: MODIFY_POST_REQUEST,
            data: formData,
        });

        dispatch({
            type: MODIFY_LOAD_POST_IMAGES_CLEARED,
        })
    }, [text, imagePaths, tags.tags, setting]);

    //이미지 삭제
    const onRemoveImage = useCallback(index => () => {
        dispatch({
            type: REMOVE_IMAGE,
            index
        });
    });

    //게시물 공개여부
    const onChangeSetting = useCallback(value => {
        // console.log(`selected ${value}`);
        setSetting(value);
    }, []);

    return (
        <>
            <Form style={{ 
                // backgroundColor: 'white', 
                // zIndex: 2, 
                // width: '48%',
                // position: 'fixed', 
                padding: '10px 0 0px' 
                }} 
                encType="multipart/form-data"
                id="postForm"
                onSubmit={
                    modifyPost.id ? onModify : onSubmit
                }
            >
            <Select
                showSearch
                style={{ width: '200px' }}
                optionFilterProp="children"
                labelInValue
                defaultValue={ 
                    Object.keys(modifyPost).length !== 0 ? 
                    {key: `${modifyPost.auth}`} 
                    : 
                    {key: ""}
                }
                placeholder="게시물 공개 여부 설정"
                onChange={onChangeSetting}
                filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
            >
                <Select.Option value="" disabled><span style={{color: '#d9d9d9'}}>게시물 공개 여부 설정</span></Select.Option>
                <Select.Option value="0">전체공개</Select.Option>
                <Select.Option value="1">친구만 공개</Select.Option>
                <Select.Option value="2">나만보기</Select.Option>
            </Select>
            <Input.TextArea style={{height: '80px'}} maxLength={200} placeholder="무슨 일이 일어나고 있나요?" value={text} onChange={onChangeText} />
            <TagsInput placeholder value={tags.tags} onChange={onChangeTags} maxLength={200}/>
                <div style={{marginTop: '8px'}}>
                    <input type="file" multiple hidden ref={imageInput} onChange={onChangeImages} />
                    <FontAwesomeIcon cursor='pointer' style={{height: '32px', width: '50px'}} icon={faImage} onClick={onClickImageUpload} />
                    {
                        Object.keys(modifyPost).length === 0 &&
                        <Button type="primary" style={{float: 'right'}} htmlType="submit" loading={isAddingPost} disabled={disableButton} >등록</Button>
                    }
                </div>
                <div style={{overflow: 'auto', whiteSpace: 'nowrap'}}>
                    {
                        imagePaths.map((v, i) => {
                             //확장자
                            const fileExtension = v.slice(v.lastIndexOf(".")+1).toLowerCase();
                            return (
                                fileExtension === 'jfif' || fileExtension === 'png' || fileExtension === 'jpg' || fileExtension === 'jpeg' ?
                                    <div key={v} style={{position: 'relative', display: 'inline-block', border: '1px solid #E2E2E2'}}>
                                        <img 
                                            src={process.env.NODE_ENV !== 'production' ? `${backUrl}/${v}` : `${v}`} 
                                            style={{
                                                maxWidth: '250px', 
                                                maxHeight: '160px',
                                                minWidth: '250px',
                                                minHeight: '160px',
                                                width: 'auto',
                                                height: 'auto',
                                                objectFit: 'fill',
                                            }} 
                                            alt={v} 
                                        />
                                        <FontAwesomeIcon
                                            icon={faTimes} 
                                            style={{position: 'absolute', color: 'white', top: 4, right: 4, height: '20px', width:' 20px', backgroundColor: 'black', borderRadius: '50%'}}
                                            onClick={onRemoveImage(i)}
                                        />
                                    </div>
                                    :
                                    <VideoWrapper key={v}>
                                        <VideoThumbnail
                                            videoUrl={process.env.NODE_ENV !== 'production' ? `${backUrl}/${v}` : `${v}`}
                                        />
                                        <FontAwesomeIcon
                                            icon={faTimes} 
                                            style={{position: 'absolute', color: 'white', top: 4, right: 4, height: '20px', width:' 20px', backgroundColor: 'black', borderRadius: '50%'}}
                                            onClick={onRemoveImage(i)}
                                        />
                                    </VideoWrapper>
                            );
                        })
                    }
                </div>
                <hr style={{border: 'solid 5px rgb(230, 236, 240)', marginBottom: '2px', }} />
                {
                    Object.keys(modifyPost).length !== 0 && 
                        <div>
                            <Button type="primary" onClick={onModifyPostOk} htmlType="submit" style={{marginLeft: '370px'}} disabled={disabledModifyButton}>수정</Button>
                            <Button type="danger" onClick={onModifyPostCancel} style={{marginLeft: '10px'}}>취소</Button>
                        </div>
                    }
            </Form>
            
        </>
    );
});

//글 수정이 아니라 메인화면의 글쓰는 부분이면 modifyPost가 null이므로 초기화 작업을 해줘야 에러가 안뜸.
PostForm.defaultProps = {
    modifyPost: {},
};

export default PostForm;