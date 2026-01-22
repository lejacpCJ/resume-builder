import React from "react";
import Banner from "../components/home/Banner";
import Hero from "../components/home/Hero";
import Features from "../components/home/Features";
import Testimonial from "../components/home/Testimonial";
import CallToAction from "../components/home/CallToAction";

const Home = () => {
  return (
    <div>
      <h1>
        <Banner />
        <Hero />
        <Features />
        <Testimonial />
        <CallToAction />
      </h1>
    </div>
  );
};

export default Home;
