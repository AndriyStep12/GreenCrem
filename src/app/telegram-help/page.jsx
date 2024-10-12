"use client";
import React from "react";
import LeftBar from "../components/leftBar/leftBar";
import './telegram.scss'

export default function TelegramHelp() {
    return (
        <div className="telegram-help">
            <LeftBar />
            <div className="content block">
                <h2>Як користуватися ботом</h2>
                <p>Щоб скористатися ботом <a href="https://telegram.me/greencrem_bot">greencrem_bot</a>, виконайте кілька простих кроків:</p>
                <li>
                    Відкрийте чат із ботом та натисніть кнопку Start 
                </li>
                <li>
                    Щоб отримати інформацію про ваше замовлення, просто надішліть команду /find разом із вашим унікальним кодом <i>(наприклад, /find 12345)</i>.
                </li>
                <p>
                    Ваш код ви отримаєте при оформленні замовлення або знайдете у підтвердженні на вашій електронній пошті.
                </p>
            </div>
        </div>
    );
}