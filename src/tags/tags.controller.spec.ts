import { Test, TestingModule } from '@nestjs/testing';
import { mockTag, mockTagDto, mockTagService, response } from '../mocks/tags';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';

describe('TagsController', () => {
  let controller: TagsController;
  let service: TagsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagsController],
      providers: [TagsService],
    })
      .overrideProvider(TagsService)
      .useValue(mockTagService)
      .compile();

    controller = module.get<TagsController>(TagsController);
    service = module.get<TagsService>(TagsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a tag', () => {
    const dto = { name: 'tag' };
    expect(controller.createTag(dto)).toEqual({
      id: expect.any(Number),
      name: dto.name,
    });
    expect(mockTagService.createTag).toHaveBeenCalledWith(dto);
  });

  it('should delete a tag', () => {
    expect(controller.delete(1)).toEqual(response);
    expect(mockTagService.deleteTag).toHaveBeenCalledWith(1);
  });

  // it('should create a tag', async () => {
  //   const expectedOutput = await controller.createTag(mockTagDto);
  //   expect(service.createTag).toHaveBeenCalled();
  //   expect(service.createTag).toHaveBeenCalledWith(mockTagDto);
  //   expect(expectedOutput).toEqual(mockTag);
  // });

  // it('should delete a tag by id', async () => {
  //   const expectedOutput = await controller.delete(1);
  //   expect(service.deleteTag).toHaveBeenCalled();
  //   expect(service.deleteTag).toHaveBeenCalledWith(1);
  //   expect(expectedOutput).toEqual(response);
  // });
});
