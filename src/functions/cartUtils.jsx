import Cookies from 'js-cookie';

export function updateCart(newCart) {
    Cookies.set('cart', JSON.stringify(newCart), { expires: 7 });
    const event = new Event('cartChanged');
    window.dispatchEvent(event);
}

export function updateWishlist(newWishlist) {
    localStorage.setItem('loved', JSON.stringify(newWishlist));
    const event = new Event('wishlistChanged');
    window.dispatchEvent(event);
}
