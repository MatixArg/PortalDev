import { create } from 'zustand'
import type { User } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  userType: 'developer' | 'company' | null
  setUser: (user: User | null) => void
  setUserType: (type: 'developer' | 'company' | null) => void
  setLoading: (loading: boolean) => void
  signOut: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  userType: null,
  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    }),
  setUserType: (userType) => set({ userType }),
  setLoading: (isLoading) => set({ isLoading }),
  signOut: () =>
    set({
      user: null,
      isAuthenticated: false,
      userType: null,
    }),
}))
