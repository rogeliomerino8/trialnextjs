"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

type SupabaseContextType = {
  supabase: SupabaseClient<Database>
  isLoading: boolean
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined)

export function SupabaseProvider({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const [supabase, setSupabase] = useState<SupabaseClient<Database> | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Faltan las variables de entorno de Supabase.')
      setIsLoading(false)
      return
    }
    
    const supabaseClient = createClient<Database>(supabaseUrl, supabaseKey)
    setSupabase(supabaseClient)
    setIsLoading(false)
  }, [])

  const value = supabase ? { supabase, isLoading } : undefined

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  )
}

export const useSupabase = () => {
  const context = useContext(SupabaseContext)
  
  if (context === undefined) {
    throw new Error('useSupabase debe ser usado dentro de un SupabaseProvider')
  }
  
  return context
} 