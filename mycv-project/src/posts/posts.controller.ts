import { Controller, Post, Body, Get, Param, Query, Patch, Delete } from '@nestjs/common';
import { CreatePostDto } from './dtos/create-post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private postService: PostsService) {}

  @Post('/create')
  createPost(@Body() body: CreatePostDto) {
    return this.postService.createPost(body.title, body.category, body.content);
  }

  @Get('/:id')
  findPost(@Param('id') id: string) {
    return this.postService.findPost(parseInt(id));
  }

  @Get()
  findPostByCategory(@Query('category') category: string) {
    return this.postService.findPostsByCategory(category);
  }

  // @Patch('/:id')

  @Delete('/:id')
  deletePost(@Param('id') id: string) {
    return this.postService.deletePost(parseInt(id));
  }
}
