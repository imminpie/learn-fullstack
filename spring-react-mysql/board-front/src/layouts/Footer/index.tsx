import './style.css';

export default function Footer() {
  const onInstaIconButtonClickHandler = () => {
    window.open('https://www.instagram.com');
  };

  const onNaverBologButtonClickHandler = () => {
    window.open('https://blog.naver.com');
  };

  return (
    <div id='footer'>
      <div className='footer-container'>
        <div className='footer-top'>
          <div className='footer-logo-box'>
            <div className='icon-box'>
              <div className='icon logo-light-icon'></div>
            </div>
            <div className='footer-logo-text'>Minpie Board</div>
          </div>
          <div className='footer-link-box'>
            <div className='footer-email-link'>email@gmail.com</div>
            <div className='icon-button' onClick={onInstaIconButtonClickHandler}>
              <div className='icon insta-icon'></div>
            </div>
            <div className='icon-button' onClick={onNaverBologButtonClickHandler}>
              <div className='icon naver-blog-icon'></div>
            </div>
          </div>
        </div>
        <div className='footer-bottom'>
          <div className='footer-copyright'>Copyright © 2024 Imminpie. All Rights Reserved.</div>
        </div>
      </div>
    </div>
  );
}
