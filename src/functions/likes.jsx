import create from 'zustand';

const getWishlistItems = () => JSON.parse(localStorage.getItem('loved') || '[]');

const likes = create((set) => ({
  likes: getWishlistItems().length,
  likesIncrement: () => set((state) => ({ count: state.count + 1 })),
  likesDecrement: () => set((state) => ({ count: state.count - 1 })),
}));

export default likes;
