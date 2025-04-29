"use client"

import React from 'react'
import { MessageSquare } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useChatContext } from './chat-provider'

export default function ChatButton() {
  const { toggleChat, isChatOpen } = useChatContext()
  
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-9 w-9 rounded-full hover:bg-[#2A2A2E]"
      onClick={toggleChat}
      title="Abrir chat (⌘+S)"
    >
      <MessageSquare className={`h-5 w-5 ${isChatOpen ? 'text-blue-400' : 'text-gray-400'}`} />
    </Button>
  )
} 