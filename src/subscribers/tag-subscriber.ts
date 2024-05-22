import { Tag } from '../tags/tag.entity';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';

@EventSubscriber()
export class TagSubscriber implements EntitySubscriberInterface<Tag> {
  listenTo() {
    return Tag;
  }

  async beforeInsert(event: InsertEvent<Tag>) {
    const { name } = event.entity;
    const updatedName = name.toLowerCase();

    event.entity.name = updatedName;
  }
}
