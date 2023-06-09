import { useEffect, useState } from "react";
import i18n from "i18next";

const useLang = () => {
    const [lang, setLang] = useState('en');

    useEffect(() => {
        const language = localStorage.getItem("lang");
        if (language === 'fa') {
            setLang(language);
            document.body.classList.add('fa');
            document.body.setAttribute('dir', 'rtl');
        }
    }, []);


    const changeLang = (select) => {
        if (select === "fa") {
            document.body.classList.add('fa');
            document.body.setAttribute('dir', 'rtl');
        } else {
           document.body.classList.remove('fa');
            document.body.setAttribute('dir', 'ltr');
        }

        localStorage.setItem("lang", select);
        i18n.changeLanguage(select);
    };

    return [lang, changeLang]
}

export default useLang;