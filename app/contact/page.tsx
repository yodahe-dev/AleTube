"use client";

import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
});

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: ""
    }
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);

    // Simulate API request
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    toast.success("Message sent successfully!", {
      description: "We'll get back to you soon",
      position: "top-center"
    });
    reset();
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#10171c] to-[#192937] pt-16">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('/geometric-pattern.svg')] bg-[length:300px] opacity-5"></div>

        <div className="container mx-auto px-4 py-20 md:py-28 relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight"
              variants={itemVariants}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#EAA632] via-[#F0C050] to-[#EAA632]">
                ያግኙን
              </span>
              <span className="block mt-4 text-2xl sm:text-3xl text-[#EAA632] font-medium">
                Contact ወቸው Good
              </span>
            </motion.h1>

            <motion.div 
              className="mt-8 max-w-2xl mx-auto"
              variants={itemVariants}
            >
              <p className="text-lg md:text-xl text-[#C9D1D9] leading-relaxed">
                ለጥያቄዎች፣ ለትብብር ሀሳቦች ወይም በቀላሉ ለማነጋገር፣ እኛ እዚህ ነን።
                <br className="hidden sm:block" />
                We love hearing from our listeners and partners!
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="bg-[#1a2430] border border-[#2a3a4a] rounded-2xl overflow-hidden shadow-xl">
                <CardHeader className="border-b border-[#2a3a4a]">
                  <CardTitle className="text-2xl font-bold text-[#EAA632]">
                    የእርስዎን መልእክት ላኩ
                  </CardTitle>
                  <p className="text-[#9CA3AF] mt-2">
                    Fill out the form below and we'll get back to you
                  </p>
                </CardHeader>

                <CardContent className="pt-8">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-[#C9D1D9] mb-2">
                        Name / ስም
                      </label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        className="bg-[#1f2d3b] border-[#385666] text-white placeholder-[#6b7c8c] rounded-xl py-5 px-4 focus:border-[#EAA632] focus:ring-[#EAA632]"
                        {...register("name")}
                      />
                      {errors.name && (
                        <p className="mt-2 text-sm text-[#F87171]">
                          {errors.name.message?.toString()}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-[#C9D1D9] mb-2">
                        Email / ኢሜይል
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        className="bg-[#1f2d3b] border-[#385666] text-white placeholder-[#6b7c8c] rounded-xl py-5 px-4 focus:border-[#EAA632] focus:ring-[#EAA632]"
                        {...register("email")}
                      />
                      {errors.email && (
                        <p className="mt-2 text-sm text-[#F87171]">
                          {errors.email.message?.toString()}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-[#C9D1D9] mb-2">
                        Message / መልእክት
                      </label>
                      <Textarea
                        id="message"
                        placeholder="Write your message here..."
                        rows={5}
                        className="bg-[#1f2d3b] border-[#385666] text-white placeholder-[#6b7c8c] rounded-xl py-5 px-4 focus:border-[#EAA632] focus:ring-[#EAA632]"
                        {...register("message")}
                      />
                      {errors.message && (
                        <p className="mt-2 text-sm text-[#F87171]">
                          {errors.message.message?.toString()}
                        </p>
                      )}
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="pt-4"
                    >
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-[#EAA632] to-[#D69528] hover:from-[#F0B03C] hover:to-[#EAA632] text-black font-bold py-6 rounded-xl text-lg shadow-lg transition-all duration-300"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center">
                            <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></span>
                            Sending...
                          </span>
                        ) : (
                          "Send Message"
                        )}
                      </Button>
                    </motion.div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col"
            >
              <div className="bg-[#1a2430] border border-[#2a3a4a] rounded-2xl p-8 shadow-xl h-full flex flex-col justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-[#EAA632] mb-6">Contact Info</h2>

                  <p className="text-[#C9D1D9] mb-4 leading-relaxed">
                    Wechew Good Podcast<br />
                    Addis Ababa, Ethiopia
                  </p>

                  <div className="space-y-4 text-[#9CA3AF]">
                    <p><strong>Phone:</strong> +251 11 123 4567</p>
                    <p><strong>Phone:</strong> +251 91 765 4321</p>
                    <p><strong>Email:</strong> contact@wechewgood.com</p>
                    <p><strong>Website:</strong> www.wechewgood.com</p>
                  </div>
                </div>

                <div className="mt-8 rounded-xl overflow-hidden shadow-lg border border-[#2a3a4a]">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3978.024690877369!2d38.76607141528761!3d9.03040159272844!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b855aa89b30c5%3A0x7d89f7debb6c4158!2sAddis%20Ababa%2C%20Ethiopia!5e0!3m2!1sen!2sus!4v1697037263832!5m2!1sen!2sus"
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    title="Wechew Good Location"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
