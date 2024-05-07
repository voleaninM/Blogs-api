import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { ApiTags } from '@nestjs/swagger';
import { CreatePostDto, UpdatePostDto, FilterOptionsDto } from './post.dto';
import { Public } from 'src/decorators/public.decorator';
import { OwnerGuard } from '../guards/owner.guard';
import { Post as PostEntity } from './post.entity';
import { CapitalizeQueryPipe } from 'src/pipes/capitalize.pipe';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Public()
  @Get()
  getAll(
    @Query(CapitalizeQueryPipe) query: FilterOptionsDto,
  ): Promise<PostEntity[]> {
    return this.postsService.getAll(query);
  }

  @Post()
  createPost(
    @Body(new ValidationPipe()) createPostDto: CreatePostDto,
    @Request() req,
  ): Promise<PostEntity> {
    const { id: userId } = req.user;
    return this.postsService.createPost(createPostDto, userId);
  }

  @Public()
  @Get(':id')
  findPost(@Param('id') id: number): Promise<PostEntity> {
    return this.postsService.findPost(id);
  }

  @UseGuards(OwnerGuard)
  @Patch(':id')
  updatePost(
    @Param('id') id: number,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<PostEntity> {
    return this.postsService.updatePost(id, updatePostDto);
  }

  @UseGuards(OwnerGuard)
  @Delete(':id')
  deletePost(@Param('id') id: number) {
    return this.postsService.deletePost(id);
  }
}
