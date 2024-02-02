import { forwardRef, KeyboardEvent, Dispatch, SetStateAction, ChangeEvent } from 'react';
import './style.css';

interface Props {
  label: string;
  type: 'text' | 'password'; // input type 속성
  placeholder: string;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  error: boolean;
  icon?: string;
  message?: string;
  onButtonClick?: () => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
}

const InputBox = forwardRef<HTMLInputElement, Props>((props: Props, ref) => {
  const { label, type, placeholder, value, error, icon, message } = props;
  const { setValue, onButtonClick, onKeyDown } = props;

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setValue(value);
  };

  const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!onKeyDown) return;
    onKeyDown(e);
  };

  return (
    <div className='inputbox'>
      <div className='inputbox-label'>{label}</div>
      <div className={error ? 'inputbox-container-error' : 'inputbox-container'}>
        <input
          ref={ref}
          className='input'
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChangeHandler}
          onKeyDown={onKeyDownHandler}
        />
        {onButtonClick !== undefined && (
          <div className='icon-button' onClick={onButtonClick}>
            {icon !== undefined && <div className={`icon ${icon}`}></div>}
          </div>
        )}
      </div>
      {message !== undefined && <div className='inputbox-message'>{message}</div>}
    </div>
  );
});

export default InputBox;
