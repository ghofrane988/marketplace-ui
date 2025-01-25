import { Component, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ChatMessage {
  text: string;
  sender: 'user' | 'bot';
  time: Date;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements AfterViewChecked {
  @ViewChild('chatMessages') private chatMessages!: ElementRef;
  @ViewChild('messageInput') private messageInput!: ElementRef;

  isOpen = false;
  userMessage = '';
  messages: ChatMessage[] = [];

  // Predefined responses for common questions
  private responses: { [key: string]: string } = {
    'bonjour': 'Bonjour! Comment puis-je vous aider aujourd\'hui?',
    'aide': 'Je peux vous aider avec:\n- La navigation sur le site\n- La publication d\'articles\n- La recherche de produits\n- Les questions sur votre compte',
    'compte': 'Pour gérer votre compte, vous pouvez:\n1. Vous connecter\n2. Créer un nouveau compte\n3. Modifier vos informations\n4. Réinitialiser votre mot de passe',
    'produit': 'Pour publier un produit:\n1. Connectez-vous à votre compte\n2. Cliquez sur "Ajouter un produit"\n3. Remplissez les informations\n4. Ajoutez des photos\n5. Cliquez sur "Publier"',
    'contact': 'Vous pouvez nous contacter par:\n- Email: support@example.com\n- Téléphone: +1234567890\n- Formulaire de contact sur le site',
    'default': 'Je ne comprends pas votre question. Pouvez-vous la reformuler ou choisir parmi les sujets suivants:\n- Aide générale\n- Compte\n- Publication de produit\n- Contact'
  };

  constructor() {
    // Add welcome message
    this.addMessage('Bonjour! Je suis votre assistant. Comment puis-je vous aider?', 'bot');
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  toggle() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      setTimeout(() => {
        if (this.messageInput) {
          this.messageInput.nativeElement.focus();
        }
      }, 300);
    }
  }

  close() {
    this.isOpen = false;
  }

  sendMessage() {
    const message = this.userMessage.trim();
    if (message) {
      // Add user message
      this.addMessage(message, 'user');
      
      // Get bot response
      setTimeout(() => {
        const response = this.getBotResponse(message.toLowerCase());
        this.addMessage(response, 'bot');
      }, 500);

      // Clear input
      this.userMessage = '';
    }
  }

  private addMessage(text: string, sender: 'user' | 'bot') {
    this.messages.push({
      text,
      sender,
      time: new Date()
    });
  }

  private getBotResponse(message: string): string {
    // Check for keywords in the message
    for (const [key, response] of Object.entries(this.responses)) {
      if (message.includes(key)) {
        return response;
      }
    }
    return this.responses['default'];
  }

  private scrollToBottom() {
    try {
      if (this.chatMessages) {
        this.chatMessages.nativeElement.scrollTop = this.chatMessages.nativeElement.scrollHeight;
      }
    } catch (err) {}
  }
}
