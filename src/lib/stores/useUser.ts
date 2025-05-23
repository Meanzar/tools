// lib/stores/useUserStore.ts
import { create } from 'zustand'
import { persist } from "zustand/middleware"
import { logout } from '../api'

type UserState = {
  userId: string | null
  isConnected: boolean
  isHydrated?: boolean
  setUser: (userId: string, isConnected: boolean) => void
  logout: () => void
}


export const useUserStore = create<UserState>()(
  persist(
    (set) => {
      const store = {
        userId: null,
        isConnected: false,
        isHydrated: false,
        setUser: (userId: string, isConnected: boolean) => {
          try {
            set({ userId: userId, isConnected: isConnected, });
          } catch (err) {
            console.error('Invalid token:', err);
            set({userId: null, isConnected: false})
          }
        },
        logout: () => {
          logout('/api')
          set({ userId: null, isConnected: false });
        },
      };

      return store;
    },
    {
      name: 'user-storage',
      partialize: (state) => ({ userId: state.userId, isConnected: state.isConnected }),
    }
  )
);
