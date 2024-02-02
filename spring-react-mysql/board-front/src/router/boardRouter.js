import { BOARD_DETAIL_PATH } from 'constant';
import { BOARD_UPDATE_PATH } from 'constant';
import { BOARD_WRITE_PATH } from 'constant';
import { lazy } from 'react';

const BoardDetailPage = lazy(() => import('views/Board/Detail'));
const BoardWritePage = lazy(() => import('views/Board/Write'));
const BoardUpdatePage = lazy(() => import('views/Board/Update'));

const boardRouter = () => {
  return [
    {
      path: BOARD_WRITE_PATH(),
      element: <BoardWritePage />,
    },
    {
      path: BOARD_DETAIL_PATH(':boardNumber'),
      element: <BoardDetailPage />,
    },
    {
      path: BOARD_UPDATE_PATH(':boardNumber'),
      element: <BoardUpdatePage />,
    },
  ];
};

export default boardRouter;
