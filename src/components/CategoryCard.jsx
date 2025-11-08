// src/components/CategoryCard.jsx
import React from "react";

const CategoryCard = ({ icon, name, description, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white shadow-lg rounded-xl p-6 flex flex-col items-center justify-center hover:shadow-2xl hover:bg-blue-50 transition duration-300"
    >
      <div className="text-blue-600 mb-3">{icon}</div>
      <h2 className="font-semibold text-lg text-gray-800 mb-1">{name}</h2>
      <p className="text-gray-500 text-sm text-center">{description}</p>
    </div>
  );
};

export default CategoryCard;
