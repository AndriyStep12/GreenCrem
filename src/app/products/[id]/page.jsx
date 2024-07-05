"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import LeftBar from "@/app/components/leftBar/leftBar";
import LoveBtn from "@/app/components/loveBtn/loveBtn";
import './product.scss';
import fetchGoodsFromServer from "@/functions/array";
import Cookies from 'js-cookie';
import Loader from "@/app/components/loader/loader";
import confetti from "canvas-confetti";
import useCartStore from "@/functions/cart";

export default function Product({ params: { id } }) {
    const { carts, cartsIncrement, cartsDecrement } = useCartStore();
    const [goods, setGoods] = useState([]);
    const [product, setProduct] = useState({});
    const [count, setCount] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGoods = async () => {
            try {
                const fetchedGoods = await fetchGoodsFromServer();
                setGoods(fetchedGoods);
            } catch (error) {
                console.error('Error setting goods:', error);
            }
        };

        fetchGoods();
    }, []);

    useEffect(() => {
        if (goods.length > 0) {
            setProduct(findGoodById(goods, id));
        }
        setLoading(false);
    }, [goods, id]);

    function findGoodById(goods, id) {
        return goods.find(good => good.id === id) || {};
    }

    function functionAdd() {
        if (count < 10) {
            setCount(count + 1);
        }
    }

    function functionMinus() {
        if (count > 1) {
            setCount(count - 1);
        }
    }

    function addToCart() {
        const cartItems = JSON.parse(Cookies.get('cart') || '[]');
        const existingItem = cartItems.find(item => item.id === id);

        if (existingItem) {
            existingItem.count += count;
        } else {
            cartItems.push({ id, count });
            cartsIncrement()
        }

        Cookies.set('cart', JSON.stringify(cartItems), { expires: 7 }); // Cookies зберігається на 7 днів
        console.log(cartItems);
        
        confetti({
            particleCount: 150,
            spread: 60,
            origin: { y: 0.6 }
        });
    }

    return (
        <div className="product">
            <LeftBar />
            {loading ? <Loader/> :
                <div className="product_page">
                    <div className="product_image">
                        {product.img && <Image src={`/uploads/${product.img}`} alt={product.name} width={1000} height={1000} className="img_product" />}
                    </div>
                    <div className="product_info">
                        <h2 className="name">{product.name}</h2>
                        <h3 className="price">Ціна: {product.price}₴</h3>
                        <p>Опис: {product.description}</p>
                        {product.count > 0 ? <div className="count">
                            <button className="btn" onClick={functionMinus}>-</button>
                            <div className="counter">{count}</div>
                            <button className="btn" onClick={functionAdd}>+</button>
                        </div> : null}
                        <div className="btn_row">
                            <div className="first">
                                {product.count > 0 ? <button onClick={addToCart} className="addToCart">
                                    Добавити до корзини
                                </button> : <p className="no">Нема в наявності :(</p>}
                            </div>
                            <LoveBtn idGood={id} />
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}
