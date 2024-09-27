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
  failed!: boolean;
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
      failed: { type: 'bool', default: false },
      timestamp: 'date',
    },
  };
}

export class ConversationSchema extends Realm.Object<ConversationSchema> {
  _id!: string;
  phoneNumber!: string;
  messages!: Realm.List<MessageSchema>;
  displayName!: string;
  profilePicture!: string;
  quotes!: string;

  static schema = {
    name: 'Conversation',
    primaryKey: '_id',
    properties: {
      _id: 'string',
      phoneNumber: 'string',
      quotes: {type: 'string', default: 'I am using your whatsapp.'},
      profilePicture: {type: 'string', default: 'https://res.cloudinary.com/do2tmd6xp/image/upload/v1727251110/samples/upscale-face-1.jpg'},
      displayName: { type: 'string', default: 'Unknown'},
      messages: { type: 'list', objectType: 'Message' },
    },
  };
}
