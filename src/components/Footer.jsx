import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn, FaGithub } from "react-icons/fa";

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Logo + About */}
        <div>
          <h2 className="text-2xl font-bold text-green-400 mb-3">Help Yaar</h2>
          <p className="text-sm leading-relaxed">
            Help Yaar (NearbyMate) connects people with local helpers, services,
            and support nearby. Find trusted help — anytime, anywhere.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="/" className="hover:text-green-400 transition">Home</a></li>
            <li><a href="/" className="hover:text-green-400 transition">Nearby Services</a></li>
            <li><a href="/" className="hover:text-green-400 transition">Offer Help</a></li>
            <li><a href="/about" className="hover:text-green-400 transition">About Us</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Contact Us</h3>
          <p className="text-sm">
            Email: <a href="mailto:support@helpyar.com" className="text-green-400 hover:underline">support@helpyar.com</a>
          </p>
          <p className="text-sm mt-2">
            Phone: <a href="tel:+919473965542" className="text-green-400 hover:underline">+919473965542</a>
          </p>
          <p className="text-sm mt-2">
            Location: Greater Noida, India
          </p>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-500 hover:border-green-400 hover:text-green-400 transition duration-300">
              <FaFacebookF size={18} />
            </a>
            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-500 hover:border-green-400 hover:text-green-400 transition duration-300">
              <FaInstagram size={18} />
            </a>
            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-500 hover:border-green-400 hover:text-green-400 transition duration-300">
              <FaLinkedinIn size={18} />
            </a>
            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-500 hover:border-green-400 hover:text-green-400 transition duration-300">
              <FaTwitter size={18} />
            </a>
          </div>
        </div>
      </div>

      {/* Divider + Bottom Text */}
      <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} <span className="text-white font-semibold">Help Yaar</span> — Empowering Local Connections.
      </div>
    </footer>
  );
};
