import { useEffect, useState } from 'react';

function usePreferredColorScheme() {
  const [isDarkMode, setIsDarkMode] = useState(JSON.parse(localStorage.getItem("dark")) ?? false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    if(localStorage.getItem("dark") === null || localStorage.getItem("dark") === undefined){
        setIsDarkMode(mediaQuery.matches);
    }

    const handleChange = (e) => setIsDarkMode(e.matches);

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);


  useEffect(() => {
    localStorage.setItem("dark",JSON.stringify(isDarkMode))
    if (isDarkMode) { 
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  return [isDarkMode,setIsDarkMode];
}

export default usePreferredColorScheme