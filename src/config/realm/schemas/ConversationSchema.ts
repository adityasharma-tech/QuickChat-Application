import Realm from 'realm';
import {BSON} from 'realm'

const MessageStatusT = {
  Received: 'received',
  Seen: 'seen',
  Deleted: 'deleted',
} as const;
type MessageStatusT = (typeof MessageStatusT)[keyof typeof MessageStatusT];

export class MessageSchema extends Realm.Object<MessageSchema> {
  _id!: BSON.ObjectId;
  senderId!: string;
  receiverId!: string;
  messageText!: string;
  timestamp!: Date;

  static schema = {
    name: 'Message',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      senderId: 'string',
      receiverId: 'string',
      messageText: 'string',
      timestamp: 'date',
    },
  };
}

export class ConversationSchema  extends Realm.Object<ConversationSchema> {
  _id!: BSON.ObjectId;
  participants!: string[];
  messages!: Realm.List<MessageSchema>;

  static schema = {
    name: 'Conversation',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      participants: 'string[]',
      messages: {type: 'list', objectType: 'Message'},
    },
  };
}
