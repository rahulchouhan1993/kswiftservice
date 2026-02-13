import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const StarRating = ({ rating = 0, maxStars = 5 }) => {
    const stars = [];

    for (let i = 1; i <= maxStars; i++) {
        if (rating >= i) {
            stars.push(<FaStar key={i} className="text-yellow-400" />);
        } 
        else if (rating >= i - 0.5) {
            stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
        } 
        else {
            stars.push(<FaRegStar key={i} className="text-gray-300" />);
        }
    }

    return <div className="flex items-center gap-0.5">{stars}</div>;
};

export default StarRating;
