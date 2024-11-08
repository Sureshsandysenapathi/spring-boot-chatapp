package com.example.chatapp.controller;

import com.example.chatapp.model.ChatMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    @MessageMapping("/sendMessage")  // Route for receiving messages
    @SendTo("/topic/messages")  // Destination for broadcasting
    public ChatMessage sendMessage(ChatMessage message) {
        return message; // Broadcasts message to all clients
    }
}
