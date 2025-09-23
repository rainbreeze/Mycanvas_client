import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/homepage/HomePage';
import LoginPage from './components/loginpage/LoginPage';
import RegisterPage from './components/registerpage/RegisterPage'
import MyPage from "./components/mypage/MyPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />  {/* 홈 페이지 */}
        <Route path="/login" element={<LoginPage />} />  {/* 로그인/회원가입 페이지 */}
        <Route path="/mypage" element={<MyPage />} />  {/* 내 정보 페이지 */}
        <Route path="/signup" element={<RegisterPage />} />  {/* 회원가입입 페이지 */}
      </Routes>
    </Router>
  );
}


export default App;
