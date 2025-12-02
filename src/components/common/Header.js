import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { useLocation } from "react-router-dom";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [userName, setuserName] = useState(null);
  const [profileImage, setProfileImage] = useState(null); // 추가

  const location = useLocation();
  const transparentPaths = ["/playlist", "/viewreview"];
  const isTransparentPage = transparentPaths.includes(location.pathname);

  useEffect(() => {
    const loggedUserId = localStorage.getItem("userId");
    const loggeduserName = localStorage.getItem("userName");
    const loggedProfileImage = localStorage.getItem("profileImage");

    if (loggedUserId) {
      setUser({ userId: loggedUserId });
      setuserName({ userName: loggeduserName });

      if (loggedProfileImage) {
        const fullImageUrl =
          loggedProfileImage.startsWith("http") ||
          loggedProfileImage.startsWith("/")
            ? `${process.env.REACT_APP_API_URL}${
                loggedProfileImage.startsWith("/") ? "" : "/uploads/"
              }${loggedProfileImage}`
            : `${process.env.REACT_APP_API_URL}/uploads/${loggedProfileImage}`;
        setProfileImage(fullImageUrl);
      } else {
        setProfileImage(null);
      }
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <HeaderWrapper
      scrolled={scrolled}
      transparent={isTransparentPage && !scrolled}
    >
      <Logo src="/images/logo_image.png" alt="Logo" />

      <HamburgerMenu onClick={toggleSidebar}>
        <FaBars size={24} color="#000" />
      </HamburgerMenu>

      <NavLeft>
        <NavList>
          <NavItem scrolled={scrolled}>
            <NavLink as={Link} to="/" isFirst>
              홈
            </NavLink>
          </NavItem>
        </NavList>
        <NavList>
          <NavItem scrolled={scrolled}>
            <NavLink as={Link} to="/board" isFirst>
              게시판
            </NavLink>
          </NavItem>
        </NavList>
                <NavList>
          <NavItem scrolled={scrolled}>
            <NavLink as={Link} to="/" isFirst>
              주간 트래커
            </NavLink>
          </NavItem>
        </NavList>
                <NavList>
          <NavItem scrolled={scrolled}>
            <NavLink as={Link} to="/" isFirst>
              주간 기록
            </NavLink>
          </NavItem>
        </NavList>
                <NavList>
          <NavItem scrolled={scrolled}>
            <NavLink as={Link} to="/" isFirst>
              월간 기록
            </NavLink>
          </NavItem>
        </NavList>
      </NavLeft>

      <NavRight>
        <SearchContainer>
          <SearchIcon />
          <SearchInput type="text" placeholder="검색어를 입력해주세요." />
        </SearchContainer>
        <NavList>
          {user && (
            <NavItem scrolled={scrolled}>
              <NavLink as={Link} to="/mypage">
                내 정보
              </NavLink>
            </NavItem>
          )}
          {user ? (
            <NavItem scrolled={scrolled} onClick={handleLogout}>
              <NavLink as={Link} to="/" isLogout={true}>
                로그아웃
              </NavLink>
            </NavItem>
          ) : (
            <>
              <NavItem scrolled={scrolled}>
                <NavLink as={Link} to="/login">
                  로그인
                </NavLink>
              </NavItem>
              <NavItem scrolled={scrolled}>
                <NavLink as={Link} to="/signup" isSignup>
                  회원가입
                </NavLink>
              </NavItem>
            </>
          )}
        </NavList>
      </NavRight>

      {/* 항상 렌더링하는 오버레이와 사이드바 */}
      <Overlay open={isSidebarOpen} onClick={() => setIsSidebarOpen(false)} />
      <Sidebar open={isSidebarOpen} onClick={(e) => e.stopPropagation()}>
        <SidebarBanner>
          <ProfileImage
            src={profileImage ? profileImage : "/images/header/profile.png"}
            alt="Profile"
          />
          <TextBox>
            <UserName>
              {user ? `안녕하세요, ${userName.userName}님` : "게스트"}
            </UserName>
            <WelcomeText>음악과 게임을 즐겨보세요.</WelcomeText>
          </TextBox>
        </SidebarBanner>
        <SidebarList>
          {user && (
            <SidebarItem onClick={() => setIsSidebarOpen(false)}>
              <NavLink as={Link} to="/mypage">
                내 정보
              </NavLink>
            </SidebarItem>
          )}

          {user ? (
            <SidebarItem
              onClick={() => {
                handleLogout();
                setIsSidebarOpen(false);
              }}
            >
              <NavLink as={Link} to="/" isLogout={true}>
                로그아웃
              </NavLink>
            </SidebarItem>
          ) : (
            <>
              <SidebarItem onClick={() => setIsSidebarOpen(false)}>
                <NavLink as={Link} to="/login">
                  로그인
                </NavLink>
              </SidebarItem>
              <SidebarItem onClick={() => setIsSidebarOpen(false)}>
                <NavLink as={Link} to="/signup" isSignup={true}>
                  회원가입
                </NavLink>
              </SidebarItem>
            </>
          )}
        </SidebarList>
      </Sidebar>
    </HeaderWrapper>
  );
};

export default Header;

// 스타일 컴포넌트

// 여기 추가
const WelcomeText = styled.div`
  font-size: 1.5vw;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
  margin-top: 0.3vw;
`;

const SidebarBanner = styled.div`
  width: 100%;
  height: 18vh;
  background-image: url("/images/header/banner_bg.png"); /* 배경 이미지 경로 */
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: start;
  padding: 0 4vw;
  box-sizing: border-box;
  color: white;
  border-top-left-radius: 10px;
`;

const TextBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ProfileImage = styled.img`
  width: 10vh;
  height: 10vh;
  border-radius: 50%;
  object-fit: cover;
  object-position: center; /* 이미지 중앙을 기준으로 자르기 */
  margin-right: 1.5vw;
  border: 2px solid white;
  display: block; /* inline 이미지 여백 제거 */
`;

const UserName = styled.div`
  font-size: 2.5vw;
  font-weight: bold;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  z-index: 98;
  opacity: ${({ open }) => (open ? 1 : 0)};
  pointer-events: ${({ open }) => (open ? "auto" : "none")};
  transition: opacity 0.3s ease;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: rgba(200, 200, 200, 0.3);
  border: 1px solid rgba(180, 180, 180, 0.4);
  border-radius: 6px;
  padding: 0.4vh 0.8vw;
  height: 4.5vh;
`;

const SearchInput = styled.input`
  background: transparent;
  border: none;
  outline: none;
  color: #333;
  font-size: 0.9vw;
  font-family: "Noto Sans KR", sans-serif;
  margin-left: 0.5vw;
  ::placeholder {
    color: #888;
  }
`;

const SearchIcon = styled(FiSearch)`
  color: #888;
  font-size: 1.3vw;
`;

const HeaderWrapper = styled.header`
  position: fixed;
  top: 0;
  z-index: 99;
  width: 100%;
  height: 8vh;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0 2%;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s ease;

  background-color: ${({ transparent, scrolled }) =>
    transparent ? "transparent" : "white"};
`;

const Logo = styled.img`
  height: 80%;
  width: auto;
  display: flex;
  margin-left: 5%;
`;

const HamburgerMenu = styled.div`
  display: none;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 10vw;
  }
`;

const NavLeft = styled.nav`
  display: flex;
  justify-content: flex-start;
  margin-left: 3%;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavRight = styled.nav`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-left: auto;
  margin-right: 3%;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavList = styled.ul`
  list-style-type: none;
  display: flex;
  height: 8vh;
  padding: 0;
`;

const NavLink = styled.a`
  text-decoration: none;
  color: rgba(0, 0, 0, 0.5);
  font-size: 1vw;
  font-family: "Noto Sans KR", sans-serif;
  font-weight: 700;
  transition: 0.7s ease;

  ${(props) =>
    props.isLogout &&
    `
    color: black !important;
  `}

  ${(props) =>
    props.isFirst &&
    `
    color: black !important;
  `}

  ${(props) =>
    props.isSignup &&
    `
    color: black !important;
  `}

  @media (max-width: 768px) {
    font-size: 2.5vw;
  }
`;

const NavItem = styled.li`
  padding: 0 1.5vw;
  height: 100%;
  display: flex;
  align-items: center;
  border-radius: 10px;
  transition: 0.7s ease;
  position: relative;

  &:hover {
    a {
      color: black;
    }
  }
`;

const Sidebar = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 45vw;
  height: 100%;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  z-index: 100;
  transform: translateX(${(props) => (props.open ? "0" : "100%")});
  transition: transform 0.3s ease-in-out;
  border-top-left-radius: 10px; /* 왼쪽 상단 둥글게 */
  border-bottom-left-radius: 10px;
`;

const SidebarList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  width: 100%;
`;

const SidebarItem = styled.li`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 2.5vh 0;
  text-align: left;
  color: #fff;
  border-bottom: 1.5px solid rgba(0, 0, 0, 0.5);

  &:hover {
    background-color: #f5f5f5;
    a {
      color: black;
      font-weight: 900;
    }
  }

  &:first-child {
    border-top: 1.5px solid rgba(0, 0, 0, 0.5);
  }
`;
