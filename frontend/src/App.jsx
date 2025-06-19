import './App.css'
import { BoardList } from './components/Board/BoardList.jsx'
import { HomePage } from './components/Header/HomePage.jsx'

function App() {
  return (
    <div className='App'>
      <HomePage />
      <BoardList />
    </div>
  );
};

export default App;
