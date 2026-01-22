import React from "react";
import Banner from "../components/home/Banner";
import Hero from "../components/home/Hero";
import Features from "../components/home/Features";

const Home = () => {
  return (
    <div>
      <h1>
        <Banner />
        <Hero />
        <Features />
      </h1>
    </div>
  );
};

export default Home;
