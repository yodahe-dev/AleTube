'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaTiktok, FaInstagram, FaFacebook, FaTwitch, FaReddit, FaEnvelope, FaMapMarkerAlt, FaPhone, FaPaperPlane } from 'react-icons/fa';
import { Button } from '@/components/ui/button';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    }, 1500);
  };

  // Social media links
  const socialLinks = [
    { platform: "TikTok", icon: <FaTiktok className="text-black" />, url: "https://tiktok.com/@alexis_alex_ii_twitch", color: "bg-gradient-to-r from-purple-500 to-pink-500" },
    { platform: "Instagram", icon: <FaInstagram className="text-white" />, url: "https://instagram.com/alexis_alex_ii", color: "bg-gradient-to-r from-fuchsia-500 to-amber-500" },
    { platform: "Facebook", icon: <FaFacebook className="text-white" />, url: "https://facebook.com/aletube2", color: "bg-gradient-to-r from-blue-600 to-blue-800" },
    { platform: "Twitch", icon: <FaTwitch className="text-white" />, url: "https://twitch.tv/alexis_alex_ii", color: "bg-gradient-to-r from-purple-600 to-indigo-700" },
    { platform: "Reddit", icon: <FaReddit className="text-white" />, url: "https://reddit.com/r/aletubefun", color: "bg-gradient-to-r from-orange-500 to-red-600" },
  ];

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative py-28 md:py-36 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 to-slate-950" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.1)_0%,transparent_70%)]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerChildren}
          >
            <motion.div 
              className="inline-flex items-center bg-red-900/30 text-red-300 px-4 py-1 rounded-full mb-4"
              variants={fadeIn}
            >
              <FaEnvelope className="mr-2" />
              Contact AleTube
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-red-600"
              variants={fadeIn}
            >
              Get in Touch with AleTube
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-300 max-w-3xl mx-auto"
              variants={fadeIn}
            >
              Have questions, partnership inquiries, or just want to say hello? Reach out to us!
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <motion.div 
            className="lg:col-span-1"
            initial="hidden"
            animate="visible"
            variants={staggerChildren}
          >
            <motion.div variants={fadeIn} className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-red-600">
                Connect with AleTube
              </h2>
              <p className="text-gray-400 mb-8">
                Ethiopian YouTuber Creating Entertaining Content for the Habesha Community & worldwide.
                NEW VIDEOS EVERY WEEK! ☻ Make Sure You SUBSCRIBE to the Ale Tube YouTube Channel.
              </p>
              
              <div className="space-y-6">
                <motion.div variants={fadeIn} className="flex items-start">
                  <div className="bg-red-500 p-3 rounded-full mr-4">
                    <FaEnvelope className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">Email Us</h3>
                    <a href="mailto:contact@aletube.com" className="text-gray-400 hover:text-red-400 transition-colors">
                      contact@aletube.com
                    </a>
                  </div>
                </motion.div>
                
                <motion.div variants={fadeIn} className="flex items-start">
                  <div className="bg-red-500 p-3 rounded-full mr-4">
                    <FaMapMarkerAlt className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">Based In</h3>
                    <p className="text-gray-400">Addis Ababa, Ethiopia</p>
                  </div>
                </motion.div>
                
                <motion.div variants={fadeIn} className="flex items-start">
                  <div className="bg-red-500 p-3 rounded-full mr-4">
                    <FaPhone className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">Call Us</h3>
                    <p className="text-gray-400">+251 123 456 789</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div variants={fadeIn}>
              <h3 className="text-xl font-bold mb-6">Follow AleTube</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-4">
                {socialLinks.map((link, index) => (
                  <motion.a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center p-4 rounded-xl ${link.color} hover:opacity-90 transition-opacity`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="text-2xl mr-2">{link.icon}</div>
                    <span className="font-medium">{link.platform}</span>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>
          
          {/* Contact Form */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 md:p-10 border border-slate-700">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Send us a message</h2>
              
              {submitSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-xl mb-8"
                >
                  <div className="flex items-center">
                    <div className="bg-white/20 p-2 rounded-full mr-4">
                      <FaPaperPlane className="text-xl" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Message Sent Successfully!</h3>
                      <p>Thank you for contacting AleTube. We'll get back to you soon.</p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-gray-400 mb-2">Your Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="John Smith"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-gray-400 mb-2">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-gray-400 mb-2">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="What's this about?"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-gray-400 mb-2">Your Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Tell us what you need..."
                    ></textarea>
                  </div>
                  
                  <div>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          <FaPaperPlane className="mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Location Map Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-red-600">
            Where to Find Us
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Based in the heart of Ethiopia, creating content for the world
          </p>
        </motion.div>
        
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 border border-slate-700 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Addis Ababa Studio</h3>
              <p className="text-gray-400 mb-6">
                Our production studio is located in the vibrant city of Addis Ababa, where we create all of AleTube's entertaining reaction videos and content.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-red-500 p-2 rounded-full mr-3 mt-1">
                    <FaMapMarkerAlt className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold">Address</h4>
                    <p className="text-gray-400">Bole Road, Addis Ababa, Ethiopia</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-red-500 p-2 rounded-full mr-3 mt-1">
                    <FaPhone className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold">Phone</h4>
                    <p className="text-gray-400">+251 123 456 789</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-red-500 p-2 rounded-full mr-3 mt-1">
                    <FaEnvelope className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold">Email</h4>
                    <p className="text-gray-400">studio@aletube.com</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-80 flex items-center justify-center text-gray-500">
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d462561.6574537445!2d55.22748795!3d25.076022449999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43496ad9c645%3A0xbde66e5084295162!2sDubai%20-%20United%20Arab%20Emirates!5e0!3m2!1sen!2set!4v1750266810503!5m2!1sen!2set" width="600" height="450" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-3xl p-8 md:p-12 border border-slate-700 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-red-500 rounded-full filter blur-[100px] opacity-20" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500 rounded-full filter blur-[100px] opacity-20" />
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Join the AleTube Community</h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Subscribe to our YouTube channel for the latest funny reaction videos
              </p>
              <Button className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-bold py-4 px-8 rounded-full text-lg transition-all transform hover:scale-105">
                Subscribe Now
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-2xl font-bold mb-4">AleTube</div>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            Ethiopian YouTuber Creating Entertaining Content for the Habesha Community & worldwide
          </p>
          <div className="flex justify-center gap-6 mb-8">
            {['Home', 'Videos', 'Packages', 'Contact', 'About'].map((item) => (
              <a key={item} href="#" className="text-gray-400 hover:text-red-400 transition-colors">
                {item}
              </a>
            ))}
          </div>
          <div className="text-gray-500 text-sm">
            © {new Date().getFullYear()} AleTube. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}