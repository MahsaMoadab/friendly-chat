import React, { useEffect, useState } from 'react'
import { Button, Container, Grid } from '@mui/material';
import Logo from '../../../assets/images/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ChatLoading from '../../../components/ChatLoading/ChatLoading';
import { routes } from '../../../Routes/routes';
import { UserAuth } from '../../../services/auth/authContext';
import * as eva from 'eva-icons';
import { useTranslation } from 'react-i18next';

export default function SignIn() {

    let navigate = useNavigate();
    const { chat } = routes;
    const { signInUser, setOnline } = UserAuth();
    const [userInfo, setUserInfo] = useState({ email: '', password: '' });
    const [status, setStatus] = useState({ error: null, loading: false });
    const { t } = useTranslation();

    function handelChange(event) {
        const { name, value } = event.target;
        setUserInfo({ ...userInfo, [name]: value });
    }

    const { email, password } = userInfo;
    const { error, loading } = status;

    const handelUserSignIn = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setStatus({ loading: false, error: t('All fields are required.') });
        }
        else {
            try {
                setStatus({ ...status, loading: true });
                const result = await signInUser(email, password);
                await setOnline(result.user.uid);
                setUserInfo({ email: '', password: '' });
                setStatus({ error: null, loading: false });
                localStorage.setItem('user', result.user.uid)
                toast.success(t("sign In is successfull."));
                navigate(chat)
            } catch (err) {
                setStatus({ error: t(err.message), loading: false });
            }
        }
    };
    useEffect(() => {
        eva.replace();
        error && toast.error(error);
    }, [error]);

    return (
        <>
            {loading && <ChatLoading />}
            <div className="sign">
                <Container>
                    <form method='post'>
                        <Grid className='item' item>
                            <Grid className='item__header' container columnGap={2} alignItems={'center'}>
                                <img src={Logo} alt='' />
                                <h2>{t('Sign In')}</h2>
                            </Grid>
                            <div className='form-group'>
                                <input
                                    type={'email'}
                                    className="form-control"
                                    placeholder={t("label.email")}
                                    name='email'
                                    value={userInfo.email}
                                    onChange={handelChange}
                                    required />
                                <i
                                    data-eva="email"
                                    data-eva-animation="pulse"
                                    data-eva-hover="true"
                                    data-eva-infinite="false" />
                            </div>
                            <div className='form-group'>
                                <input
                                    type={'password'}
                                    className="form-control"
                                    placeholder={t("label.password")}
                                    name='password'
                                    onChange={handelChange}
                                    value={userInfo.password} />
                                <i
                                    data-eva="lock"
                                    data-eva-animation="pulse"
                                    data-eva-hover="true"
                                    data-eva-infinite="false" />
                            </div>

                            <Button
                                type='submit'
                                onClick={handelUserSignIn}
                                disabled={loading}
                                variant="contained"
                                size="large"
                                className='btn_primary'>
                                {loading ? t("Loading") : t("btn.login")}
                            </Button>
                            <p className='link_span'>{t("Don't have account?")} <Link to={'/auth/sign_up'}>{t("Create Account.")}</Link></p>
                        </Grid>
                    </form>
                </Container>
            </div>
        </>
    )
}