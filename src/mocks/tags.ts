import { CreateTagDto } from 'src/tags/tag.dto';
import { Tag } from 'src/tags/tag.entity';

export const mockTagDto: CreateTagDto = {
  name: 'tag',
};

export const mockTag: Tag = {
  id: 1,
  name: 'tag',
};
export const response = { message: 'Tag successfully deleted' };
export const mockTagRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
  findOneBy: jest.fn(),
};
export const mockTagService = {
  createTag: jest.fn((dto: CreateTagDto) => {
    return {
      id: Date.now(),
      ...dto,
    };
  }),
  deleteTag: jest.fn((id: number) => response),
};
// export const mockTagService = {
//   createTag: jest.fn().mockReturnValue(mockTag),
//   deleteTag: jest.fn().mockReturnValue(response),
//   findTagByName: jest.fn().mockReturnValue(mockTag),
// };
