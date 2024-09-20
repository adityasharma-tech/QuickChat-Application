import mongoose from 'mongoose';
import Realm from 'realm';

export async function checkConversationWithSenderId(realm: Realm, senderId: string) {
  
    try {
      // Query to check if any conversation contains the senderId in participants array
      const conversation = realm.objects('Conversation').filtered('participants CONTAINS $0', senderId);
  
      if (conversation.length > 0) {
        return conversation;  // Returns all conversations with the senderId
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error checking conversation:', error);
    }
  }


export async function createNewConversation(
  realm: Realm,
  participants: string[],
  message=""
) {
  console.log("asd fasdf slkdf a", (new mongoose.Types.ObjectId()).toString())
  try {
    realm.write(() => {
        const newMessage = realm.create('Message', {
            _id: new mongoose.Types.ObjectId(),
            senderId: participants[0],
            receiverId: participants[1],
            messageText: message,
            timestamp: new Date(),
          });
      realm.create('Conversation', {
        _id: new mongoose.Types.ObjectId(),
        participants: participants,
        messages: [newMessage], // Empty list initially, can add messages later
      });
    });
  } catch (error) {
    console.error('Error creating conversation:', error);
  }
}

export async function addMessageToConversation(
  realm: Realm,
  conversationId: mongoose.Types.ObjectId,
  senderId: string,
  receiverId: string,
  messageText: string,
) {
  try {
    realm.write(() => {
      const conversation = realm.objectForPrimaryKey(
        'Conversation',
        conversationId,
      );
      console.log("@@@@@@@@@@@@@@@@@",{
        _id: new mongoose.Types.ObjectId(),
        senderId,
        receiverId,
        messageText,
        timestamp: new Date(),
      })

      if (conversation) {
        const newMessage = realm.create('Message', {
          _id: new mongoose.Types.ObjectId(),
          senderId,
          receiverId,
          messageText,
          timestamp: new Date(),
        });
        //@ts-ignore
        conversation?.messages?.push(newMessage);
        console.log('Message added to conversation:', newMessage);
      } else {
        console.error('Conversation not found');
      }
    });
  } catch (error) {
    console.error('Error adding message:', error);
  }
}
