import {
    Controller,
    FileTypeValidator,
    MaxFileSizeValidator,
    ParseFilePipe,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { UploadPhotoService } from './upload-photo.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('upload-photo')
export class UploadPhotoController {
    constructor(private readonly uploadService: UploadPhotoService) {}

    @Post()
    @UseInterceptors(FileInterceptor('photo'))
    async uploadPhoto(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }),
                    new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ }),
                ],
            }),
        )
        file: Express.Multer.File,
    ) {
        const response = await this.uploadService.uploadPhoto(
            file.originalname,
            file.buffer,
        );

        return response;
    }
}
