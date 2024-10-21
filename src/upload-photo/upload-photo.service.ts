import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lookup } from 'mime-types';

@Injectable()
export class UploadPhotoService {
    constructor(private readonly configService: ConfigService) {}

    private readonly s3Client = new S3Client({
        region: this.configService.getOrThrow('AWS_S3_REGION'),
    });

    async uploadPhoto(fileName: string, file: Buffer): Promise<string> {
        const bucketName = this.configService.getOrThrow('AWS_BUCKET_NAME');
        const region = this.configService.getOrThrow('AWS_S3_REGION');
        const contentType = lookup(fileName) || 'application/octet-stream';

        try {
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
            const fileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${encodedFileName}`;

            return fileUrl;
        } catch (error) {
            console.error('Error uploading photo:', error.message);
            throw new InternalServerErrorException(error.message);
        }
    }
}
