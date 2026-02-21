import { create } from "zustand";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  updateUser: (data: Partial<User>) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  // mock logged in user
  user: {
    id: "u1",
    name: "Hosam",
    email: "hosam.admin@example.com",
    role: "Admin",
    avatar: "/images/avatar.png",
  },

  setUser: (user) => set({ user }),

  updateUser: (data) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...data } : null,
    })),

  logout: () => set({ user: null }),
}));
