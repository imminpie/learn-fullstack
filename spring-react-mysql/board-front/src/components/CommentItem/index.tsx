import { CommentListItem } from 'types/interface';
import defaultProfileImage from 'assets/image/default-profile-image.png';
import './style.css';

interface Props {
  commentListItem: CommentListItem;
}

export default function CommentItem({ commentListItem }: Props) {
  const { content, nickname, profileImage, writeDatetime } = commentListItem;

  return (
    <div className='comment-list-item'>
      <div className='comment-list-item-top'>
        <div className='comment-list-item-profile-box'>
          <div
            className='comment-list-item-profile-image'
            style={{ backgroundImage: `url(${profileImage ? profileImage : defaultProfileImage})` }}
          ></div>
        </div>
        <div className='comment-list-item-nickname'>{nickname}</div>
        <div className='comment-list-divider'>{'|'}</div>
        <div className='comment-list-time'>{writeDatetime}</div>
      </div>
      <div className='comment-list-item-main'>
        <div className='comment-list-item-content'>{content}</div>
      </div>
    </div>
  );
}
