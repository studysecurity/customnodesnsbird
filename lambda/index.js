const AWS = require('aws-sdk');
const Sharp = require('sharp');

const S3 = new AWS.S3({ region: 'ap-northeast02'});

exports.handler = async (event, context, callback) => {
    const Bucket = event.Records[0].s3.bucket.name;
    const Key = event.Records[0].s3.object.key;
    const filename = Key.split('/')[[key.split('/').length - 1]];
    const ext = Key.split('.')[[Key.split('.').length -1 ]];
    console.log(Bucket, key, filename, ext );

    const requiredFormat = ext === 'jpg' || ext === 'png' || ext === 'jfif' ? 'jpeg' : ext;

    try {
        const s3Object = await S3.getObject({
            Bucket,
            Key,
        }).promise();
        console.log('original', s3Object.Body.length);
        
        //이미지 리사이징
        const resizedImage = await Sharp(s3Object.Body)
            .resize(800, 800, {
                fit: 'inside'
            })
            .toFormat(requiredFormat)
            .toBuffer();

        //S3에 리사이징 이미지 업로드
        await S3.putObject({
            Bucket,
            key: `thumb/${filename}`,
            Body: resizedImage,
        }).primise();
        console.log('put');
        return callback(null, `thumb/${filename}`);
    } catch(e) {
        console.error(e);
        return callback(e);
    }

};