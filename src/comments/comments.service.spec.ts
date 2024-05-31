import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Post } from 'src/posts/post.entity';
import { CreateCommentDto, UpdateCommentDto } from './comment.dto';
import { Comment } from './comment.entity';
import { CommentsService } from './comments.service';
import { TagsService } from 'src/tags/tags.service';
import { Tag } from 'src/tags/tag.entity';

describe('CommentsService', () => {
  let commentsService: CommentsService;
  let commentsRepoStab;

  const fakeComments: Comment[] = [
    { id: 1, content: 'comment', userId: 1, postId: 1, post: {} as Post },
  ];

  const fakeTagsRepository = {
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    commentsRepoStab = {
      find: () => Promise.resolve(fakeComments),
      create: () => fakeComments[0],
      save: () => Promise.resolve(fakeComments[0]),
      findOneBy: () => Promise.resolve(fakeComments[0]),
      update: () => Promise.resolve(),
      delete: () => Promise.resolve({ affected: 1 }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        TagsService,
        {
          provide: getRepositoryToken(Comment),
          useValue: commentsRepoStab,
        },
        {
          provide: getRepositoryToken(Tag),
          useValue: fakeTagsRepository,
        },
      ],
    }).compile();

    commentsService = module.get<CommentsService>(CommentsService);
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

  it('should create a comment', async () => {
    //arrange
    const expectedResult = fakeComments[0];

    //act
    const result = await commentsService.createComment(
      {} as CreateCommentDto,
      1,
      1,
    );

    //assert
    expect(result).toEqual(expectedResult);
  });

  it('should return a comment', async () => {
    //arrange
    const expectedResult = fakeComments[0];

    //act
    const result = await commentsService.findComment(1);

    //assert
    expect(result).toEqual(expectedResult);
  });

  it('should throw if comment was not found', async () => {
    //arrange

    //act
    jest.spyOn(commentsRepoStab, 'findOneBy').mockResolvedValue(null);
    const result = commentsService.findComment(1);

    //assert
    await expect(result).rejects.toThrow(new NotFoundException());
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

  it('should delete the comment', async () => {
    //arrange
    const commentToDelete = fakeComments[0];

    //act
    const result = await commentsService.deleteComment(commentToDelete.id);

    //assert
    expect(result).toBeUndefined();
  });

  it('should throw if comment does not exist', async () => {
    //arrange
    const commentToDelete = fakeComments[0];

    //act
    commentsRepoStab.delete = () => {
      return { affected: 0 };
    };
    const result = commentsService.deleteComment(commentToDelete.id);

    //assert
    await expect(result).rejects.toThrow(new NotFoundException());
  });
});
