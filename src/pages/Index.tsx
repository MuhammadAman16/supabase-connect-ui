
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Footer from '@/components/Footer';
import supabaseAuth from '@/services/supabaseAuth';

const Index = () => {
  const handleConnectSupabase = () => {
    supabaseAuth.startAuthFlow();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero onConnect={handleConnectSupabase} />
      <Features />
      <Footer />
    </div>
  );
};

export default Index;
