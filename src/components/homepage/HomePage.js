import React, { useEffect } from "react";
import Header from "../common/Header";
import Footer from "../common/Footer";
import Middle from "./Middle";
import DailyTracker from "./DailyTracker";
import ImageSlider from "./ImageSlider";
import ContainerWrapper from "./ContainerWrapper";
import InfoCardContainer from "./InfoCardContainer";

const HomePage = () => {
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/hello`)
      .then((res) => res.json())
      .then((data) => console.log(data.message))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <Header />
      <Middle style={{ position: "relative" }}>
        <ContainerWrapper>
          <DailyTracker />
          <InfoCardContainer></InfoCardContainer>
          <ImageSlider />
        </ContainerWrapper>
      </Middle>
      <Footer />
    </div>
  );
};

export default HomePage;
