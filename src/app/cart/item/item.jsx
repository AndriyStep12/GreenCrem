"use client";
import React, { useState, useEffect } from "react";
import fetchGoodsFromServer from "@/functions/array";
import Link from "next/link";
import LoveBtn from "@/app/components/loveBtn/loveBtn";
import Image from "next/image";

const Item = ({ idGood, count, removeFromCart }) => {
    const [goods, setGoods] = useState([]);
    const [item, setItem] = useState(null);

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
            const foundItem = goods.find(item => item.id === idGood);
            setItem(foundItem || null);
        }
    }, [goods, idGood]);


    return (
        <div className="item">
            <div className="start">
                {item && item.img ? (
                    <Image 
                        src={`/uploads/${item.img}`} 
                        width={10000} 
                        height={10000} 
                        alt={item.name} 
                        className="image"
                        priority // Додано властивість priority
                    />
                ) : (
                    <div className="image-placeholder">No Image Available</div>
                )}
            </div>
            <div className="center">
                {item && item.name}
                <div className="row">
                    <div className="count">Кількість: {count}</div>
                    <div className="price">{item && item.price}₴</div>
                </div>
                Загальна ціна: {item && item.price * count}₴
            </div>
            <div className="end">
                {item && (
                    <Link className="link" href={`/products/${item.id}`}>Сторінка продукту</Link>
                )}
                <div className="row">
                    <LoveBtn idGood={item && item.id} />
                    <button className="btn_del" onClick={() => removeFromCart(idGood)}>
                        <Image className="del_img" src={'/icons/del.png'} width={50} height={50} alt="Delete" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Item;
