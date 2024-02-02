import { BoardListItem } from 'types/interface';
import defaultProfileImage from 'assets/image/default-profile-image.png';
import './style.css';

interface Props {
  top3ListItem: BoardListItem;
}

export default function Top3Item({ top3ListItem }: Props) {
  const { boardNumber, title, content, boardTitleImage } = top3ListItem;
  const { favoriteCount, commentCount, viewCount } = top3ListItem;
  const { writeDatetime, writerNickName, writerProfileImage } = top3ListItem;

  return (
    <div className='top-3-list-item' style={{ backgroundImage: `url(${boardTitleImage})` }}>
      <div className='top-3-list-item-main-box'>
        <div className='top-3-list-item-top'>
          <div className='top-3-list-item-profile-box'>
            <div
              className='top-3-list-item-profile-image'
              style={{
                backgroundImage: `url(${
                  writerProfileImage ? writerProfileImage : defaultProfileImage
                })`,
              }}
            ></div>
          </div>
          <div className='top-3-list-item-write-box'>
            <div className='top-3-list-item-nickname'>{writerNickName}</div>
            <div className='top-3-list-item-write-date'>{writeDatetime}</div>
          </div>
        </div>
        <div className='top-3-list-item-middle'>
          <div className='top-3-list-item-title'>{title}</div>
          <div className='top-3-list-item-content'>{content}</div>
        </div>
        <div className='top-3-list-item-bottom'>
          <div className='top-3-list-item-counts'>{`댓글 ${commentCount} · 좋아요 ${favoriteCount} · 조회수 ${viewCount}`}</div>
        </div>
      </div>
    </div>
  );
}
