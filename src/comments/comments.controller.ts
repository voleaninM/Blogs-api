import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateCommentDto, UpdateCommentDto } from './comment.dto';
import { Public } from 'src/decorators/public.decorator';
import { CommentOwnerGuard } from '../guards/comments-owner.guard';
import { Comment } from './comment.entity';

@ApiTags('comments')
@Controller()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Public()
  @Get('/comments')
  getAll(): Promise<Comment[]> {
    return this.commentsService.getAll();
  }

  @Public()
  @Get('posts/:postId/comments')
  getPostComments(@Param('postId') postId: number): Promise<Comment[]> {
    return this.commentsService.getPostComments(postId);
  }

  @Post('posts/:postId/comments')
  createComment(
    @Body() createCommentDto: CreateCommentDto,
    @Param('postId') postId: number,
    @Request() req,
  ): Promise<Comment> {
    const { id } = req.user;
    return this.commentsService.createComment(createCommentDto, postId, id);
  }

  @Public()
  @Get('/comments/:id')
  findComment(@Param('id') id: number): Promise<Comment> {
    return this.commentsService.findComment(id);
  }
}

@UseGuards(CommentOwnerGuard)
@ApiTags('comments')
@Controller('comments')
export class CommentsOperationsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Patch(':id')
  updateComment(
    @Param('id') id: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    return this.commentsService.updateComment(id, updateCommentDto);
  }

  @Delete(':id')
  deleteComment(@Param('id') id: number) {
    return this.commentsService.deleteComment(id);
  }
}
