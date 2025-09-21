'use client';

import Navbar from './Navbar';
import Hero from './Hero';
import Services from './Services';
import Projects from './Projects';
import Testimonials from './Testimonials';
import Contact from './Contact';
import Footer from './Footer';

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Services />
      <Projects />
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  );
}
