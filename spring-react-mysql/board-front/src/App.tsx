import React from 'react';
import './App.css';
import { favoriteListMock } from 'mocks/favorite-list.mock';
import FavoriteItem from 'components/FavoriteItem';

function App() {
  return (
    <div style={{ display: 'flex', columnGap: '30px', rowGap: '20px' }}>
      {favoriteListMock.map((favoriteListItem) => (
        <FavoriteItem favoriteListItem={favoriteListItem} />
      ))}
    </div>
  );
}

export default App;
