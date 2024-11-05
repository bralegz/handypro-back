import {
    Body,
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { ApiBody, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateReview } from './dtos/createReview.dto';

@ApiTags('review')
@Controller('review')
export class ReviewController {
    constructor(private readonly reviewsService: ReviewService) {}

    @Post(':postedId')
    @ApiParam({
        name: 'postedId',
        required: true,
        description: 'Se requiere el id del posteo, debe ser de tipo UUID',
        example: '9d0eaae9-a2e1-4373-9c50-a42fcce25ead',
    })
    @ApiBody({
        type: CreateReview,
    })
    @ApiOkResponse({
        schema: {
            example: {
                message: 'Reseña creada con exito',
                review: {
                    rating: 4.5,
                    comment: 'Muy buen trabajo instalando una cañeria',
                    review_id: 'ce4ac76e-54ff-4196-b7fb-112b10ffc3ad',
                },
            },
        },
    })
    createReviews(
        @Param('postedId', ParseUUIDPipe) postedId: string,
        @Body() review?: CreateReview,
    ) {
        return this.reviewsService.createReviews(review, postedId);
    }

    @Patch('toggleActiveStatus/:postedId')
    toggleActiveStatus(@Param('postedId', ParseUUIDPipe) postedId: string) {
        return this.reviewsService.toggleActiveStatus(postedId)
    }
}
