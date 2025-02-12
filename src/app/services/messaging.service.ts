import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, doc, getDoc, updateDoc, query, where, getDocs } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable } from 'rxjs';

export interface Conversation {
  id?: string; // Firestore-generated ID
  productId: string; // ID of the product
  buyerId: string; // ID of the buyer
  sellerId: string; // ID of the seller
  messages: Message[]; // Array of messages
  createdAt: Date; // Timestamp of conversation creation
  updatedAt: Date; // Timestamp of last message
}

export interface Message {
  senderId: string; // ID of the message sender
  text: string; // Content of the message
  timestamp: Date; // Timestamp of the message
}

@Injectable({
  providedIn: 'root',
})
export class ConversationService {
  constructor(private firestore: Firestore, private auth: Auth) {}

  // Create a new conversation
  async createConversation(productId: string, sellerId: string): Promise<string> {
    const buyerId = this.auth.currentUser?.uid;
    if (!buyerId) throw new Error('User not logged in');

    const conversation: Conversation = {
      productId,
      buyerId,
      sellerId,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const conversationRef = collection(this.firestore, 'conversations');
    const docRef = await addDoc(conversationRef, conversation);
    return docRef.id;
  }

  async getConversationsByUserIDAndProductID(userId: string, productId: string): Promise<Conversation | null> {
    const buyerId = this.auth.currentUser?.uid;
    if (!buyerId) throw new Error('User not logged in');
    const conversationRef = collection(this.firestore, 'conversations');
    const q = query(conversationRef, where('buyerId', '==', userId), where('productId', '==', productId));
    const conversationSnapshot = await getDocs(q);

    if (conversationSnapshot.empty) {
      return null;
    } else {
      return conversationSnapshot.docs[0].data() as Conversation;
    }
  }

  // Send a new message
  async sendMessage(conversationId: string, text: string): Promise<void> {
    if ( !conversationId ) throw new Error('No conversation ID provided');
    const senderId = this.auth.currentUser?.uid;
    if (!senderId) throw new Error('User not logged in');


    const message: Message = {
      senderId,
      text,
      timestamp: new Date(),
    };

    const conversationRef = doc(this.firestore, `conversations`, conversationId);
    console.log(conversationRef);
    const conversationDoc = await getDoc(conversationRef);
    console.log(conversationDoc.exists());
    if (conversationDoc.exists()) {
      const conversation = conversationDoc.data() as Conversation;
      await updateDoc(conversationRef, {
        messages: [...conversation.messages, message],
        updatedAt: new Date(),
      });
    }
  }

  // Get a conversation by ID
  async getConversation(conversationId: string): Promise<Conversation | null> {
    const conversationRef = doc(this.firestore, `conversations/${conversationId}`);
    const conversationDoc = await getDoc(conversationRef);
    return conversationDoc.exists() ? (conversationDoc.data() as Conversation) : null;
  }
}