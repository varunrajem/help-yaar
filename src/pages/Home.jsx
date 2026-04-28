import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTools, FaBook, FaMotorcycle, FaBolt, FaLaptopCode, FaPaintBrush,
  FaDumbbell, FaBroom, FaCar, FaBaby, FaUtensils, FaDog
} from "react-icons/fa";

import CategoryCard from "../components/CategoryCard";
import Carousel from "../components/Carousel";

const services = [
  { id: 1, name: "Plumbing", icon: <FaTools size={40} />, description: "Fix leaks and pipes" },
  { id: 2, name: "Tutoring", icon: <FaBook size={40} />, description: "Get academic help" },
  { id: 3, name: "Delivery", icon: <FaMotorcycle size={40} />, description: "Fast deliveries" },
  { id: 4, name: "Electrician", icon: <FaBolt size={40} />, description: "Electrical repairs" },
  { id: 5, name: "Coding Help", icon: <FaLaptopCode size={40} />, description: "Software & programming assistance" },
  { id: 6, name: "Painting", icon: <FaPaintBrush size={40} />, description: "Home or office painting" },
  { id: 7, name: "Fitness Trainer", icon: <FaDumbbell size={40} />, description: "Personal training & guidance" },
  { id: 8, name: "Cleaning", icon: <FaBroom size={40} />, description: "House cleaning & organizing" },
  { id: 9, name: "Car Services", icon: <FaCar size={40} />, description: "Car repair & maintenance" },
  { id: 10, name: "Babysitting", icon: <FaBaby size={40} />, description: "Child care services" },
  { id: 11, name: "Cooking", icon: <FaUtensils size={40} />, description: "Home-cooked meals & catering" },
  { id: 12, name: "Pet Care", icon: <FaDog size={40} />, description: "Pet sitting & grooming" },
  { id: 13, name: "Gardening", icon: <FaBroom size={40} />, description: "Planting, trimming & landscaping" },
  { id: 14, name: "Event Assistance", icon: <FaPaintBrush size={40} />, description: "Help with events & parties" },
];

const Home = () => {
  const navigate = useNavigate();

  const handleCategorySelect = (categoryName) => {
    navigate(`/service/${categoryName}`);
  };

  // 🔥 Carousel Images
 const carouselImages = [
  "/image.png",
  "/image1.png",
  "/image2.png",
];

  return (
    <div className="min-h-screen bg-gradient-to-tl from-green-400 via-blue-500 to-indigo-900 mt-12">

      {/* 🔥 HERO CAROUSEL */}
      <Carousel images={carouselImages} />

      {/* 🔽 SERVICES SECTION */}
      <div className="px-4 py-10">
        <div className="max-w-7xl mx-auto text-white">

          <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            Explore Services
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {services.map((service) => (
              <CategoryCard
                key={service.id}
                icon={service.icon}
                name={service.name}
                description={service.description}
                onClick={() => handleCategorySelect(service.name)}
              />
            ))}
          </div>

        </div>
      </div>

    </div>
  );
};

export default Home;