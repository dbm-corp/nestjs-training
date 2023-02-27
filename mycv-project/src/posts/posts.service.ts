import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';

@Injectable()
export class PostsService {
  constructor(@InjectRepository(Post) private postRepo: Repository<Post>) {}

  getAll() {
    const posts = this.postRepo.find();
    return posts;
  }

  createPost(title: string, category: string, content: string) {
    const post = this.postRepo.create({ title, category, content });
    return this.postRepo.save(post);
  }

  findPost(id: number) {
    return this.postRepo.findBy({ id });
  }

  findPostsByCategory(category: string) {
    return this.postRepo.findBy({ category });
  }

  async updatePost(id: number, attrs: Partial<Post>) {
    const post = await this.findPost(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    Object.assign(post, attrs);
    return this.postRepo.save(post);
  }

  async deletePost(id: number) {
    const post = await this.findPost(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return this.postRepo.remove(post);
  }
}
