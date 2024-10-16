import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import * as Data from '../utils/data.json';

@Injectable()
export class PostsService {
    create(createPostDto: CreatePostDto) {
        return 'This action adds a new post';
    }

    findAll() {
        return Data.requested_jobs;
    }

    findOne(id: number) {
        return `This action returns a #${id} post`;
    }

    findOneByProfession(profession: string) {
        const categories = Data.categories;

        const isValid = categories.findIndex((category) => {
            return category.name.toLowerCase() === profession.toLowerCase();
        });

        if (isValid === -1) {
            return 'No se encontro la profesion';
        }

        return Data.requested_jobs.filter((post) => {
            return (
                post.requested_professional.toLowerCase() ===
                profession.toLowerCase()
            );
        });
    }

    update(id: number, updatePostDto: UpdatePostDto) {
        return `This action updates a #${id} post`;
    }

    remove(id: number) {
        return `This action removes a #${id} post`;
    }
}
