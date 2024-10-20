import { BadRequestException, Injectable } from '@nestjs/common';
import * as data from '../utils/data.json';

@Injectable()
export class CategoryRepository {
    getAllCategories() {
        if (!data || !data.categories) {
            throw new BadRequestException('Categories not found');
        }
        return data.categories;
    }
}
