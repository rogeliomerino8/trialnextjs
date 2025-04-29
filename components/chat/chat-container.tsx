"use client"

import React, { useState } from 'react'
import { X, Plus, Undo, Send } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface ChatContainerProps {
  isOpen: boolean
  onClose: () => void
}

export default function ChatContainer({ isOpen, onClose }: ChatContainerProps) {
  const [message, setMessage] = useState('')
  
  // Manejar el envío de mensajes
  const handleSendMessage = () => {
    if (message.trim()) {
      // Aquí iría la lógica para enviar el mensaje
      console.log('Mensaje enviado:', message)
      setMessage('')
    }
  }
  
  // Manejar teclas (para enviar con Enter)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }
  
  // Clases que se aplicarán condicionalmente
  const containerClasses = `
    fixed top-0 right-0 h-full w-[380px] 
    bg-[#222226] border-l border-[#2A2A2E] shadow-lg 
    z-50 flex flex-col transition-transform 
    duration-300 ease-in-out pointer-events-auto
    ${isOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none'}
  `
  
  return (
    <div className={containerClasses} style={{ boxShadow: isOpen ? '-5px 0 15px rgba(0,0,0,0.15)' : 'none' }}>
      {/* Cabecera del chat */}
      <div className="flex items-center justify-between p-4 border-b border-[#2A2A2E]">
        <div className="flex items-center">
          <h3 className="text-sm font-medium text-white">Nueva conversación</h3>
          <Button variant="ghost" size="icon" className="ml-2 h-5 w-5 text-gray-400 hover:bg-[#2A2A2E]">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:bg-[#2A2A2E]">
            <Undo className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:bg-[#2A2A2E]" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Área de mensajes */}
      <div className="flex-1 overflow-y-auto p-4 bg-[#1C1C1F]">
        {/* Mensajes del chat */}
        <div className="flex flex-col space-y-4">
          {/* Inicialmente vacío: los mensajes se mostrarán aquí */}
        </div>
      </div>
      
      {/* Área de input */}
      <div className="p-4 border-t border-[#2A2A2E] bg-[#222226]">
        <div className="flex items-end">
          <Textarea 
            placeholder="Escribe un mensaje..."
            className="flex-1 bg-[#1C1C1F] border-[#2A2A2E] resize-none focus-visible:ring-[#3B82F6] min-h-[40px]"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          <Button 
            variant="ghost" 
            size="icon" 
            className="ml-2 h-8 w-8 text-gray-400 hover:bg-[#2A2A2E]"
            onClick={handleSendMessage}
            disabled={!message.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <div className="flex gap-2">
            <Badge className="bg-[#2A2A2E] hover:bg-[#3A3A3E] text-gray-300 text-xs">
              Agente ✓
            </Badge>
          </div>
          <p>Crea, planea y construye</p>
        </div>
      </div>
    </div>
  )
} 