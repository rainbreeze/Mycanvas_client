import React, { useEffect } from 'react';
import Header from '../common/Header';
import Footer from '../common/Footer';
import Middle from './Middle';
import StartGameContainer from './StartGameContainer';
import ImageSlider from './ImageSlider';
import ContainerWrapper from './ContainerWrapper';
import InfoCardContainer from './InfoCardContainer';
import LiveRankingContainer from './LiveRankingContainer'

const HomePage = () => {
    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/hello`)
            .then(res => res.json())
            .then(data => console.log(data.message))
            .catch(err => console.error(err));
    }, []);

    return (
        <div>
            <Header />
            <Middle>
                <ContainerWrapper>
                    <StartGameContainer />
                    <InfoCardContainer></InfoCardContainer>
                    <ImageSlider />
                    <LiveRankingContainer></LiveRankingContainer>
                </ContainerWrapper>
            </Middle>
            <Footer />
        </div>
    );
};

export default HomePage;
