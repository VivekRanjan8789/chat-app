import { create } from "zustand";
import { createChatSlice } from "./slices/chat-slice";

export const useAppStore = create((set, get)=>({
    ...createChatSlice(set, get)
}))