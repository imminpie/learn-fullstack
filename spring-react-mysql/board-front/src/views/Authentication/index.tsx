import './style.css';
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import InputBox from 'components/InputBox';
import { SignInRequestDto } from 'apis/request/auth';
import { signInRequest } from 'apis';
import SignInResponseDto from 'apis/response/auth/sign-in.response.dto';
import { ResponseDto } from 'apis/response';
import { useCookies } from 'react-cookie';
import { MAIN_PATH } from 'constant';
import { useNavigate } from 'react-router-dom';
import { Address, useDaumPostcodePopup } from 'react-daum-postcode';

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
    // 다음 주소 검색 팝업
    const open = useDaumPostcodePopup();

    const emailRef = useRef<HTMLInputElement | null>(null);
    const passwordRef = useRef<HTMLInputElement | null>(null);
    const passwordCheckRef = useRef<HTMLInputElement | null>(null);
    const nicknameRef = useRef<HTMLInputElement | null>(null);
    const telNumberRef = useRef<HTMLInputElement | null>(null);
    const addressRef = useRef<HTMLInputElement | null>(null);
    const addressDetailRef = useRef<HTMLInputElement | null>(null);

    const [page, setPage] = useState<1 | 2>(1); // 페이지 번호 상태
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordCheck, setPasswordCheck] = useState<string>('');
    const [nickname, setNickname] = useState<string>('');
    const [telNumber, setTelNumber] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [addressDetail, setAddressDetail] = useState<string>('');
    const [agreedPersonal, setAgreedPersonal] = useState<boolean>(false);

    // 비밀번호 타입 상태
    const [passwordType, setPasswordType] = useState<'text' | 'password'>('password');
    const [passwordCheckType, setPasswordCheckType] = useState<'text' | 'password'>('password');

    // 에러
    const [isEmailError, setEmailError] = useState<boolean>(false);
    const [isPasswordError, setPasswordError] = useState<boolean>(false);
    const [isPasswordCheckError, setPasswordCheckError] = useState<boolean>(false);
    const [isNicknameError, setNicknameError] = useState<boolean>(false);
    const [isTelNumberError, setTelNumberError] = useState<boolean>(false);
    const [isAddressError, setAddressError] = useState<boolean>(false);
    const [isAgreedPersonalError, setAgreedPersonalError] = useState<boolean>(false);

    // 에러 메시지
    const [emailErrorMessage, setEmailErrorMessage] = useState<string>('');
    const [passwordErrorMessage, setPasswordErrorMessage] = useState<string>('');
    const [passwordCheckErrorMessage, setPasswordCheckErrorMessage] = useState<string>('');
    const [nicknameErrorMessage, setNicknameErrorMessage] = useState<string>('');
    const [telNumberErrorMessage, setTelNumberErrorMessage] = useState<string>('');
    const [addressErrorMessage, setAddressErrorMessage] = useState<string>('');

    // 비밀번호 아이콘
    const [passwordButtonIcon, setPasswordButtonIcon] = useState<
      'eye-light-off-icon' | 'eye-light-on-icon'
    >('eye-light-off-icon');

    // 비밀번호 확인 아이콘
    const [passwordCheckButtonIcon, setPasswordCheckButtonIcon] = useState<
      'eye-light-off-icon' | 'eye-light-on-icon'
    >('eye-light-off-icon');

    const onEmailChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setEmail(value);
      setEmailError(false);
      setEmailErrorMessage('');
    };

    const onPasswordChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setPassword(value);
      setPasswordError(false);
      setPasswordErrorMessage('');
    };

    const onPasswordCheckChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setPasswordCheck(value);
      setPasswordCheckError(false);
      setPasswordCheckErrorMessage('');
    };

    const onNicknameChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setNickname(value);
      setNicknameError(false);
      setNicknameErrorMessage('');
    };

    const onTelNumberChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setTelNumber(value);
      setTelNumberError(false);
      setTelNumberErrorMessage('');
    };

    const onAddressChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setAddress(value);
      setAddressError(false);
      setAddressErrorMessage('');
    };

    const onAddressDetailChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setAddressDetail(value);
    };

    // 비밀번호 아이콘 클릭 변환 이벤트
    const onPasswordButtonClickHandler = () => {
      if (passwordButtonIcon === 'eye-light-off-icon') {
        setPasswordButtonIcon('eye-light-on-icon');
        setPasswordType('text');
      } else {
        setPasswordButtonIcon('eye-light-off-icon');
        setPasswordType('password');
      }
    };

    // 비밀번호 확인 아이콘 클릭 변환 이벤트
    const onPasswordCheckButtonClickHandler = () => {
      if (passwordCheckButtonIcon === 'eye-light-off-icon') {
        setPasswordCheckButtonIcon('eye-light-on-icon');
        setPasswordCheckType('text');
      } else {
        setPasswordCheckButtonIcon('eye-light-off-icon');
        setPasswordCheckType('password');
      }
    };

    // 개인 정보 동의 클릭 이벤트
    const onAgreedPersonalClickHandler = () => {
      setAgreedPersonal(!agreedPersonal);
      setAgreedPersonalError(false);
    };

    // 다음 단계 버튼 클릭 이벤트
    const onNextButtonClickHandler = () => {
      // 이메일 유효성 검사
      const emailPattern = /^[a-zA-Z0-9]*@([-.]?[a-zA-Z0-9])*\.[a-zA-Z]{2,4}$/;
      const isEmailPattern = emailPattern.test(email);
      if (!isEmailPattern) {
        setEmailError(true);
        setEmailErrorMessage('이메일 형식이 올바르지 않습니다.');
      }

      // 비밀번호 유효성 검사
      const isCheckPassword = password.trim().length >= 8;
      if (!isCheckPassword) {
        setPasswordError(true);
        setPasswordErrorMessage('비밀번호는 8자 이상 입력해 주세요.');
      }

      const isEqualPassword = password === passwordCheck;
      if (!isEqualPassword) {
        setPasswordCheckError(true);
        setPasswordCheckErrorMessage('비밀번호가 일치하지 않습니다.');
      }

      if (!isEmailPattern || !isCheckPassword || !isEqualPassword) return false;
      setPage(2);
    };

    // 회원가입 버튼 클릭 이벤트
    const onSignUpButtonClickHandler = () => {
      // 이메일 유효성 검사
      const emailPattern = /^[a-zA-Z0-9]*@([-.]?[a-zA-Z0-9])*\.[a-zA-Z]{2,4}$/;
      const isEmailPattern = emailPattern.test(email);
      if (!isEmailPattern) {
        setEmailError(true);
        setEmailErrorMessage('이메일 형식이 올바르지 않습니다.');
      } else {
        setEmailError(false);
        setEmailErrorMessage('');
      }

      // 비밀번호 유효성 검사
      const isCheckPassword = password.trim().length >= 8;
      if (!isCheckPassword) {
        setPasswordError(true);
        setPasswordErrorMessage('비밀번호는 8자 이상 입력해 주세요.');
      } else {
        setPasswordError(false);
        setPasswordErrorMessage('');
      }

      const isEqualPassword = password === passwordCheck;
      if (!isEqualPassword) {
        setPasswordCheckError(true);
        setPasswordCheckErrorMessage('비밀번호가 일치하지 않습니다.');
      } else {
        setPasswordCheckError(false);
        setPasswordCheckErrorMessage('');
      }

      if (!isEmailPattern || !isCheckPassword || !isEqualPassword) {
        setPage(1);
        return;
      }

      // 닉네임 유효성 검사
      const hasNickname = nickname.trim().length !== 0;
      if (!hasNickname) {
        setNicknameError(true);
        setNicknameErrorMessage('닉네임을 입력해 주세요.');
      }

      // 핸드폰 번호 유효성 검사
      const telNumberPattern = /^[0-9]{11,13}$/;
      const isTelNumberPattern = telNumberPattern.test(telNumber);
      if (!isTelNumberPattern) {
        setTelNumberError(true);
        setTelNumberErrorMessage('숫자만 입력해 주세요.');
      }

      // 주소 유효성 검사
      const hasAddress = address.trim().length > 0;
      if (!hasAddress) {
        setAddressError(true);
        setAddressErrorMessage('주소를 입력해 주세요.');
      }

      // 개인정보 동의 버튼 검사
      if (!agreedPersonal) setAgreedPersonalError(true);

      if (!hasNickname || !telNumberPattern || !hasAddress || !agreedPersonal) return;
    };

    // 로그인 페이지 이동
    const onSignInLinkClickHandler = () => {
      setView('sign-in');
    };

    // 이메일 입력창에서 엔터키를 누르면 패스워드 입력창으로 이동
    const onEmailKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== 'Enter') return;
      if (!passwordRef.current) return;
      passwordRef.current.focus();
    };

    // 비밀번호 입력창에서 엔터키를 누르면 패스워드 확인 입력창으로 이동
    const onPasswordKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== 'Enter') return;
      if (!passwordCheckRef.current) return;
      passwordCheckRef.current.focus();
    };

    // 비밀번호 입력창에서 엔터키를 누르면 다음 단계로 이동
    const onPasswordCheckKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== 'Enter') return;
      onNextButtonClickHandler();
      if (!nicknameRef.current) return;
      nicknameRef.current.focus();
    };

    // 닉네임 입력창에서 엔터키를 누르면 휴대폰 번호 입력창으로 이동
    const onNicknameKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== 'Enter') return;
      if (!telNumberRef.current) return;
      telNumberRef.current.focus();
    };

    // 휴대폰 번호 입력창에서 엔터키를 누르면 주소 입력창으로 이동
    const onTelNumberKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== 'Enter') return;
      if (!addressRef.current) return;
      addressRef.current.focus();
    };

    // 주소 입력창에서 엔터키를 누르면 상세 주소 입력창으로 이동
    const onAddressKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== 'Enter') return;
      if (!addressDetailRef.current) return;
      addressDetailRef.current.focus();
    };

    // 상세 주소 입력창에서 엔터키를 누르면 회원가입 버튼 클릭
    const onAddressDetailKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== 'Enter') return;
      onSignUpButtonClickHandler();
    };

    // 주소 버튼 클릭 이벤트
    const onAddressButtonClickHandler = () => {
      open({ onComplete }); // onComplete 함수를 인자로 전달
    };

    // 다음 주소 검색 완료 이벤트 처리
    const onComplete = (data: Address) => {
      const { address } = data;
      setAddress(address);
      setAddressError(false);
      setAddressErrorMessage('');
      if (!addressDetailRef.current) return;
      addressDetailRef.current.focus();
    };

    useEffect(() => {
      if (page === 2) {
        if (!nicknameRef.current) return;
        nicknameRef.current.focus();
      }
    }, [page]);

    return (
      <div className='auth-card'>
        <div className='auth-card-box'>
          <div className='auth-card-top'>
            <div className='auth-card-title-box'>
              <div className='auth-card-title'>회원가입</div>
              <div className='auth-card-page'>{`${page}/2`}</div>
            </div>
            {page === 1 && (
              <>
                <InputBox
                  ref={emailRef}
                  label='이메일 주소 *'
                  type='text'
                  placeholder='이메일 주소를 입력해 주세요.'
                  value={email}
                  onChange={onEmailChangeHandler}
                  error={isEmailError}
                  message={emailErrorMessage}
                  onKeyDown={onEmailKeyDownHandler}
                />
                <InputBox
                  ref={passwordRef}
                  label='비밀번호 *'
                  type={passwordType}
                  placeholder='비밀번호를 입력해 주세요.'
                  value={password}
                  onChange={onPasswordChangeHandler}
                  error={isPasswordError}
                  message={passwordErrorMessage}
                  icon={passwordButtonIcon}
                  onButtonClick={onPasswordButtonClickHandler}
                  onKeyDown={onPasswordKeyDownHandler}
                />
                <InputBox
                  ref={passwordCheckRef}
                  label='비밀번호 확인 *'
                  type={passwordCheckType}
                  placeholder='비밀번호를 다시 입력해 주세요.'
                  value={passwordCheck}
                  onChange={onPasswordCheckChangeHandler}
                  error={isPasswordCheckError}
                  message={passwordCheckErrorMessage}
                  icon={passwordCheckButtonIcon}
                  onButtonClick={onPasswordCheckButtonClickHandler}
                  onKeyDown={onPasswordCheckKeyDownHandler}
                />
              </>
            )}
            {page === 2 && (
              <>
                <InputBox
                  ref={nicknameRef}
                  label='닉네임'
                  type='text'
                  placeholder='닉네임을 입력해 주세요.'
                  value={nickname}
                  onChange={onNicknameChangeHandler}
                  error={isNicknameError}
                  message={nicknameErrorMessage}
                  onKeyDown={onNicknameKeyDownHandler}
                />
                <InputBox
                  ref={telNumberRef}
                  label='핸드폰 번호'
                  type='text'
                  placeholder='핸드폰 번호를 입력해 주세요.'
                  value={telNumber}
                  onChange={onTelNumberChangeHandler}
                  error={isTelNumberError}
                  message={telNumberErrorMessage}
                  onKeyDown={onTelNumberKeyDownHandler}
                />
                <InputBox
                  ref={addressRef}
                  label='주소'
                  type='text'
                  placeholder='우편번호 찾기'
                  value={address}
                  onChange={onAddressChangeHandler}
                  error={isAddressError}
                  message={addressErrorMessage}
                  icon='expand-right-light-icon'
                  onButtonClick={onAddressButtonClickHandler}
                  onKeyDown={onAddressKeyDownHandler}
                />
                <InputBox
                  ref={addressDetailRef}
                  label='상세 주소'
                  type='text'
                  placeholder='상세 주소를 입력해 주세요.'
                  value={addressDetail}
                  onChange={onAddressDetailChangeHandler}
                  error={false}
                  onKeyDown={onAddressDetailKeyDownHandler}
                />
              </>
            )}
          </div>
          <div className='auth-card-bottom'>
            {page === 1 && (
              <div className='black-lg-full-button' onClick={onNextButtonClickHandler}>
                다음 단계
              </div>
            )}
            {page === 2 && (
              <>
                <div className='auth-consent-box'>
                  <div className='auth-check-box' onClick={onAgreedPersonalClickHandler}>
                    <div
                      className={`icon ${
                        agreedPersonal ? 'check-round-fill-icon' : 'check-ring-light-icon'
                      }`}
                    ></div>
                  </div>
                  <div
                    className={
                      isAgreedPersonalError ? 'auth-consent-title-error' : 'auth-consent-title'
                    }
                  >
                    개인정보동의
                  </div>
                  <div className='auth-consent-link'>{'더보기>'}</div>
                </div>
                <div className='black-lg-full-button' onClick={onSignUpButtonClickHandler}>
                  회원가입
                </div>
              </>
            )}
            <div className='auth-description-box'>
              <div className='auth-description'>
                이미 계정이 있으신가요?
                <span className='auth-description-link' onClick={onSignInLinkClickHandler}>
                  로그인
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
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
