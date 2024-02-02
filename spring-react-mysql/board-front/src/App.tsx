import React, { Suspense } from 'react';
import './App.css';
import { RouterProvider } from 'react-router-dom';
import root from 'router/root';

function App() {
  const Loading = <div>Loading...</div>;
  return (
    <Suspense fallback={Loading}>
      <RouterProvider router={root} />
    </Suspense>
  );
}

export default App;
