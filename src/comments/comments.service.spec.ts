import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Post } from 'src/posts/post.entity';
import { PostsService } from 'src/posts/posts.service';
import { CreateCommentDto, UpdateCommentDto } from './comment.dto';
import { Comment } from './comment.entity';
import { CommentsService } from './comments.service';

describe('CommentsService', () => {
  let commentsService: CommentsService;
  let postsService: PostsService;
  let commentsRepoStab;

  const fakeComments: Comment[] = [
    { id: 1, content: 'comment', userId: 1, postId: 1, post: {} as Post },
  ];
  const fakePostsService = {
    getAll: jest.fn(),
    createPost: jest.fn(),
    findPost: jest.fn(),
    updatePost: jest.fn(),
    deletePost: jest.fn(),
    findPostById: jest.fn(),
  };
  const deleteResponse = { message: 'Comment successfully deleted' };

  beforeEach(async () => {
    commentsRepoStab = {
      find: () => Promise.resolve(fakeComments),
      findBy: () => Promise.resolve(fakeComments),
      create: () => fakeComments[0],
      save: () => Promise.resolve(fakeComments[0]),
      findOneBy: () => Promise.resolve(fakeComments[0]),
      delete: () => Promise.resolve(deleteResponse),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: getRepositoryToken(Comment),
          useValue: commentsRepoStab,
        },
        {
          provide: PostsService,
          useValue: fakePostsService,
        },
      ],
    }).compile();
    /// createMock
    commentsService = module.get<CommentsService>(CommentsService);
    postsService = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(commentsService).toBeDefined();
  });

  it('should return all comments', async () => {
    //arrange
    const expectedResult = fakeComments;

    //act
    const result = await commentsService.getAll();

    //assert
    expect(result).toEqual(expectedResult);
  });

  it('should return comments for a single post', async () => {
    //arrange
    const expectedResult = fakeComments;

    //act
    const result = await commentsService.getPostComments(expectedResult[0].id);

    //assert
    expect(result).toEqual(expectedResult);
  });

  it('should throw NotFoundException if post does not have comments', async () => {
    //arrange
    const expectedResult = 'Comments for Post 1 not found';

    //act
    jest.spyOn(commentsRepoStab, 'findBy').mockResolvedValueOnce([]);
    const result = commentsService.getPostComments(fakeComments[0].id);

    //assert
    await expect(result).rejects.toThrow(
      new NotFoundException('Comments for Post 1 not found'),
    );
  });

  it('should create a comment', async () => {
    //arrange
    const expectedResult = fakeComments[0];

    //act
    jest.spyOn(postsService, 'findPostById').mockResolvedValue({} as Post);
    const result = await commentsService.createComment(
      {} as CreateCommentDto,
      1,
      1,
    );

    //assert
    expect(result).toEqual(expectedResult);
  });

  it('should throw NotFoundException if post was not found', async () => {
    //arrange
    const expectedResult = 'Post 1 not found';

    //act
    jest.spyOn(postsService, 'findPostById').mockResolvedValue(null);
    const result = commentsService.createComment({} as CreateCommentDto, 1, 1);

    //assert
    await expect(result).rejects.toThrow(
      new NotFoundException('Post 1 not found'),
    );
  });

  it('should return a comment', async () => {
    //arrange
    const expectedResult = fakeComments[0];

    //act
    const result = await commentsService.findComment(1);

    //assert
    expect(result).toEqual(expectedResult);
  });

  it('should throw NotFoundException if post was not found', async () => {
    //arrange
    const expectedResult = 'Comment with ID 1 not found';

    //act
    jest.spyOn(commentsRepoStab, 'findOneBy').mockResolvedValue(null);
    const result = commentsService.findComment(1);

    //assert
    await expect(result).rejects.toThrow(new NotFoundException(expectedResult));
  });

  it('should update a comment', async () => {
    //arrange
    const expectedResult = fakeComments[0];

    //act
    const result = await commentsService.updateComment(
      1,
      {} as UpdateCommentDto,
    );

    //assert
    expect(result).toEqual(expectedResult);
  });

  it('should delete the tag', async () => {
    //arrange
    const commentToDelete = fakeComments[0];
    const expectedResult = deleteResponse;

    //act
    const result = await commentsService.deleteComment(commentToDelete.id);

    //assert
    expect(result).toEqual(expectedResult);
  });

  it('should throw NotFoundException if tag does not exist', async () => {
    //arrange
    const commentToDelete = fakeComments[0];
    const expectedError = 'A Comment 1 was not found';

    //act
    commentsRepoStab.delete = () => {
      return { affected: 0 };
    };
    const result = commentsService.deleteComment(commentToDelete.id);

    //assert
    await expect(result).rejects.toThrow(new NotFoundException(expectedError));
  });
});
