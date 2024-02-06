import './style.css';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useBoardStore } from 'stores';

export default function Write() {
  const { title, setTitle } = useBoardStore();
  const { content, setContent } = useBoardStore();
  const { boardImageFileList, setBoardImageFileList } = useBoardStore();
  const { resetBoard } = useBoardStore();
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const titleRef = useRef<HTMLTextAreaElement | null>(null);
  const contentRef = useRef<HTMLTextAreaElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const onTitleChangeHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setTitle(value);

    // 내용에 따라 높이가 자동 조절되는 textarea 만들기
    if (!titleRef.current) return;
    titleRef.current.style.height = 'auto';
    titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
  };

  const onContentChangeHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setContent(value);

    // 내용에 따라 높이가 자동 조절되는 textarea 만들기
    if (!contentRef.current) return;
    contentRef.current.style.height = 'auto';
    contentRef.current.style.height = `${contentRef.current.scrollHeight}px`;
  };

  const onImageChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files.length) return;
    const file = e.target.files[0];

    // 이미지 미리보기를 위한 URL 을 생성
    const imageUrl = URL.createObjectURL(file);
    const newImageUrls = imageUrls.map((item) => item);
    newImageUrls.push(imageUrl);
    setImageUrls(newImageUrls);

    // 실제 업로드할 파일 목록을 담기
    const newBoardImageFileList = boardImageFileList.map((item) => item);
    newBoardImageFileList.push(file);
    setBoardImageFileList(newBoardImageFileList);

    // 파일명이 동일할 경우 업로드 되지 않는 문제 해결
    if (!imageInputRef.current) return;
    imageInputRef.current.value = '';
  };

  // 이미지 업로드 버튼 클릭
  const onImageUploadButtonClickHandler = () => {
    if (!imageInputRef.current) return;
    imageInputRef.current.click();
  };

  // 이미지 삭제 버튼 클릭
  const onImageCloseButtonClickHandler = (deleteIndex: number) => {
    // 이미지 미리보기 삭제
    const newImageUrls = imageUrls.filter((url, index) => index !== deleteIndex);
    setImageUrls(newImageUrls);

    // 실제 업로드할 파일 목록에서 삭제
    const newBoardImageFileList = boardImageFileList.filter((file, index) => index !== deleteIndex);
    setBoardImageFileList(newBoardImageFileList);

    // 파일명이 동일할 경우 업로드 되지 않는 문제 해결
    if (!imageInputRef.current) return;
    imageInputRef.current.value = '';
  };

  useEffect(() => {
    resetBoard();
  }, []);

  return (
    <div className='board-write-wrapper'>
      <div className='board-write-container'>
        <div className='board-write-box'>
          <div className='board-write-title-box'>
            <textarea
              ref={titleRef}
              className='board-write-title-textarea'
              placeholder='제목을 작성해 주세요.'
              value={title}
              onChange={onTitleChangeHandler}
            />
          </div>
          <div className='divider'></div>
          <div className='board-write-content-box'>
            <textarea
              ref={contentRef}
              className='board-write-content-textarea'
              placeholder='본문을 작성해 주세요.'
              value={content}
              onChange={onContentChangeHandler}
            ></textarea>
            <div className='icon-button' onClick={onImageUploadButtonClickHandler}>
              <div className='icon image-box-light-icon'></div>
            </div>
            <input
              ref={imageInputRef}
              onChange={onImageChangeHandler}
              type='file'
              accept='image/*'
              style={{ display: 'none' }}
            />
          </div>
          <div className='board-write-images-box'>
            {imageUrls.map((imageUrl, idx) => (
              <div className='board-write-image-box' key={idx}>
                <img className='board-write-image' src={imageUrl} />
                <div
                  className='icon-button image-close'
                  onClick={() => onImageCloseButtonClickHandler(idx)}
                >
                  <div className='icon close-icon'></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
