import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import UserRoutes from './Routes/UserRoutes';
import usePreferredColorScheme from './hooks/colorScheme';
import { useEffect } from 'react';

function App() {
  const [isDarkMode,setIsDarkMode] = usePreferredColorScheme();

  useEffect(()=>{
    if(localStorage.getItem("dark")){
        setIsDarkMode(JSON.parse(localStorage.getItem("dark")))
    }else{
      setIsDarkMode(JSON.parse(localStorage.getItem("dark")))
    }
  },[])

  return (
    <BrowserRouter>
      <Routes>
        <Route  path='/*' element={<UserRoutes/>}  />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
