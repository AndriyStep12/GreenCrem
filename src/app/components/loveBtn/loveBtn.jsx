"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import likes from "@/functions/likes";
import './loveBtn.scss';

const LoveBtn = ({ idGood }) => {
    const { likes, likesIncrement, likesDecrement } = likes();
    const [loved, setLoved] = useState([]);
    const [status, setStatus] = useState(false);

    useEffect(() => {
        const savedLoved = JSON.parse(localStorage.getItem('loved')) || [];
        setLoved(savedLoved);
        setStatus(savedLoved.includes(idGood));
    }, [idGood]);

    useEffect(() => {
        setStatus(loved.includes(idGood));
    }, [loved, idGood]);

    const addToLoved = () => {
        const savedLoved = JSON.parse(localStorage.getItem('loved')) || [];
        let updatedLoved;
        if (status) {
            updatedLoved = savedLoved.filter(item => item !== idGood);
            likesDecrement()
        } else {
            updatedLoved = [...savedLoved, idGood];
            likesIncrement()
        }
        setLoved(updatedLoved);
        localStorage.setItem('loved', JSON.stringify(updatedLoved));
    };

    return (
        <button 
            className={`love ${status ? 'active' : 'passive'}`} 
            onClick={addToLoved} 
            id={`love${idGood}`}
        >
            <Image 
                src={`/icons/favourite.png`} 
                width={100} 
                height={100} 
                alt={'loveBtn'} 
                className="love_img" 
            />
        </button>
    );
};

export default LoveBtn;
