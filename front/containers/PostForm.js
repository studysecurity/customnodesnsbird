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

        // //버튼 활성화 여부
        // if(e.target.value.trim() && e.target.value) {
        //     //작성 내용이 있으면 작성 버튼 활성화
        //     setdisableButton(false);
        // } else{
        //     //작성 내용이 없으면 작성 버튼 비활성화
        //     setdisableButton(true);
        // }
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
        //이부분 테스트 아직 안함 ####
        if (postAdded) {
            setText('');
            setSetting();
            //이부분ㄷ 애매함
            // setTags({tags: []});
        }

        if (text && text.trim() && setting && tags.tags.length !== 0) {
            setdisableButton(false);
        } else {
            setdisableButton(true);
        }

    }, [postAdded, text, setting, tags.tags]);

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
        formData.append('tags', tags);

        dispatch({
            type: ADD_POST_REQUEST,
            data: formData,
        });
    }, [text, imagePaths, tags.tags, setting]);

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
            <TagsInput placeholder value={tags.tags} onChange={onChangeTags} />
                <div style={{marginTop: '8px'}}>
                    <input type="file" multiple hidden ref={imageInput} onChange={onChangeImages} />
                    <FontAwesomeIcon cursor='pointer' style={{height: '32px', width: '50px'}} icon={faImage} onClick={onClickImageUpload} />
                    <Button type="primary" style={{float: 'right'}} htmlType="submit" loading={isAddingPost} disabled={disableButton}>등록</Button>
                </div>
                <div style={{ overflow: 'auto', whiteSpace: 'nowrap'}}>
                    {imagePaths.map((v, i) => (
                    <div key={v} style={{position: 'relative', display: 'inline-block', border: '1px solid #E2E2E2', marginTop: '10px'}}>
                        <img 
                            src={`http://localhost:3065/${v}`} 
                            style={{
                                maxWidth: '250px', 
                                maxHeight: '180px',
                                width: 'auto',
                                height: 'auto',
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
            {/* <Form style={{backgroundColor: 'white', zIndex: 2, width: '48%' ,position: 'fixed', paddingTop: '15px'}} encType="multipart/form-data" onSubmit={onSubmit}>
                <Input.TextArea style={{height: '80px'}} maxLength={200} placeholder="무슨 일이 일어나고 있나요?" value={text} onChange={onChangeText} />
                <div>
                    <input type="file" multiple hidden ref={imageInput} onChange={onChangeImages} />
                    <Button onClick={onClickImageUpload}>이미지 업로드</Button>
                    <Button type="primary" style={{float: 'right'}} htmlType="submit" loading={isAddingPost} disabled={disableButton}>등록</Button>
                </div>
                <div>
                    {
                        console.log('imagepaths : ',imagePaths),
                        imagePaths.map((v, i) => {
                            <div key={v} style={{ display: 'inline-block' }}>
                                <img src={`http://localhost:3065/${v}`} style={{ width: '200px' }} alt={v} />
                                {console.log(`http://localhost:3065/${v}`)}
                                <div>
                                <Button onClick={onRemoveImage(i)}>제거</Button>
                                </div>
                            </div>
                        })
                    }
                </div>
            <hr style={{border: 'solid 5px rgb(230, 236, 240)', marginBottom: '2px', }} />
            </Form> */}
        </>
    );
};

export default PostForm;