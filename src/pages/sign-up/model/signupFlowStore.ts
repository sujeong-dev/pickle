import { create } from 'zustand';

interface SignupFlowState {
  signupToken: string | null;
  nickname: string;
  setSignupToken: (token: string) => void;
  setNickname: (nickname: string) => void;
  reset: () => void;
}

export const useSignupFlowStore = create<SignupFlowState>((set) => ({
  signupToken: null,
  nickname: '',
  setSignupToken: (token) => set({ signupToken: token }),
  setNickname: (nickname) => set({ nickname }),
  reset: () => set({ signupToken: null, nickname: '' }),
}));
