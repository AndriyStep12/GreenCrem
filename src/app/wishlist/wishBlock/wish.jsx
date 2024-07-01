"use client";
import React, { useState, useEffect } from "react";
import fetchGoodsFromServer from "@/functions/array";
import Good from "@/app/components/good/good";
import './fixing.scss'

const Wish = ({ idGood }) => {
  const [goods, setGoods] = useState([]);
  const [wish, setWish] = useState({});

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
    const foundWish = goods.find(item => item.id === idGood);
    if (foundWish) {
      setWish(foundWish);
    }
  }, [goods, idGood]);

  useEffect(() => {
    console.log(wish);
  }, [wish]);

  return (
    <Good
      id={wish.id}
      name={wish.name}
      price={wish.price}
      description={wish.description}
      count={wish.count}
      img={wish.img}
    />
  );
};

export default Wish;
