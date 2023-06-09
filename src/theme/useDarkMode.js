import { useEffect, useState } from "react";

const useDarkMode = () => {
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        const localTheme = window.localStorage.getItem('theme');
        if (localTheme === 'dark') {
            setTheme(localTheme);
            document.body.classList.add('dark');
        }
    }, []);


    const toggleTheme = () => {
        if (theme === 'light') {
            window.localStorage.setItem('theme', 'dark');
            setTheme('dark');
            document.body.classList.add('dark');
        } else {
            window.localStorage.setItem('theme', 'light');
            setTheme('light');
            document.body.classList.remove('dark');
        }
    }

    const chooseTheme = (choose) => {
        if (choose === 'dark') {
            window.localStorage.setItem('theme', 'dark');
            setTheme('dark');
            document.body.classList.add('dark');
        } else {
            window.localStorage.setItem('theme', 'light');
            setTheme('light');
            document.body.classList.remove('dark');
        }
    }

    return [theme, toggleTheme, chooseTheme]
}

export default useDarkMode;