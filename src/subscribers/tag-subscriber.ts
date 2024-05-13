import { Tag } from 'src/tags/tag.entity';
import { capitalizeName } from 'src/utils';
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
    const updatedName = capitalizeName(name);

    event.entity.name = updatedName;
  }
}
