// lib/stores/useUserStore.ts
import { create } from 'zustand'
import { persist } from "zustand/middleware"
import { jwtDecode } from 'jwt-decode'

type UserState = {
  userId: string | null
  isHydrated?: boolean
  setToken: (token: string) => void
  logout: () => void
}

type TokenPayload = {
  _id: string
  email: string
  exp: number
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => {
      const store = {
        userId: null,
        isHydrated: false,
        setToken: (token: string) => {
          try {
            const decoded = jwtDecode<TokenPayload>(token);
            localStorage.setItem('token', token);
            set({ userId: decoded._id });
          } catch (err) {
            console.error('Invalid token:', err);
          }
        },
        logout: () => {
          localStorage.removeItem('token');
          set({ userId: null });
        },
      };

      return store;
    },
    {
      name: 'user-storage',
      partialize: (state) => ({ userId: state.userId }),
    }
  )
);
