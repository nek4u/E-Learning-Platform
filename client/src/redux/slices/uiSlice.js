import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarOpen: false,
    searchOpen: false,
    aiChatOpen: false,
  },
  reducers: {
    toggleSidebar: (state) => { state.sidebarOpen = !state.sidebarOpen; },
    setSidebarOpen: (state, action) => { state.sidebarOpen = action.payload; },
    toggleSearch: (state) => { state.searchOpen = !state.searchOpen; },
    toggleAiChat: (state) => { state.aiChatOpen = !state.aiChatOpen; },
  },
});

export const { toggleSidebar, setSidebarOpen, toggleSearch, toggleAiChat } = uiSlice.actions;
export default uiSlice.reducer;
