import React, { useEffect, useState } from 'react';
import { Button, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import Cookies from 'js-cookie';
import styles from '@/styles/components/LanguageSwitcher.module.css';
import { LANGUAGES } from '@/components/admin/ThemeSettings';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
    const [currentLang, setCurrentLang] = useState(() => Cookies.get('lang') || 'fr');

    useEffect(() => {
        if (currentLang) {
            i18n.changeLanguage(currentLang);
            Cookies.set('lang', currentLang);
        }
    }, [currentLang, i18n]);

    const handleMenuClick = ({ key }) => {
        i18n.changeLanguage(key);
        Cookies.set('lang', key);
        setCurrentLang(key);
    };

    const current = LANGUAGES.find(l => l.key === currentLang) || LANGUAGES[0];

    const menuItems = {
        onClick: handleMenuClick,
        items: LANGUAGES.map(lang => ({
            key: lang.key,
            label: (
                <span className={styles.menuItemContent}>
                    <span className={styles.flagEmoji}>{lang.emoji}</span>
                    <span>{lang.label}</span>
                    {currentLang === lang.key && <span className={styles.checkMark}>✓</span>}
                </span>
            ),
        })),
    };

    return (
        <Dropdown menu={menuItems} trigger={['click']} className={styles.dropdown}>
            <Button className={styles.button}>
                <span className={styles.center}>
                    <span className={styles.flagIcon}>{current.emoji}</span>
                    <span className={styles.langText}>{current.key.toUpperCase()}</span>
                </span>
                <DownOutlined className={styles.dropdownIcon} />
            </Button>
        </Dropdown>
    );
};

export default LanguageSwitcher;
