import React, { Suspense, useEffect } from 'react';
import './App.css';
import { RouterProvider } from 'react-router-dom';
import root from 'router/root';
import { useCookies } from 'react-cookie';
import { useLoginUserStore } from 'stores';
import { getSignInUserRequest } from 'apis';
import { GetSignInUserResponseDto } from 'apis/response/user';
import { ResponseDto } from 'apis/response';
import { User } from 'types/interface';

function App() {
  const [cookies, setCookies] = useCookies();
  const { setLoginUser, resetLoginUser } = useLoginUserStore();

  const getSignInUserResponse = (responseBody: GetSignInUserResponseDto | ResponseDto | null) => {
    if (!responseBody) return;

    const { code } = responseBody;
    if (code === 'AF' || code === 'NU' || code === 'DBE') {
      resetLoginUser();
      return;
    }

    // 로그인 처리
    const loginUser: User = { ...(responseBody as GetSignInUserResponseDto) };
    setLoginUser(loginUser);
  };

  useEffect(() => {
    if (!cookies.accessToken) {
      resetLoginUser();
      return;
    }
    // 토큰이 존재한다면 로그인 사용자 정보 요청
    getSignInUserRequest(cookies.accessToken).then(getSignInUserResponse);
  }, [cookies.accessToken]);

  const Loading = <div>Loading...</div>;
  return (
    <Suspense fallback={Loading}>
      <RouterProvider router={root} />
    </Suspense>
  );
}

export default App;
