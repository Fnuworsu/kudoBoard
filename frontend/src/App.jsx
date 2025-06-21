import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import './App.css'
import { BoardList } from './components/Board/BoardList.jsx'
import { BoardPage } from './components/Board/BoardPage.jsx'
import { HomePage } from './components/Header/HomePage.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { Footer } from './components/Footer/Footer.jsx'

function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const isHomePage = location.pathname === '/'
  const isBoardPage = location.pathname.startsWith('/board/')

  const handleBackClick = () => {
    navigate('/')
  };

  return (
    <ThemeProvider>
      <div className='App'>
        {isHomePage && <HomePage />}
        {isBoardPage && (
          <button onClick={handleBackClick} className="back-button">
            &larr; Back to Boards
          </button>
        )}
        <Routes>
          <Route path="/" element={<BoardList />} />
          <Route path="/board/:boardId" element={<BoardPage />} />
        </Routes>
        <Footer />
      </div>
    </ThemeProvider>
  )
}

export default App
