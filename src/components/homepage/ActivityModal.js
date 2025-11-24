import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";

const ActivityModal = ({ onClose, onSuccess }) => {
  const [newActivityName, setNewActivityName] = useState("");

  const addActivity = () => {
    if (!newActivityName.trim()) return;
    axios
      .post(`${process.env.REACT_APP_API_URL}/activities`, { name: newActivityName })
      .then(() => {
        setNewActivityName("");
        onSuccess(); // 부모에게 성공 알림
        onClose(); // 모달 닫기
      })
      .catch((err) => console.error(err));
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <h3>새 활동 추가</h3>
        <input
          type="text"
          placeholder="활동 이름"
          value={newActivityName}
          onChange={(e) => setNewActivityName(e.target.value)}
        />
        <ModalButtons>
          <button onClick={addActivity}>생성</button>
          <button onClick={onClose}>취소</button>
        </ModalButtons>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ActivityModal;

// ================= styled-components =================
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalContent = styled.div`
  width: 300px;
  background: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;

  button {
    padding: 0.5rem 1rem;
    cursor: pointer;
  }
`;
