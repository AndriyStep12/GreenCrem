import create from 'zustand';

const getWishlistItems = () => JSON.parse(localStorage.getItem('loved') || []);

const useLikesStore = create((set) => ({
  likes: getWishlistItems().length,
  likesIncrement: () => set((state) => ({ likes: state.likes + 1 })),
  likesDecrement: () => set((state) => ({ likes: state.likes - 1 })),
}));

export default useLikesStore;
