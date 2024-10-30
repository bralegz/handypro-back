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
import { ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('upload-photo')
@Controller('upload-photo')
export class UploadPhotoController {
    constructor(private readonly uploadService: UploadPhotoService) {}

    @Post()
    @UseInterceptors(FileInterceptor('photo'))
    @ApiBody({
        description: 'Subida de una foto del usuario. El archivo debe ser una imagen en formatos jpg, jpeg, png o webp y no debe exceder los 2MB.',
        schema: {
            type: 'object',
            properties: {
                photo: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @ApiResponse({ 
        status: 201, 
        description: 'Foto subida exitosamente.',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    example: 'Foto subida exitosamente.',
                },
                url: {
                    type: 'string',
                    example: 'https://example.com/path/to/photo.jpg',
                },
            },
        },
    })
    @ApiResponse({ status: 400, description: 'Archivo inválido. Asegúrate de que el archivo sea una imagen válida y no exceda los 2MB.' })
    async uploadPhoto(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }), // 2 MB
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
