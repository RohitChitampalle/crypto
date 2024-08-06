// App.js

import React from 'react';
import CoinTable from './components/CoinRanking'; // Your CoinTable component
import { CoinProvider } from './components/Context/CoinContext'; // Import the provider
import CoinStatsModal from './components/CoinStatsModal'; // Your CoinStatsModal component

const App = () => {
  return (
    <CoinProvider>
      <CoinTable />
      <CoinStatsModal />
    </CoinProvider>
  );
};

export default App;
