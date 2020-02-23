import React, { useCallback, useState, useEffect, useRef } from 'react';
import { Form, Input, Button, Select } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { 
    ADD_POST_REQUEST, 
    UPLOAD_IMAGES_REQUEST, 
    REMOVE_IMAGE,
} from '../reducers/post';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faImage } from '@fortawesome/free-solid-svg-icons';

import TagsInput from 'react-tagsinput';
import styled from 'styled-components';
import { backUrl } from '../config/config';

// const PostFormWrapper = styled.div`
//     background: white;
//     box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
//     transition: 0.3s;
//     width: auto;
//     margin: 0px -1px 60px;
//     clear: both;
// `;

const PostForm = () => {
    const dispatch = useDispatch();
    const [text, setText] = useState('');
    //작성글이 없을 때 비활성화
    const [disableButton, setdisableButton] = useState(true);
    const { imagePaths, isAddingPost, postAdded } = useSelector(state => state.post);
    const imageInput = useRef();

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

    useEffect(() => {
        if (text && text.trim() && setting && tags.tags.length !== 0 && imagePaths.length !== 0) {
            setdisableButton(false);
        } else {
            setdisableButton(true);
        }
    }, [text, setting, tags.tags, imagePaths]);

    //게시물 업로드
    const onSubmit = useCallback((e) => {
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
        formData.append('postVisibility', setting);
        // console.log('tags.tags 값 : ',tags);
        formData.append('tags', tags.tags);

        dispatch({
            type: ADD_POST_REQUEST,
            data: formData,
        });
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
                onSubmit={onSubmit}
            >
            <Select
                showSearch
                style={{ width: '200px' }}
                placeholder="게시물 공개 여부 설정"
                optionFilterProp="children"
                onChange={onChangeSetting}
                filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
            >
                <Select.Option value="0">전체공개</Select.Option>
                <Select.Option value="1">친구만 공개</Select.Option>
                <Select.Option value="2">나만보기</Select.Option>
            </Select>
            <Input.TextArea style={{height: '80px'}} maxLength={200} placeholder="무슨 일이 일어나고 있나요?" value={text} onChange={onChangeText} />
            <TagsInput placeholder value={tags.tags} onChange={onChangeTags} maxLength={200}/>
                <div style={{marginTop: '8px'}}>
                    <input type="file" multiple hidden ref={imageInput} onChange={onChangeImages} />
                    <FontAwesomeIcon cursor='pointer' style={{height: '32px', width: '50px'}} icon={faImage} onClick={onClickImageUpload} />
                    <Button type="primary" style={{float: 'right'}} htmlType="submit" loading={isAddingPost} disabled={disableButton} >등록</Button>
                </div>
                <div style={{overflow: 'auto', whiteSpace: 'nowrap'}}>
                    {imagePaths.map((v, i) => (
                    <div key={v} style={{position: 'relative', display: 'inline-block', border: '1px solid #E2E2E2'}}>
                        <img 
                            src={`${backUrl}/${v}`} 
                            style={{
                                maxWidth: '250px', 
                                maxHeight: '160px',
                                minWidth: '250px',
                                minHeight: '160px',
                                width: 'auto',
                                height: 'auto',
                                objectFit: 'cover',
                            }} 
                            alt={v} 
                        />
                        <FontAwesomeIcon
                            icon={faTimes} 
                            style={{position: 'absolute', color: 'white', top: 4, right: 4, height: '20px', width:' 20px', backgroundColor: 'black', borderRadius: '50%'}}
                            onClick={onRemoveImage(i)}
                        />
                    </div>
                    ))}
                </div>
                <hr style={{border: 'solid 5px rgb(230, 236, 240)', marginBottom: '2px', }} />
            </Form>
        </>
    );
};

export default PostForm;