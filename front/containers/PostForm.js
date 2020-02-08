import React, { useCallback, useState } from 'react';
import { Form, Input, Button } from 'antd';

const PostForm = () => {
    const [text, setText] = useState('');

    //텍스트 입력 변화 감지
    const onChangeText = useCallback((e) => {
        setText(e.target.value);
    }, []);
    
    //이미지 업로드 
    const onClickImageUpload = useCallback(() => {

    }, []);

    //게시물 업로드
    const onSubmit = useCallback((e) => {
        e.preventDefault();
    });

    return (
        <Form style={{marginTop: '15px'}} encType="multipart/form-data" onSubmit={onSubmit}>
            <Input.TextArea style={{height: '80px'}} maxLength={200} placeholder="무슨 일이 일어나고 있나요?" value={text} onChange={onChangeText} />
            <div>
                <Button onClick={onClickImageUpload}>이미지 업로드</Button>
                <Button type="primary" style={{float: 'right'}} htmlType="submit">등록</Button>
            </div>
            <div>
                
            </div>
        </Form>
    );
};

export default PostForm;