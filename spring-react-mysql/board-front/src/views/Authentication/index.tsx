import './style.css';
import { ChangeEvent, KeyboardEvent, useRef, useState } from 'react';
import InputBox from 'components/InputBox';
import { SignInRequestDto } from 'apis/request/auth';
import { signInRequest } from 'apis';
import SignInResponseDto from 'apis/response/auth/sign-in.response.dto';
import { ResponseDto } from 'apis/response';
import { useCookies } from 'react-cookie';
import { MAIN_PATH } from 'constant';
import { useNavigate } from 'react-router-dom';

export default function Authentication() {
  const navigate = useNavigate();
  const [view, setView] = useState<'sign-in' | 'sign-up'>('sign-in');
  const [cookies, setCookies] = useCookies();

  const SignInCard = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<boolean>(false);

    // 비밀번호 표시 상태
    const [passwordType, setPasswordType] = useState<'text' | 'password'>('password');

    // 비밀번호 아이콘 상태
    const [passwordButtonIcon, setPasswordButtonIcon] = useState<
      'eye-light-off-icon' | 'eye-light-on-icon'
    >('eye-light-off-icon');

    // 이메일 및 비밀번호 요소 참조 상태
    const emailRef = useRef<HTMLInputElement | null>(null);
    const passwordRef = useRef<HTMLInputElement | null>(null);

    const signInResponse = (responseBody: SignInResponseDto | ResponseDto | null) => {
      if (!responseBody) {
        alert('네트워크 이상입니다.');
        return;
      }
      const { code } = responseBody;
      if (code === 'DBE') alert('데이터베이스 오류입니다.');
      if (code === 'SF' || code === 'VF') setError(true);
      if (code !== 'SU') return;

      // 로그인 성공하면 쿠키에 JWT 토큰을 저장
      const { token, expirationTime } = responseBody as SignInResponseDto;
      const now = new Date().getTime();
      const expires = new Date(now + expirationTime * 1000);

      // JWT 토큰, 만료 시간, 쿠키가 적용되는 경로를 지정
      setCookies('accessToken', token, { expires, path: MAIN_PATH() });
      navigate(MAIN_PATH());
    };

    // 로그인 버튼 클릭 이벤트
    const onSignInButtonClickHandler = () => {
      const requestBody: SignInRequestDto = { email, password }; // { email: email, password: password}
      signInRequest(requestBody).then(signInResponse);
    };

    // 회원가입 버튼 클릭 이벤트
    const onSignUpButtonClickHandler = () => {
      setView('sign-up');
    };

    // 비밀번호 아이콘 표시 변환 이벤트
    const onPasswordButtonClickHandler = () => {
      if (passwordType === 'text') {
        setPasswordType('password');
        setPasswordButtonIcon('eye-light-off-icon');
      } else {
        setPasswordType('text');
        setPasswordButtonIcon('eye-light-on-icon');
      }
    };

    // 이메일 변경 이벤트
    const onEmailChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
      setError(false);
      const { value } = e.target;
      setEmail(value);
    };

    // 비밀번호 변경 이벤트
    const onPasswordChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
      setError(false);
      const { value } = e.target;
      setPassword(value);
    };

    // 이메일 입력창에서 엔터키를 누르면 패스워드 입력창으로 이동
    const onEmailKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== 'Enter') return;
      if (!passwordRef.current) return;
      passwordRef.current.focus();
    };

    // 비밀번호 입력창에서 엔터키를 누르면 로그인 버튼 클릭
    const onPasswordKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== 'Enter') return;
      onSignInButtonClickHandler();
    };

    return (
      <div className='auth-card'>
        <div className='auth-card-box'>
          <div className='auth-card-top'>
            <div className='auth-card-title-box'>
              <div className='auth-card-title'>로그인</div>
            </div>
            <InputBox
              ref={emailRef}
              label='이메일 주소'
              type='text'
              placeholder='이메일 주소를 입력해 주세요.'
              value={email}
              onChange={onEmailChangeHandler}
              error={error}
              onKeyDown={onEmailKeyDownHandler}
            />
            <InputBox
              ref={passwordRef}
              label='비밀번호'
              type={passwordType}
              placeholder='비밀번호를 입력해 주세요.'
              value={password}
              onChange={onPasswordChangeHandler}
              onButtonClick={onPasswordButtonClickHandler}
              error={error}
              icon={passwordButtonIcon}
              onKeyDown={onPasswordKeyDownHandler}
            />
          </div>
          <div className='auth-card-bottom'>
            {error && (
              <div className='auth-sign-in-error-box'>
                <div className='auth-sign-in-error-message'>
                  이메일 또는 비밀번호를 잘못 입력했습니다.
                  <br />
                  입력하신 내용을 다시 확인해 주세요.
                </div>
              </div>
            )}
            <div className='black-lg-full-button' onClick={onSignInButtonClickHandler}>
              로그인
            </div>
            <div className='auth-description-box'>
              <div className='auth-description'>
                신규 사용자이신가요?{' '}
                <span className='auth-description-link' onClick={onSignUpButtonClickHandler}>
                  회원가입
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const SignUpCard = () => {
    return <div className='auth-card'></div>;
  };

  return (
    <div className='auth-wrapper'>
      <div className='auth-container'>
        <div className='auth-jumbotron-box'>
          <div className='auth-jumbotron-contents'>
            <div className='auth-logo-icon'></div>
            <div className='auth-jumbotron-text-box'>
              <div className='auth-jumbotron-text'>환영합니다.</div>
              <div className='auth-jumbotron-text'>Minpie Board 입니다.</div>
            </div>
          </div>
        </div>
        {view === 'sign-in' && <SignInCard />}
        {view === 'sign-up' && <SignUpCard />}
      </div>
    </div>
  );
}
