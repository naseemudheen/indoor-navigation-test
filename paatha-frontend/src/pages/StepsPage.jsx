import React from "react";
import { LeftArrow } from "../components/Icons";
import { StartSection, StepSection } from "../container/Steps";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const StepsPage = () => {
  return (
    <div>
      <Helmet>
        <title>Steps</title>
        <meta name="description" content="Learn how to navigate through Government Medical College with Paadha's indoor navigation system. Discover the different steps involved in using the map." />
        <link rel="canonical" href="https://paadha.com/steps" />
      </Helmet>
      <header className="flex items-center gap-5 p-4">
        <Link to="/directions">
          <LeftArrow />
        </Link>
        <h2 className="font-semibold">Steps</h2>
      </header>
      <StepSection />
      <StartSection />
    </div>
  );
};

export default StepsPage;
