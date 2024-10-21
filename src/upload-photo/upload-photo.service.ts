import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lookup } from 'mime-types';

@Injectable()
export class UploadPhotoService {
    constructor(private readonly configService: ConfigService) {}

    private readonly s3Client = new S3Client({
        region: this.configService.getOrThrow('AWS_S3_REGION'),
    });

    async uploadPhoto(fileName: string, file: Buffer) {
        const bucketName = this.configService.getOrThrow('AWS_BUCKET_NAME');
        const region = this.configService.getOrThrow('AWS_S3_REGION');
        const contentType = lookup(fileName) || 'application/octet-stream';

        await this.s3Client.send(
            new PutObjectCommand({
                Bucket: bucketName,
                Key: fileName,
                Body: file,
                ContentType: contentType,
                ContentDisposition: 'inline',
            }),
        );

        const encodedFileName = encodeURIComponent(fileName);

        console.log(encodedFileName);

        const fileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${encodedFileName}`;

        return fileUrl;
    }
}
