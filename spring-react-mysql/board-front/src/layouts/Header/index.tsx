import './style.css';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  AUTH_PATH,
  BOARD_DETAIL_PATH,
  BOARD_PATH,
  BOARD_UPDATE_PATH,
  BOARD_WRITE_PATH,
  MAIN_PATH,
  SEARCH_PATH,
  USER_PATH,
} from 'constant';
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useBoardStore, useLoginUserStore } from 'stores';
import { fileUploadRequest, postBoardRequest } from 'apis';
import { PostBoardRequestDto } from 'apis/request/board';
import { PostBoardResponseDto } from 'apis/response/board';
import { ResponseDto } from 'apis/response';

export default function Header() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // 로그인 상태
  const [cookies, setCookies] = useCookies();
  const [isLogin, setLogin] = useState<boolean>(false);
  const { loginUser, setLoginUser, resetLoginUser } = useLoginUserStore();

  // 페이지 상태
  const [isAuthPage, setAuthPage] = useState<boolean>(false);
  const [isMainPage, setMainPage] = useState<boolean>(false);
  const [isSearchPage, setSearchPage] = useState<boolean>(false);
  const [isBoardDetailPage, setBoardDetailPage] = useState<boolean>(false);
  const [isBoardWritePage, setBoardWritePage] = useState<boolean>(false);
  const [isBoardUpdatePage, setBoardUpdatePage] = useState<boolean>(false);
  const [isUserPage, setUserPage] = useState<boolean>(false);

  const onLogoClickHandler = () => {
    navigate(MAIN_PATH());
  };

  const SearchButton = () => {
    // 검색 버튼 클릭 이벤트 핸들링을 위한 useRef
    const searchButtonRef = useRef<HTMLDivElement | null>(null);
    // 검색 버튼 상태
    const [status, setStatus] = useState<boolean>(false);
    // 검색어
    const [word, setWord] = useState<string>('');

    // useParams 를 사용해서 search/:searchWord 에서 searchWord 를 가져온다.
    const { searchWord } = useParams();

    const onSearchWordChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setWord(value);
    };

    // 검색어 입력 후 엔터키를 누르면 검색 버튼을 클릭하여 검색을 실행하게 된다.
    const onSearchWordKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== 'Enter') return;
      if (!word) return;
      if (!searchButtonRef) return;
      searchButtonRef.current?.click();
    };

    const onSearchButtonClickHandler = () => {
      if (!status) {
        setStatus(!status); // 검색 버튼을 클릭하면 검색어를 입력할 수 있는 상자가 나타남
        return;
      }
      if (!word) return;
      navigate(SEARCH_PATH(word));
    };

    // 검색 후에도 검색한 내용이 검색창에 유지되도록 처리
    useEffect(() => {
      // search/:searchWord 에서 searchWord 가 존재한다면 해당 searchWord를 value로 설정
      if (searchWord) {
        setWord(searchWord);
        setStatus(true);
      }
    }, [searchWord]);

    if (!status) {
      return (
        <div className='icon-button'>
          <div className='icon search-light-icon' onClick={onSearchButtonClickHandler}></div>
        </div>
      );
    } else {
      return (
        <div className='header-search-input-box'>
          <input
            className='header-search-input'
            type='text'
            placeholder='검색어를 입력해 주세요.'
            value={word}
            onChange={onSearchWordChangeHandler}
            onKeyDown={onSearchWordKeyDownHandler}
          />
          <div ref={searchButtonRef} className='icon-button' onClick={onSearchButtonClickHandler}>
            <div className='icon search-light-icon'></div>
          </div>
        </div>
      );
    }
  };

  // 로그인 및 마이페이지 버튼 컴포넌트
  const MyPageButton = () => {
    const { userEmail } = useParams();

    const onMyPageButtonClickHandler = () => {
      if (!loginUser) return;
      const { email } = loginUser;
      navigate(USER_PATH(email));
    };

    // 로그인
    const onSignInButtonClickHandler = () => {
      navigate(AUTH_PATH());
    };

    // 로그아웃
    const onSignOutButtonClickHandler = () => {
      // 현재 로그인된 사용자 정보 초기화
      resetLoginUser();
      // accessToken 쿠키를 삭제하고 만료일을 현재 시간으로 설정
      setCookies('accessToken', '', { path: MAIN_PATH(), expires: new Date() });
      navigate(MAIN_PATH());
    };

    // 마이페이지에서 로그아웃 할 수 있도록 함
    if (isLogin && userEmail === loginUser?.email) {
      return (
        <div className='white-button' onClick={onSignOutButtonClickHandler}>
          로그아웃
        </div>
      );
    }
    if (isLogin) {
      return (
        <div className='white-button' onClick={onMyPageButtonClickHandler}>
          마이페이지
        </div>
      );
    }
    return (
      <div className='black-button' onClick={onSignInButtonClickHandler}>
        로그인
      </div>
    );
  };

  // 게시글 업로드 버튼 컴포넌트
  const UploadButton = () => {
    const { title, content, boardImageFileList, resetBoard } = useBoardStore();

    const postBoardResponse = (responseBody: PostBoardResponseDto | ResponseDto | null) => {
      if (!responseBody) return;

      // 응답 코드에 따른 처리
      const { code } = responseBody;
      if (code === 'DBE') alert('데이터베이스 오류입니다.');
      if (code === 'AF' || code === 'NU') navigate(AUTH_PATH());
      if (code === 'VF') alert('제목과 내용은 필수입니다.');
      if (code !== 'SU') return;

      // 게시판 상태 초기화
      resetBoard();

      if (!loginUser) return;
      const { email } = loginUser;
      navigate(USER_PATH(email));
    };

    // 게시글 업로드 버튼 클릭 이벤트
    const onUploadButtonClickHandler = async () => {
      const accessToken = cookies.accessToken;
      if (!accessToken) return;

      const boardImageList: string[] = [];

      // 게시글 이미지 업로드
      for (const file of boardImageFileList) {
        const data = new FormData();
        data.append('file', file);

        const url = await fileUploadRequest(data);
        if (url) boardImageList.push(url);
      }

      const requestBody: PostBoardRequestDto = {
        title,
        content,
        boardImageList,
      };

      // 게시글 업로드 요청 API 호출
      postBoardRequest(requestBody, accessToken).then(postBoardResponse);
    };

    if (title && content) {
      return (
        <div className='black-button' onClick={onUploadButtonClickHandler}>
          업로드
        </div>
      );
    }
    return <div className='disable-button'>업로드</div>;
  };

  // 경로가 변경될 때마다 실행될 함수
  useEffect(() => {
    // 경로
    const isAuthPage = pathname.startsWith(AUTH_PATH());
    setAuthPage(isAuthPage);
    const isMainPage = pathname === MAIN_PATH();
    setMainPage(isMainPage);
    const isSearchPage = pathname.startsWith(SEARCH_PATH(''));
    setSearchPage(isSearchPage);
    const isBoardDetailPage = pathname.startsWith(BOARD_PATH() + '/' + BOARD_DETAIL_PATH(''));
    setBoardDetailPage(isBoardDetailPage);
    const isBoardWritePage = pathname.startsWith(BOARD_PATH() + '/' + BOARD_WRITE_PATH());
    setBoardWritePage(isBoardWritePage);
    const isBoardUpdatePage = pathname.startsWith(BOARD_PATH() + '/' + BOARD_UPDATE_PATH(''));
    setBoardUpdatePage(isBoardUpdatePage);
    const isUserPage = pathname.startsWith(USER_PATH(''));
    setUserPage(isUserPage);
  }, [pathname]);

  // 로그인 상태가 변경될 때마다 실행될 함수
  useEffect(() => {
    setLogin(loginUser !== null);
  }, [loginUser]);

  return (
    <div id='header'>
      <div className='header-container'>
        <div className='header-left-box' onClick={onLogoClickHandler}>
          <div className='icon-box'>
            <div className='icon logo-dark-icon'></div>
          </div>
          <div className='header-logo'>Minpie Board</div>
        </div>
        <div className='header-right-box'>
          {(isAuthPage || isMainPage || isSearchPage || isBoardDetailPage) && <SearchButton />}
          {(isMainPage || isSearchPage || isBoardDetailPage || isUserPage) && <MyPageButton />}
          {(isBoardWritePage || isBoardUpdatePage) && <UploadButton />}
        </div>
      </div>
    </div>
  );
}
