import React, { useState } from "react";
import styled from "styled-components";

// 0~23시간 배열
const hours = Array.from({ length: 24 }, (_, i) => i);

const DailyTracker = () => {
  const [records, setRecords] = useState(Array(24).fill(false));

  const toggleBlock = (hourIndex) => {
    const newRecords = [...records];
    newRecords[hourIndex] = !newRecords[hourIndex];
    setRecords(newRecords);
  };

  return React.createElement(
    TrackerWrapper,
    null,
    React.createElement(Title, null, "DAILY TRACKER"),

    React.createElement(
      GridContainer,
      null,
      hours.map((hour, index) =>
        React.createElement(
          BlockWrapper,
          { key: index },
          React.createElement(HourLabel, null, hour + "H"),
          React.createElement(HourBlock, {
            $active: records[index],
            onClick: () => toggleBlock(index),
          })
        )
      )
    )
  );
};

export default DailyTracker;

// =================== styled-components ===================

const TrackerWrapper = styled.div`
  width: 100%;
  margin-top: 4rem;
  padding: 4rem 0;  /* 위아래 여백 증가 */
  text-align: center;
`;


const Title = styled.h2`
  color: black;
  font-size: 1.8rem;
  margin-bottom: 1.8rem;
  font-weight: 700;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);  /* 8 x 3 그리드 */
  gap: 16px;
  width: 85%;
  max-width: 900px;
  margin: 0 auto;

  @media (max-width: 600px) {
    grid-template-columns: repeat(4, 1fr); /* 모바일 자동 조정 */
  }
`;

// 정사각형과 라벨을 묶는 Wrapper
const BlockWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HourLabel = styled.div`
  margin-bottom: 4px; /* 블록과 약간 띄우기 */
  font-size: 0.8rem;
  font-weight: 600;
  color: black;
`;

const HourBlock = styled.div`
  background-color: ${({ $active }) => ($active ? "#2a2a2a" : "#ffffff")};
  color: ${({ $active }) => ($active ? "#ffffff" : "#000000")};
  border: 1px solid #000000;
  border-radius: 8px;

  aspect-ratio: 1 / 1; /* 정사각형 유지 */
  width: 100%;          /* Grid에 맞춰 자동 조정 */
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background-color: ${({ $active }) =>
      $active ? "#3a3a3a" : "#f0f0f0"};
  }
`;
