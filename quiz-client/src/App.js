
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Quiz from './components/Quiz';
import Result from './components/Result';
import Layout from './components/Layout';


function App() {
  return (    
    <Routes>
      {/* public route */}
      <Route path="/" element={<Login />} />
      
      {/* protected or main app routes */}
      <Route path="/" element={<Layout />} >
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/result" element={<Result />} />
      </ Route>
    </Routes>
  );
}

export default App;
