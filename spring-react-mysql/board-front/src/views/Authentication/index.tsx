import './style.css';
import { useState } from 'react';

export default function Authentication() {
  const [view, setView] = useState<'sign-in' | 'sign-up'>('sign-in');

  const SignInCard = () => {
    return <div className='auth-card'></div>;
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
