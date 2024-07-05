import create from 'zustand';

const getWishlistItems = () => {
  if (typeof window !== 'undefined') {
    const items = localStorage.getItem('loved');
    return items ? JSON.parse(items) : [];
  }
  return [];
};

const useLikesStore = create((set) => ({
  likes: getWishlistItems().length,
  likesIncrement: () => set((state) => ({ likes: state.likes + 1 })),
  likesDecrement: () => set((state) => ({ likes: state.likes - 1 })),
}));

export default useLikesStore;
