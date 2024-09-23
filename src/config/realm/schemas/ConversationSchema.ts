import { v4 as uuidv4 } from 'uuid';
import Realm from 'realm';

export class MessageSchema extends Realm.Object<MessageSchema> {
  _id!: string;
  phoneNumber!: string;
  messageType!: 'text' | 'media/image' | 'media/video' | 'media/audio' | 'media/doc';
  replyId!: string;
  message!: string;
  caption!: string;
  edited!: boolean;
  seen!: boolean;
  timestamp!: Date;

  static schema = {
    name: 'Message',
    primaryKey: '_id',
    properties: {
      _id: 'string',
      phoneNumber: 'string',
      messageType: 'string',
      message: 'string',
      caption: 'string',
      edited: { type: 'bool', default: false },
      seen: { type: 'bool', default: false },
      timestamp: 'date',
    },
  };
}

export class ConversationSchema extends Realm.Object<ConversationSchema> {
  _id!: string;
  participants!: string[];
  messages!: Realm.List<MessageSchema>;

  static schema = {
    name: 'Conversation',
    primaryKey: '_id',
    properties: {
      _id: 'string',
      phoneNumber: 'string',
      messages: { type: 'list', objectType: 'Message' },
    },
  };
}
