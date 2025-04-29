"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import ChatContainer from './chat/chat-container'

interface ChatContextType {
  isChatOpen: boolean
  openChat: () => void
  closeChat: () => void
  toggleChat: () => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function useChatContext() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider')
  }
  return context
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [isChatOpen, setIsChatOpen] = useState(false)

  const openChat = () => setIsChatOpen(true)
  const closeChat = () => setIsChatOpen(false)
  const toggleChat = () => setIsChatOpen(prev => !prev)

  // Efecto para escuchar el atajo de teclado Command+S o Ctrl+S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Comprobar si es Command+S (Mac) o Ctrl+S (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault() // Prevenir el comportamiento por defecto (guardar página)
        toggleChat()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Efecto para añadir/quitar clase al body cuando cambia el estado del chat
  useEffect(() => {
    if (isChatOpen) {
      document.body.classList.add('chat-open')
    } else {
      document.body.classList.remove('chat-open')
    }
    
    return () => {
      document.body.classList.remove('chat-open')
    }
  }, [isChatOpen])

  return (
    <ChatContext.Provider value={{ isChatOpen, openChat, closeChat, toggleChat }}>
      {children}
      <ChatContainer isOpen={isChatOpen} onClose={closeChat} />
    </ChatContext.Provider>
  )
} 