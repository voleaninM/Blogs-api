import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateTagDto } from './tag.dto';
import { Tag } from './tag.entity';
import { TagsService } from './tags.service';

describe('TagsService', () => {
  let service: TagsService;
  let tagsRepoStab;

  const fakeTags: Tag[] = [{ id: 1, name: 'tag' }];

  beforeEach(async () => {
    tagsRepoStab = {
      create: () => fakeTags[0],
      save: () => Promise.resolve(fakeTags[0]),
      delete: () => Promise.resolve({ affected: 1 }),
      findOneBy: () => Promise.resolve(fakeTags[0]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagsService,
        {
          provide: getRepositoryToken(Tag),
          useValue: tagsRepoStab,
        },
      ],
    }).compile();

    service = module.get<TagsService>(TagsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a tag ', async () => {
    //arrange
    const expectedResult = fakeTags[0];

    //act
    jest.spyOn(service, 'findTagByName').mockResolvedValueOnce(null);
    const result = await service.createTag({} as CreateTagDto);

    //assert
    expect(result).toEqual(expectedResult);
  });

  it('should delete the tag', async () => {
    //arrange
    const tagToDelete = fakeTags[0];

    //act
    const result = await service.deleteTag(tagToDelete.id);

    //assert
    expect(result).toBeUndefined();
  });

  it('should throw if tag was not deleted', async () => {
    //arrange
    const tagToDelete = fakeTags[0];
    //act
    tagsRepoStab.delete = () => {
      return { affected: 0 };
    };
    const result = service.deleteTag(tagToDelete.id);

    //assert
    await expect(result).rejects.toThrow(new NotFoundException());
  });

  it('should find a tag based on name', async () => {
    //arrange
    const expectedResult = fakeTags[0];

    //act
    const result = await service.findTagByName(expectedResult.name);

    //assert
    expect(result).toEqual(expectedResult);
  });

  it('should return null if tag was not found', async () => {
    //arrange
    const expectedResult = null;

    //act
    jest.spyOn(service, 'findTagByName').mockResolvedValueOnce(null);
    const result = await service.findTagByName('');

    //assert
    expect(result).toEqual(expectedResult);
  });
});
