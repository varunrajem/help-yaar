import { FaUsers, FaMapMarkedAlt, FaHandsHelping, FaLightbulb } from "react-icons/fa";

const About = () => {
  return (
    <div className="min-h-screen bg-linear-to-tl from-green-400 via-blue-500 to-indigo-900 flex flex-col items-center text-white">
      {/* Header Section */}
      <div className="text-center py-16 px-6">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">
          About <span className="text-yellow-300">Help Yaar</span>
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-gray-200">
          Your friendly neighborhood platform to connect people who need help
          with those who can offer it. Whether it’s sharing tools, lending a hand,
          or finding nearby assistance — we bring communities closer, one click at a time.
        </p>
      </div>

      {/* Mission Section */}
      <div className="max-w-5xl w-full px-6 grid md:grid-cols-2 gap-8 mb-16 items-center">
        <div className="flex items-center justify-center">
          <FaHandsHelping className="text-8xl text-yellow-300 drop-shadow-xl" />
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-4 text-white">Our Mission</h2>
          <p className="text-gray-200 leading-relaxed">
            We aim to make helping each other simple, quick, and accessible.
            “Help Yaar” (or NearbyMate) was created to encourage kindness and community
            bonding through technology. Whether you need a helping hand, a small favor, or
            just want to support someone nearby — we make it happen easily.
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="w-full bg-white/10 backdrop-blur-md py-16 px-6 rounded-t-3xl shadow-inner">
        <h2 className="text-center text-3xl font-bold mb-10 text-yellow-300">
          What Makes Us Special
        </h2>
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Feature 1 */}
          <div className="bg-white/20 rounded-2xl shadow-lg hover:shadow-2xl p-6 text-center transition-all duration-300 hover:scale-105">
            <FaUsers className="text-5xl text-green-300 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2 text-white">Community Driven</h3>
            <p className="text-gray-200 text-sm">
              Built around real people, not just profiles. Connect and collaborate locally.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white/20 rounded-2xl shadow-lg hover:shadow-2xl p-6 text-center transition-all duration-300 hover:scale-105">
            <FaMapMarkedAlt className="text-5xl text-blue-300 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2 text-white">Location-Based Help</h3>
            <p className="text-gray-200 text-sm">
              Find people near you willing to help or ask for assistance effortlessly.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white/20 rounded-2xl shadow-lg hover:shadow-2xl p-6 text-center transition-all duration-300 hover:scale-105">
            <FaLightbulb className="text-5xl text-yellow-300 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2 text-white">Smart & Simple</h3>
            <p className="text-gray-200 text-sm">
              Easy-to-use interface with meaningful features that truly make life easier.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white/20 rounded-2xl shadow-lg hover:shadow-2xl p-6 text-center transition-all duration-300 hover:scale-105">
            <FaHandsHelping className="text-5xl text-pink-300 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2 text-white">Help & Get Help</h3>
            <p className="text-gray-200 text-sm">
              No barriers — just pure community spirit. Offer help or request it with one tap.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
