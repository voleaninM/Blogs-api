import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TagsService } from 'src/tags/tags.service';
import { CreatePostDto, FilterOptionsDto, UpdatePostDto } from './post.dto';
import { Post } from './post.entity';
import { PostsService } from './posts.service';
import { NotFoundException } from '@nestjs/common';
import { Tag } from 'src/tags/tag.entity';

describe('PostsService', () => {
  let postsService: PostsService;
  let postsRepoStab;

  const fakePosts: Post[] = [
    {
      id: 1,
      title: 'post3',
      description: 'description2',
      tags: [],
      userId: 1,
      comments: [],
    },
  ];
  const fakeTagsRepository = {
    create: jest.fn(),
    delete: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    postsRepoStab = {
      find: () => Promise.resolve(fakePosts),
      findBy: () => Promise.resolve(fakePosts),
      findOne: () => Promise.resolve(fakePosts[0]),
      create: () => fakePosts[0],
      save: () => Promise.resolve(fakePosts[0]),
      findOneBy: () => Promise.resolve(fakePosts[0]),
      delete: () => Promise.resolve({ affected: 1 }),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        TagsService,
        {
          provide: getRepositoryToken(Tag),
          useValue: fakeTagsRepository,
        },
        {
          provide: getRepositoryToken(Post),
          useValue: postsRepoStab,
        },
      ],
    }).compile();

    postsService = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(postsService).toBeDefined();
  });

  it('should return all posts', async () => {
    //arrange
    const expectedResult = fakePosts;

    //act
    const result = await postsService.getAll({} as FilterOptionsDto);

    //assert
    expect(result).toEqual(expectedResult);
  });

  it('should create a post', async () => {
    //arrange
    const expectedResult = fakePosts[0];

    //act
    const result = await postsService.createPost({} as CreatePostDto, 1);

    //assert
    expect(result).toEqual(expectedResult);
  });

  it('should find a post', async () => {
    //arrange
    const expectedResult = fakePosts[0];

    //act
    const result = await postsService.findPost(1);

    //assert
    expect(result).toEqual(expectedResult);
  });

  it('should throw if no post found', async () => {
    //arrange

    //act
    jest.spyOn(postsRepoStab, 'findOne').mockResolvedValueOnce(null);
    const result = postsService.findPost(fakePosts[0].id);

    //assert
    await expect(result).rejects.toThrow(new NotFoundException());
  });

  it('should update a post', async () => {
    //arrange
    const expectedResult = fakePosts[0];

    //act
    const result = await postsService.updatePost(1, {} as UpdatePostDto);

    //assert
    expect(result).toEqual(expectedResult);
  });

  it('should delete post', async () => {
    //arrange
    //act
    const result = await postsService.deletePost(fakePosts[0].id);

    //assert
    expect(result).toBeUndefined();
  });

  it('should throw if post does not exist', async () => {
    //arrange
    const commentToDelete = fakePosts[0];

    //act
    postsRepoStab.delete = () => {
      return { affected: 0 };
    };
    const result = postsService.deletePost(commentToDelete.id);

    //assert
    await expect(result).rejects.toThrow(new NotFoundException());
  });

  it('should return comments for a post', async () => {
    //arrange
    const expectedResult = fakePosts[0].comments;

    //act
    const result = await postsService.getComments(fakePosts[0].id);

    //assert
    expect(result).toEqual(expectedResult);
  });
});
