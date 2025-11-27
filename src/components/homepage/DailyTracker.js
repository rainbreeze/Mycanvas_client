import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import ActivityModal from "./ActivityModal";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDrag, useDrop } from "react-dnd";

const hours = Array.from({ length: 24 }, (_, i) => i);
const leftBlocks = Array.from({ length: 7 }, (_, i) => i);
const rightBlocks = Array.from({ length: 6 }, (_, i) => i);

const DailyTrackerPage = () => {
  const [leftRecords, setLeftRecords] = useState(Array(leftBlocks.length).fill(false));
  const [rightRecords, setRightRecords] = useState(Array(rightBlocks.length).fill(false));

  const [bottomActivities, setBottomActivities] = useState([]);
  const [bottomRecords, setBottomRecords] = useState([]);

  const [hourActivities, setHourActivities] = useState(Array(24).fill(null));
  const [showModal, setShowModal] = useState(false);

  const toggleBlock = (records, setRecords, index) => {
    const newRecords = [...records];
    newRecords[index] = !newRecords[index];
    setRecords(newRecords);
  };

  const fetchActivities = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/activities`)
      .then((res) => {
        setBottomActivities(res.data);
        setBottomRecords(Array(res.data.length).fill(false));
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  // ⬇ 액티비티 블럭 드래그 컴포넌트
  const DraggableActivity = ({ activity }) => {
    const [{ isDragging }, dragRef] = useDrag({
      type: "ACTIVITY",
      item: { activity },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    return (
      <HourBlock
        ref={dragRef}
        style={{
          opacity: isDragging ? 0.4 : 1,
        }}
      >
        {activity.name}
      </HourBlock>
    );
  };

  // ⬇ drop 가능 시간 블럭
  const DroppableHourBlock = ({ hourIndex }) => {
    const [{ isOver }, dropRef] = useDrop({
      accept: "ACTIVITY",
      drop: (item) => handleDropActivity(item.activity, hourIndex),
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    });

    return (
      <HourBlock
        ref={dropRef}
        style={{
          backgroundColor: isOver ? "#d1ffd1" : "#fff",
          border: "1px solid #000",
        }}
      >
        {hourActivities[hourIndex]?.name || ""}
      </HourBlock>
    );
  };

  // ⬇ drop 처리
  const handleDropActivity = (activity, hourIndex) => {
    const updated = [...hourActivities];
    updated[hourIndex] = activity;
    setHourActivities(updated);

    // 서버 저장할 경우
    // axios.post(`${process.env.REACT_APP_API_URL}/assign`, {
    //   hour: hourIndex,
    //   activityId: activity.id,
    // });
  };

  // 모바일 tabs
  const responsiveTabs = [
    { title: "주간 할 일", records: leftRecords, setRecords: setLeftRecords, blocks: leftBlocks },
    { title: "자주 하는 활동", records: rightRecords, setRecords: setRightRecords, blocks: rightBlocks },
    { title: "기타 활동", records: bottomRecords, setRecords: setBottomRecords, blocks: bottomActivities },
  ];

  return (
    <DndProvider backend={HTML5Backend}>
      <PageWrapper>
        <ContentWrapper>
          {/* LEFT 탭 */}
          <SideTab className="side-tab">
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

          {/* 메인 */}
          <MainTracker>
            <Title>일일 기록</Title>
            <GridContainer>
              {hours.map((hour, index) => (
                <BlockWrapper key={index}>
                  <HourLabel>{hour}H</HourLabel>
                  <DroppableHourBlock hourIndex={index} />
                </BlockWrapper>
              ))}
            </GridContainer>

            {/* 모바일 탭 */}
            <ResponsiveBottomTabs>
              {responsiveTabs.map(({ title, records, setRecords, blocks }, i) => (
                <BottomTab key={i}>
                  <TabTitle>{title}</TabTitle>
                  <BottomGrid>
                    {title === "기타 활동"
                      ? blocks.map((activity) => (
                          <DraggableActivity key={activity.id} activity={activity} />
                        ))
                      : blocks.map((block, idx) => (
                          <HourBlock
                            key={idx}
                            $active={records[idx]}
                            $isCreate={idx === blocks.length - 1}
                            onClick={() => toggleBlock(records, setRecords, idx)}
                          >
                            {idx === blocks.length - 1 ? "+" : ""}
                          </HourBlock>
                        ))}

                    {title === "기타 활동" && (
                      <HourBlock $isCreate onClick={() => setShowModal(true)}>
                        +
                      </HourBlock>
                    )}
                  </BottomGrid>
                </BottomTab>
              ))}
            </ResponsiveBottomTabs>
          </MainTracker>

          {/* RIGHT 탭 */}
          <SideTab className="side-tab">
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

        {/* 하단 기타 활동 */}
        <BottomTab className="bottom-tab">
          <TabTitle>기타 활동</TabTitle>
          <BottomGrid>
            {bottomActivities.map((activity) => (
              <DraggableActivity key={activity.id} activity={activity} />
            ))}
            <HourBlock $isCreate onClick={() => setShowModal(true)}>+</HourBlock>
          </BottomGrid>
        </BottomTab>

        {showModal && (
          <ActivityModal onClose={() => setShowModal(false)} onSuccess={fetchActivities} />
        )}
      </PageWrapper>
    </DndProvider>
  );
};

export default DailyTrackerPage;

/* ================= styled-components ================= */

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

    .side-tab {
      display: none;
    }
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
  margin-top: 100px;
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
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
`;

const BottomTab = styled.div`
  width: 100%;
  max-width: 900px;
  background-color: #ffffff;
  border: 1px solid #000000;
  border-radius: 8px;
  padding: 2rem 1rem;
  margin: 2rem auto;
  text-align: center;

  @media (max-width: 900px) {
    &.bottom-tab {
      display: none;
    }
  }
`;

const ResponsiveBottomTabs = styled.div`
  display: none;

  @media (max-width: 900px) {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 2rem;
  }
`;

const BottomGrid = styled.div`
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

const HourBlock = styled.div.attrs({})`
  background-color: ${({ $active, $isSideCreate, $isCreate }) =>
    $isSideCreate || $isCreate ? "#000" : $active ? "#2a2a2a" : "#ffffff"};
  color: ${({ $active, $isSideCreate, $isCreate }) =>
    $isSideCreate || $isCreate ? "#fff" : $active ? "#fff" : "#000"};
  border: ${({ $isSideCreate, $isCreate }) =>
    $isSideCreate || $isCreate ? "2px solid #fff" : "1px solid #000"};
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
`;

