"use client";
import React, { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import LeftBar from "../components/leftBar/leftBar";
import fetchGoodsFromServer from "@/functions/array";
import fetchOrdersFromServer from "@/functions/orders";
import Item from "./item/item";
import Loader from "../components/loader/loader";
import useCartStore from "@/functions/cart";
import Head from "next/head";
import './cart.scss';

export default function Cart() {
    const { carts, cartsIncrement, cartsDecrement, cartsZero } = useCartStore();
    const [totalPrice, setTotalPrice] = useState(0);
    const [loading, setLoading] = useState(true);
    const [cartItems, setCartItems] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [orderSent, setOrderSent] = useState(false);
    const [order, setOrder] = useState('')
    const [formData, setFormData] = useState({
        name: '',
        sename: '',
        phone: '',
        email: ''
    });

    const [goods, setGoods] = useState([]);
    const [orders, setOrders] = useState([]);

    useEffect(()=>{
        console.log(cartItems)
    }, [cartItems])

    const fetchGoods = async () => {
        try {
            const fetchedGoods = await fetchGoodsFromServer();
            setGoods(fetchedGoods);
            updateCartWithGoodsDetails(fetchedGoods); // Оновлюємо кукіси з даними про товари
        } catch (error) {
            console.error('Error fetching goods:', error);
        }
    };

    const fetchOrders = async () => {
        try {
            const fetchedOrders = await fetchOrdersFromServer();
            setOrders(fetchedOrders);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const updateCartWithGoodsDetails = (fetchedGoods) => {
        const savedCart = JSON.parse(Cookies.get('cart') || '[]');
        const updatedCart = savedCart.map(cartItem => {
            const foundItem = fetchedGoods.find(good => good.id === cartItem.id);
            if (foundItem) {
                const { count, ...itemDetails } = foundItem; // Видаляємо count
                return {
                    ...cartItem,
                    ...itemDetails,
                    price: itemDetails.price || cartItem.price,
                    img: itemDetails.img || cartItem.img,
                    name: itemDetails.name || cartItem.name,
                    description: itemDetails.description || cartItem.description,
                    tags: itemDetails.tags || cartItem.tags
                };
            }
            return cartItem;
        });

        Cookies.set('cart', JSON.stringify(updatedCart), { expires: 7 });
        setCartItems(updatedCart);
    };

    useEffect(() => {
        fetchGoods();
        fetchOrders();
    }, []);

    useEffect(() => {
        const updatedCartItems = cartItems.map(cartItem => {
            const foundItem = goods.find(good => good.id === cartItem.id);
            return {
                ...cartItem,
                price: foundItem ? foundItem.price : 0,
                img: foundItem ? foundItem.img : '',
                name: foundItem ? foundItem.name : '',
                description: foundItem ? foundItem.description : '',
                tags: foundItem ? foundItem.tags : []
            };
        });

        const total = updatedCartItems.reduce((sum, item) => sum + (item.price * item.count), 0);
        setTotalPrice(total);
    }, [goods, cartItems]);

    useEffect(() => {
        const savedCart = JSON.parse(Cookies.get('cart') || '[]');
        setCartItems(savedCart);
        setLoading(false);
    }, []);

    const calculateTotalPrice = () => {
        const total = cartItems.reduce((sum, item) => sum + (item.price || 0) * item.count, 0);
        setTotalPrice(total);
    };

    const removeFromCart = (idGood) => {
        const updatedCart = cartItems.filter(item => item.id !== idGood);
        setCartItems(updatedCart);
        Cookies.set('cart', JSON.stringify(updatedCart), { expires: 7 });
        calculateTotalPrice();
        cartsDecrement();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const generateOrderCode = () => {
        return Math.random().toString(36).substr(2, 9).toUpperCase();
    };

    const sendOrderEmail = async () => {
        const orderCode = generateOrderCode();
        setOrder(orderCode)
        const response = await fetch('https://greencrem.onrender.com/send-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cartItems, formData, orderCode }),
        });

        Cookies.set('cart', JSON.stringify([]), { expires: 7 });
        setCartItems([]);
        setTotalPrice(0);
        setOrderSent(true);
        setShowPopup(false);
        cartsZero();
    };

    useEffect(() => {
        if (showPopup || orderSent || cartItems.length === 0) {
            document.body.style.overflowY = "hidden";
            if (orderSent) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } else {
            document.body.style.overflowY = "auto";
        }
    }, [showPopup, orderSent, cartItems]);

    const closeOrderConfirmation = () => {
        setOrderSent(false);
        document.body.style.overflowY = "auto";
    };

    const copyOrderToClipboard = () => {
        navigator.clipboard.writeText(order).then(() => {
            alert("Номер замовлення скопійовано!");
        });
    };


    return (
        <>
            <div className="cart">
                <LeftBar />
                {loading ? <Loader /> :
                    <div className="content">
                        <h2>Корзина</h2>
                        <div className="row">
                            {cartItems.length > 0 ? (
                                cartItems.map(item => (
                                    <Item key={item.id} idGood={item.id} count={item.count} price={item.price} removeFromCart={removeFromCart} />
                                ))
                            ) : (
                                <h3 className="pusto" style={{textAlign: "center", width: "100%", margin: "40px 0"}}>Ваша корзина пуста</h3>
                            )}
                        </div>
                        {cartItems.length > 0 && (
                            <button className="send-order-btn" onClick={() => setShowPopup(true)}>
                                Відправити замовлення
                            </button>
                        )}
                    </div>
                }
                {showPopup && (
                    <>
                        <div className="overlay" />
                        <div className="popup">
                            <div className="popup-content">
                                <h2>Оформлення замовлення</h2>
                                <label>
                                    <input type="text" name="name" placeholder="Ім'я" value={formData.name} onChange={handleInputChange} />
                                </label>
                                <label>
                                    <input type="text" name="sename" placeholder="Прізвище" value={formData.sename} onChange={handleInputChange} />
                                </label>
                                <label>
                                    <input type="text" name="phone" placeholder="Номер телефону" value={formData.phone} onChange={handleInputChange} />
                                </label>
                                <label>
                                    <input type="email" name="email" placeholder="Емейл" value={formData.email} onChange={handleInputChange} />
                                </label>
                                <span>Вартість: {totalPrice}₴</span>
                                <button onClick={sendOrderEmail}>Підтвердити</button>
                                <button className="cancel" onClick={() => setShowPopup(false)}>Скасувати</button>
                            </div>
                        </div>
                    </>
                )}
                {orderSent && (
                    <div className="overlayOrder">
                        <div className="order-confirmation">
                            <div>
                                <ul>
                                    <li>Ваше замовлення було успішно відправлено.</li>
                                    <li>Будь ласка, перевірте свій email для подальшої інформації.</li>
                                    <li>Код вашого замовлення: <b>{order}</b>.</li>
                                </ul>
                                <button onClick={copyOrderToClipboard}>Копіювати номер</button>
                                <button onClick={closeOrderConfirmation}>Повернутися</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
