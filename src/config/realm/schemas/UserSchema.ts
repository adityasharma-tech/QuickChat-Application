import Realm from 'realm';
export class UserSchema extends Realm.Object<UserSchema> {
    _id!: string;  // Adjusted to use _id as the primary key
    phoneNumber!: string;
    lastSeen!: Date;

    static schema: Realm.ObjectSchema = {
      name: 'User',
      primaryKey: '_id',         // The primary key must be _id
      properties: {
        _id: 'string',         // string for the primary key
        phoneNumber: 'string',           // Separate unique identifier for the user
        lastSeen: 'date',
      },
    };
  }
