import React, { useCallback, useState, useEffect, useRef } from 'react';
import { Form, Input, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { 
    ADD_POST_REQUEST, 
    UPLOAD_IMAGES_REQUEST, 
    REMOVE_IMAGE,
} from '../reducers/post';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const PostForm = () => {
    const dispatch = useDispatch();
    const [text, setText] = useState('');
    //작성글이 없을 때 비활성화
    const [disableButton, setdisableButton] = useState(true);
    const { imagePaths, isAddingPost, postAdded } = useSelector(state => state.post);
    const imageInput = useRef();

    //텍스트 입력 변화 감지
    const onChangeText = useCallback((e) => {
        setText(e.target.value);

        //버튼 활성화 여부
        if(e.target.value.trim() && e.target.value) {
            //작성 내용이 있으면 작성 버튼 활성화
            setdisableButton(false);
        } else{
            //작성 내용이 없으면 작성 버튼 비활성화
            setdisableButton(true);
        }
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
        }
    }, [postAdded]);

    //게시물 업로드
    const onSubmit = useCallback((e) => {
        e.preventDefault();

        //게시글 작성
        const formData = new FormData();

        formData.append('content', text);
        dispatch({
            type: ADD_POST_REQUEST,
            data: formData,
        });
    }, [text]);

    const onRemoveImage = useCallback(index => () => {
        dispatch({
            type: REMOVE_IMAGE,
            index
        });
    });

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
            <Input.TextArea style={{height: '80px'}} maxLength={200} placeholder="무슨 일이 일어나고 있나요?" value={text} onChange={onChangeText} />
                <div>
                    <input type="file" multiple hidden ref={imageInput} onChange={onChangeImages} />
                    <Button onClick={onClickImageUpload}>이미지 업로드</Button>
                    <Button type="primary" style={{float: 'right'}} htmlType="submit" loading={isAddingPost} disabled={disableButton}>등록</Button>
                </div>
                <div>
                    {imagePaths.map((v, i) => (
                    <div key={v} style={{ position: 'relative', display: 'inline-block', width: '100%', border: '1px solid #E2E2E2', marginTop: '10px'}}>
                        <img 
                            src={`http://localhost:3065/${v}`} 
                            style={{
                                width: '100%', 
                                height: '300px',
                                objectFit: 'contain'
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