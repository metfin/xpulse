import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  publicKey: string | null;
  isConnected: boolean;
  walletName?: string;
}

interface UserStore {
  user: User;
  setUser: (user: Partial<User>) => void;
  connectWallet: (publicKey: string, walletName?: string) => void;
  disconnectWallet: () => void;
  isAuthenticated: () => boolean;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: {
        publicKey: null,
        isConnected: false,
        walletName: undefined,
      },
      setUser: (userData) =>
        set((state) => ({
          user: { ...state.user, ...userData },
        })),
      connectWallet: (publicKey: string, walletName?: string) =>
        set({
          user: {
            publicKey,
            isConnected: true,
            walletName,
          },
        }),
      disconnectWallet: () =>
        set({
          user: {
            publicKey: null,
            isConnected: false,
            walletName: undefined,
          },
        }),
      isAuthenticated: () => {
        const { user } = get();
        return user.isConnected && user.publicKey !== null;
      },
    }),
    {
      name: "user-storage",
      partialize: (state) => ({ user: state.user }),
    }
  )
);
