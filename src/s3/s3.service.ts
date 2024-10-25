import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';

@Injectable()
export class S3Service {
  private s3: S3;
  private readonly bucketName = process.env.AWS_BUCKET_NAME;

  constructor() {
    this.s3 = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
  }

  async uploadFile(buffer: Buffer, contentType: string, originalName: string): Promise<string> {
    const fileName = `${uuid()}-${originalName}`;

    const params = {
      Bucket: this.bucketName,
      Key: fileName,
      Body: buffer,
      ContentType: contentType,
      ACL: 'public-read',
    };
    
    try {
      const { Location } = await this.s3.upload(params).promise();
      return Location; // Returns the URL of the uploaded image
    } catch (e) {
      console.log(e);
    }
  }
}
