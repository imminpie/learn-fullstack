import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import boardRouter from './boardRouter';
import Container from 'layouts/Container';
import { MAIN_PATH } from 'constant';
import { AUTH_PATH } from 'constant';
import { SEARCH_PATH } from 'constant';
import { USER_PATH } from 'constant';
import { BOARD_PATH } from 'constant';

const MainPage = lazy(() => import('views/Main'));
const AuthPage = lazy(() => import('views/Authentication'));
const SearchPage = lazy(() => import('views/Search'));
const UserPage = lazy(() => import('views/User'));

const root = createBrowserRouter([
  {
    path: MAIN_PATH(),
    element: <Container />,
    children: [
      {
        index: true,
        path: MAIN_PATH(),
        element: <MainPage />,
      },
      {
        path: AUTH_PATH(),
        element: <AuthPage />,
      },
      {
        path: SEARCH_PATH(':searchWord'),
        element: <SearchPage />,
      },
      {
        path: USER_PATH(':userEmail'),
        element: <UserPage />,
      },
      {
        path: BOARD_PATH(),
        children: boardRouter(),
      },
    ],
  },
]);

export default root;
