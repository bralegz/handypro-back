import { Injectable } from '@nestjs/common';
import { ReviewRepository } from './review.repository';
import { CreateReview } from './dtos/createReview.dto';

@Injectable()
export class ReviewService {
    constructor(private readonly reviewsRepository: ReviewRepository) {}

    async createReviews(review: CreateReview, postedId: string) {
        return this.reviewsRepository.createReviews(review, postedId);
    }
}
