import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  Patch,
  Delete,
} from '@nestjs/common';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { UserDto } from 'src/users/dtos/user.dto';
import { User } from 'src/users/user.entity';
import { CreatePostDto } from './dtos/create-post.dto';
import { PostDto } from './dtos/post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
@Serialize(PostDto)
export class PostsController {
  constructor(private postService: PostsService) {}

  @Get('/get-all')
  getAllPosts() {
    return this.postService.getAll();
  }

  @Get('/who-am-i')
  @Serialize(UserDto)
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

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

  @Patch('/:id')
  updatePost(@Param('id') id: string, @Body() body: UpdatePostDto) {
    return this.postService.updatePost(parseInt(id), body);
  }

  @Delete('/:id')
  deletePost(@Param('id') id: string) {
    return this.postService.deletePost(parseInt(id));
  }
}
