'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaStar, FaHeart, FaSearch, FaTshirt, FaHatCowboy, FaMugHot, FaShippingFast, FaShieldAlt, FaTags, FaLock, FaFacebook, FaTiktok, FaInstagram } from 'react-icons/fa';
import Image from 'next/image';

// Mock product images
const productImages = {
  tshirt: "/tshirt.png",
  cap: "/cap.png",
  mug: "/mug.png",
  hoodie: "/hoodie.png",
  notebook: "/notebook.png",
  beanie: "/beanie.png",
  mousepad: "/mousepad.png",
  poster: "/poster.png"
};

export default function StorePage() {
  const [cartItems, setCartItems] = useState(3);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Product data
  const products = [
    {
      id: 1,
      name: "AleTube Signature Tee",
      price: 450,
      category: "clothing",
      rating: 4.8,
      description: "Premium quality cotton t-shirt with AleTube logo",
      image: productImages.tshirt,
      featured: true
    },
    {
      id: 2,
      name: "Habesha Cap",
      price: 350,
      category: "accessories",
      rating: 4.6,
      description: "Adjustable baseball cap with Ethiopian flag colors",
      image: productImages.cap,
      featured: true
    },
    {
      id: 3,
      name: "Reaction King Mug",
      price: 280,
      category: "accessories",
      rating: 4.9,
      description: "Ceramic coffee mug with AleTube catchphrases",
      image: productImages.mug,
      featured: true
    },
    {
      id: 4,
      name: "Viral Video Hoodie",
      price: 650,
      category: "clothing",
      rating: 4.7,
      description: "Warm hoodie with AleTube branding",
      image: productImages.hoodie
    },
    {
      id: 5,
      name: "Content Creator Notebook",
      price: 220,
      category: "accessories",
      rating: 4.5,
      description: "Premium notebook for content ideas",
      image: productImages.notebook
    },
    {
      id: 6,
      name: "Ethiopian Colors Beanie",
      price: 320,
      category: "accessories",
      rating: 4.6,
      description: "Warm beanie in Ethiopian flag colors",
      image: productImages.beanie
    },
    {
      id: 7,
      name: "Streamer Mousepad",
      price: 180,
      category: "accessories",
      rating: 4.4,
      description: "Extra large gaming mousepad with AleTube design",
      image: productImages.mousepad
    },
    {
      id: 8,
      name: "Limited Edition Poster",
      price: 150,
      category: "accessories",
      rating: 4.9,
      description: "Signed poster of AleTube's most popular video",
      image: productImages.poster
    }
  ];

  // Categories
  const categories = [
    { id: 'all', name: 'All Products', icon: <FaTags /> },
    { id: 'clothing', name: 'Clothing', icon: <FaTshirt /> },
    { id: 'accessories', name: 'Accessories', icon: <FaHatCowboy /> },
    { id: 'drinkware', name: 'Drinkware', icon: <FaMugHot /> }
  ];

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: "easeOut" 
      }
    }
  };

  const staggerChildren = {
    visible: { 
      transition: { 
        staggerChildren: 0.1 
      } 
    }
  };

  const cardHover = {
    hover: { 
      y: -10,
      transition: { 
        duration: 0.3, 
        ease: "easeOut" 
      }
    }
  };

  // Handle buy now
  const handleBuyNow = (productId: number) => {
    alert(`Purchased product #${productId}! Redirecting to checkout...`);
    // In a real app, you would redirect to checkout page
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white overflow-x-hidden">

      {/* Products Section */}
      <div id="products-section" className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">
            {selectedCategory === 'all' ? 'All Products' : categories.find(c => c.id === selectedCategory)?.name}
          </h2>
          <div className="text-gray-400">
            {filteredProducts.length} products
          </div>
        </div>
        
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">😢</div>
            <h3 className="text-2xl font-bold mb-2">No products found</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              Try adjusting your search or filter to find what you're looking for
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl overflow-hidden border border-slate-700 hover:border-red-500/30 transition-colors"
                variants={{ ...fadeIn, ...cardHover }}
                whileHover="hover"
              >
                <div className="relative">
                  <div className="relative w-full h-60">
                    <Image 
                      src={product.image} 
                      alt={product.name}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  {product.featured && (
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold px-3 py-1 rounded-full text-sm">
                      BESTSELLER
                    </div>
                  )}
                  <button className="absolute top-4 right-4 bg-slate-900/80 hover:bg-red-500 p-2 rounded-full">
                    <FaHeart />
                  </button>
                </div>
                
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold">{product.name}</h3>
                    <span className="bg-red-900/30 text-red-300 px-2 py-1 rounded text-sm">
                      {product.price} ETB
                    </span>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-4">{product.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-amber-400">
                      <FaStar />
                      <span className="ml-1 text-white">{product.rating}</span>
                    </div>
                    <button 
                      className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white px-4 py-2 rounded-lg text-sm transition-all shadow-md shadow-red-500/20"
                      onClick={() => handleBuyNow(product.id)}
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <FaShippingFast className="text-3xl text-red-500" />,
              title: "Fast Shipping",
              description: "Delivery across Ethiopia in 3-5 business days"
            },
            {
              icon: <FaShieldAlt className="text-3xl text-red-500" />,
              title: "Quality Guarantee",
              description: "Premium materials with 30-day satisfaction guarantee"
            },
            {
              icon: <FaLock className="text-3xl text-red-500" />,
              title: "Secure Payment",
              description: "All transactions protected with encryption"
            }
          ].map((feature, index) => (
            <motion.div 
              key={index}
              className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Fans Are Saying</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Don't just take our word for it - hear from our satisfied customers
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Selam T.",
              location: "Addis Ababa",
              comment: "The quality of the Signature Tee exceeded my expectations! It's become my favorite shirt.",
              rating: 5
            },
            {
              name: "Kaleb M.",
              location: "Dire Dawa",
              comment: "Fast shipping and premium products. The mug is perfect for my morning coffee while watching AleTube!",
              rating: 5
            },
            {
              name: "Meron A.",
              location: "Hawassa",
              comment: "Love supporting my favorite Ethiopian YouTuber. The hoodie is super comfortable and stylish.",
              rating: 4
            }
          ].map((testimonial, index) => (
            <motion.div 
              key={index}
              className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar 
                    key={i} 
                    className={`text-sm ${i < testimonial.rating ? 'text-amber-400' : 'text-gray-700'}`} 
                  />
                ))}
              </div>
              <p className="text-gray-300 mb-6 italic">"{testimonial.comment}"</p>
              <div>
                <div className="font-bold">{testimonial.name}</div>
                <div className="text-gray-400 text-sm">{testimonial.location}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="text-2xl font-bold mb-4">AleTube Store</div>
              <p className="text-gray-400 mb-4">
                Premium merchandise for fans of Ethiopia's top YouTube channel
              </p>
              <div className="flex gap-4">
                <button className="bg-slate-800 p-2 rounded-full hover:bg-slate-700 transition-colors">
                  <FaTiktok />
                </button>
                <button className="bg-slate-800 p-2 rounded-full hover:bg-slate-700 transition-colors">
                  <FaInstagram />
                </button>
                <button className="bg-slate-800 p-2 rounded-full hover:bg-slate-700 transition-colors">
                  <FaFacebook />
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Shop</h3>
              <ul className="space-y-2">
                {['All Products', 'New Arrivals', 'Best Sellers', 'Sale Items'].map((item, i) => (
                  <li key={i}>
                    <a href="#" className="text-gray-400 hover:text-red-400 transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Support</h3>
              <ul className="space-y-2">
                {['Contact Us', 'Shipping Policy', 'Returns & Exchanges', 'FAQs'].map((item, i) => (
                  <li key={i}>
                    <a href="#" className="text-gray-400 hover:text-red-400 transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Email: store@aletube.com</li>
                <li>Phone: +251 123 456 789</li>
                <li>Addis Ababa, Ethiopia</li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-800 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} AleTube Store. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}