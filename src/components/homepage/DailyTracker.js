import React, { useState } from "react";
import styled from "styled-components";

// 0~23시간 배열
const hours = Array.from({ length: 24 }, (_, i) => i);

// LEFT/RIGHT 탭용 블록 배열 (생성 블록 포함)
const leftBlocks = Array.from({ length: 7 }, (_, i) => i);
const rightBlocks = Array.from({ length: 6 }, (_, i) => i);

// BottomTab용 블록 배열 (생성 블록 포함)
const bottomBlocks = Array.from({ length: 7 }, (_, i) => i);

const DailyTrackerPage = () => {
  const [records, setRecords] = useState(Array(24).fill(false));
  const [leftRecords, setLeftRecords] = useState(Array(leftBlocks.length).fill(false));
  const [rightRecords, setRightRecords] = useState(Array(rightBlocks.length).fill(false));
  const [bottomRecords, setBottomRecords] = useState(Array(bottomBlocks.length).fill(false));

  const toggleBlock = (records, setRecords, index) => {
    const newRecords = [...records];
    newRecords[index] = !newRecords[index];
    setRecords(newRecords);
  };

  return (
    <PageWrapper>
      <ContentWrapper>
        {/* LEFT 탭 */}
        <SideTab>
          <TabTitle>주간 할 일</TabTitle>
          <SideGrid>
            {leftBlocks.map((block, index) => (
              <HourBlock
                key={index}
                $active={leftRecords[index]}
                $isCreate={index === leftBlocks.length - 1}
                $isSideCreate={index === leftBlocks.length - 1}
                onClick={() => toggleBlock(leftRecords, setLeftRecords, index)}
              >
                {index === leftBlocks.length - 1 ? "+" : ""}
              </HourBlock>
            ))}
          </SideGrid>
        </SideTab>

        {/* 메인 트래커 */}
        <MainTracker>
          <Title>일일 기록</Title>
          <GridContainer>
            {hours.map((hour, index) => (
              <BlockWrapper key={index}>
                <HourLabel>{hour}H</HourLabel>
                <HourBlock
                  $active={records[index]}
                  onClick={() => toggleBlock(records, setRecords, index)}
                />
              </BlockWrapper>
            ))}
          </GridContainer>
        </MainTracker>

        {/* RIGHT 탭 */}
        <SideTab>
          <TabTitle>자주 하는 활동</TabTitle>
          <SideGrid>
            {rightBlocks.map((block, index) => (
              <HourBlock
                key={index}
                $active={rightRecords[index]}
                $isCreate={index === rightBlocks.length - 1}
                $isSideCreate={index === rightBlocks.length - 1}
                onClick={() => toggleBlock(rightRecords, setRightRecords, index)}
              >
                {index === rightBlocks.length - 1 ? "+" : ""}
              </HourBlock>
            ))}
          </SideGrid>
        </SideTab>
      </ContentWrapper>

      {/* Bottom Tab */}
      <BottomTab>
        <TabTitle>기타 활동</TabTitle>
        <BottomGrid>
          {bottomBlocks.map((block, index) => (
            <HourBlock
              key={index}
              $active={bottomRecords[index]}
              $isCreate={index === bottomBlocks.length - 1}
              onClick={() => toggleBlock(bottomRecords, setBottomRecords, index)}
            >
              {index === bottomBlocks.length - 1 ? "+" : ""}
            </HourBlock>
          ))}
        </BottomGrid>
      </BottomTab>
    </PageWrapper>
  );
};

export default DailyTrackerPage;

// ================= styled-components =================

const PageWrapper = styled.div`
  width: 100%;
  padding: 4rem 0;
  margin-top: 2rem;
`;

const ContentWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;

  @media (max-width: 900px) {
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }
`;

const MainTracker = styled.main`
  flex: 1;
  max-width: 900px;
  text-align: center;
  margin: 0 50px 20px 50px;
`;

const Title = styled.h2`
  color: black;
  font-size: 1.8rem;
  margin-bottom: 1.8rem;
  font-weight: 700;
`;

const SideTab = styled.div`
  width: 250px;
  background-color: #ffffff;
  border: 1px solid #000000;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;

  @media (max-width: 900px) {
    width: 85%;
    margin-top: 0;
  }
`;

const TabTitle = styled.div`
  font-weight: 700;
  margin-bottom: 0.8rem;
`;

const SideGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 2열 */
  gap: 16px;
`;

const BottomTab = styled.div`
  width: 85%;
  max-width: 900px;
  background-color: #ffffff;
  border: 1px solid #000000;
  border-radius: 8px;
  padding: 2rem 1rem;
  margin: 2rem auto;
  text-align: center;
`;

const BottomGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr); /* 8열 기준 */
  gap: 16px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(6, 1fr);
  }
  @media (max-width: 800px) {
    grid-template-columns: repeat(4, 1fr);
  }
  @media (max-width: 500px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 16px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(6, 1fr);
  }
  @media (max-width: 800px) {
    grid-template-columns: repeat(4, 1fr);
  }
  @media (max-width: 500px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const BlockWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HourLabel = styled.div`
  margin-bottom: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  color: black;
`;

const HourBlock = styled.div`
  background-color: ${({ $active, $isSideCreate, $isCreate }) =>
    $isSideCreate || $isCreate
      ? "#000"          // 생성 버튼: 검정 배경
      : $active
      ? "#2a2a2a"
      : "#ffffff"};
  color: ${({ $active, $isSideCreate, $isCreate }) =>
    $isSideCreate || $isCreate
      ? "#fff"          // 생성 버튼: 흰색 글씨
      : $active
      ? "#fff"
      : "#000"};
  border: ${({ $isSideCreate, $isCreate }) =>
    $isSideCreate || $isCreate
      ? "2px solid #fff" // 생성 버튼 테두리
      : "1px solid #000"};
  border-radius: 8px;
  aspect-ratio: 1 / 1;
  width: 100%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.2rem;
  transition: 0.2s;

  &:hover {
    background-color: ${({ $active, $isSideCreate, $isCreate }) =>
      $isSideCreate || $isCreate
        ? "#333"       // 생성 버튼 hover
        : $active
        ? "#3a3a3a"
        : "#f0f0f0"};
  }
`;
