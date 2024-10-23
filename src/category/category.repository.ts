import { BadRequestException, Injectable } from '@nestjs/common';
import * as data from '../utils/data.json';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryRepository {
    constructor(
        @InjectRepository(Category)
        private categoriesRepository: Repository<Category>,
    ) {}

    async getAllCategories(): Promise<Category[]> {
        return await this.categoriesRepository.find();
    }
}
