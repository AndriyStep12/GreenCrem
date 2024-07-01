"use client";
import React, { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import LeftBar from "../components/leftBar/leftBar";
import fetchGoodsFromServer from "@/functions/array";
import Item from "./item/item";
import Loader from "../components/loader/loader";
import './cart.scss';

export default function Cart() {
    const [totalPrice, setTotalPrice] = useState(0);
    const [loading, setLoading] = useState(true);
    const [cartItems, setCartItems] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: ''
    });

    const [array, setArray] = useState([])

    const [goods, setGoods] = useState([]);

    useEffect(() => {
        const fetchGoods = async () => {
            try {
                const fetchedGoods = await fetchGoodsFromServer();
                setGoods(fetchedGoods);
            } catch (error) {
                console.error('Error fetching goods:', error);
            }
        };

        fetchGoods();
    }, []);


    useEffect(() => {
        const updatedCartItems = cartItems.map(cartItem => {
            const foundItem = goods.find(good => good.id === cartItem.id);
            return {
                ...cartItem,
                price: foundItem ? foundItem.price : 0, // Додаємо ціну до кожного елемента корзини
                img: foundItem ? foundItem.img : '',
                name: foundItem ? foundItem.name : ''
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
        calculateTotalPrice(); // recalculate total price after removal
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const sendOrderEmail = async () => {
        const response = await fetch('https://greencrem.onrender.com/send-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cartItems, formData }),
        });

        Cookies.set('cart', JSON.stringify([]), { expires: 7 });
        setCartItems([]);
        setTotalPrice(0);
        alert('Замовлення відправлено!');
        setShowPopup(false);
    };

    useEffect(() => {
        if (showPopup){
            document.body.style.overflowY = "hidden";
        } else{
            document.body.style.overflowY = "auto";
        }
    }, [showPopup]);

    return (
        <div className="cart">
            <LeftBar />
            {loading ? <Loader/> :
                <div className="content">
                    <h2>Корзина</h2>
                    <div className="row">
                        {cartItems.length > 0 ? (
                            cartItems.map(item => (
                                <Item key={item.id} idGood={item.id} count={item.count} price={item.price} removeFromCart={removeFromCart} />
                            ))
                        ) : (
                            <h3 className="pusto" style={{textAlign: "center"}}>Ваша корзина пуста</h3>
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
                                <input type="text" name="phone" placeholder="Номер телефону" value={formData.phone} onChange={handleInputChange} />
                            </label>
                            <label>
                                <input type="email" name="email" placeholder="Емейл" value={formData.email} onChange={handleInputChange} />
                            </label>
                            <span>Вартість: {totalPrice}$</span>
                            <button onClick={sendOrderEmail}>Підтвердити</button>
                            <button className="cancel" onClick={() => setShowPopup(false)}>Скасувати</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
