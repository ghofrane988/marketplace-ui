import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConversationService, Conversation, Message } from '../services/messaging.service';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgFor } from '@angular/common';

@Component({
  selector: 'app-messaging',
  standalone: true, // If using standalone components
  imports:[FormsModule,NgFor,CommonModule],
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.css'],
})
export class MessagingComponent implements OnInit {
  conversation: Conversation | null = null;
  newMessage = '';

  constructor(
    private route: ActivatedRoute,
    private conversationService: ConversationService,
    public authService: AuthService
  ) {}

  async ngOnInit() {
    const conversationId = this.route.snapshot.paramMap.get('id');
    if (conversationId) {
      this.conversation = await this.conversationService.getConversation(conversationId);
    }
  }

  async sendMessage() {
    if (this.conversation && this.newMessage.trim()) {
      await this.conversationService.sendMessage(this.conversation.id!, this.newMessage);
      this.newMessage = '';
      // Refresh the conversation to show the new message
      this.conversation = await this.conversationService.getConversation(this.conversation.id!);
    }
  }
}