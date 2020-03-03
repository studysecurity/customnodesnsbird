import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, List } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan } from '@fortawesome/free-solid-svg-icons';

const FollowList = memo(({ header, hasMore, onClickMore, data, onClickStop }) => {
    return (
        <List
            grid={{ gutter: 4, xs: 2, md: 3 }}
            size="small"
            header={<div>{header}</div>}
            loadMore={hasMore && <Button style={{ width: '100%', backgroundColor: 'skyblue', color: 'white'}} onClick={onClickMore}>더 보기</Button>}
            bordered
            dataSource={data}
            renderItem={item => (
            <List.Item style={{ marginTop: '20px' }}>
                <Card actions={[<FontAwesomeIcon icon={faBan} key="stop" type="stop" style={{color: 'red'}} onClick={onClickStop(item.id)} />]}>
                <Card.Meta description={item.userNick} style={{textAlign: 'center'}}/>
                </Card>
            </List.Item>
            )}
        />
    );
});

FollowList.propTypes = {
    header: PropTypes.string.isRequired,
    hasMore: PropTypes.bool.isRequired,
    onClickMore: PropTypes.func.isRequired,
    data: PropTypes.array.isRequired,
    onClickStop: PropTypes.func.isRequired,
};

export default FollowList;

