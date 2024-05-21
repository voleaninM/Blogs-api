import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TagsService } from 'src/tags/tags.service';
import { CreatePostDto, FilterOptionsDto } from './post.dto';
import { Post } from './post.entity';
import { PostsService } from './posts.service';

describe('PostsService', () => {
  let postsService: PostsService;
  let tagsService: TagsService;
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
  const fakeTagsService = {
    createTag: jest.fn(),
    deleteTag: jest.fn(),
    findTagByName: jest.fn(),
  };
  const deleteResponse = 'Post successfully deleted';

  beforeEach(async () => {
    postsRepoStab = {
      find: () => Promise.resolve(fakePosts),
      findBy: () => Promise.resolve(fakePosts),
      findOne: () => Promise.resolve(fakePosts[0]),
      create: () => fakePosts[0],
      save: () => Promise.resolve(fakePosts[0]),
      findOneBy: () => Promise.resolve(fakePosts[0]),
      delete: () => Promise.resolve(deleteResponse),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: TagsService,
          useValue: fakeTagsService,
        },
        {
          provide: getRepositoryToken(Post),
          useValue: postsRepoStab,
        },
      ],
    }).compile();

    postsService = module.get<PostsService>(PostsService);
    tagsService = module.get<TagsService>(TagsService);
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
});
