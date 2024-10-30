import { Injectable } from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import { Category } from './category.entity';

@Injectable()
export class CategoryService {
    constructor(private readonly categoryRepository: CategoryRepository) {}

    async getAllCategories(): Promise<Category[]> {
        return this.categoryRepository.getAllCategories();
    }
}
