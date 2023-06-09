import React, { useEffect, useState } from 'react'
import { Button, Container, Grid } from '@mui/material';
import Logo from '../../../assets/images/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ChatLoading from '../../../components/ChatLoading/ChatLoading';
import { UserAuth } from '../../../services/auth/authContext';
import { routes } from '../../../Routes/routes';
import * as eva from 'eva-icons';
import { useTranslation } from 'react-i18next';

export default function SignUp() {
    let navigate = useNavigate();
    const { chat } = routes;
    const { createUser, setUserData, setUserChats, updateDisplayName } = UserAuth();
    const [userInfo, setUserInfo] = useState({
        name: '',
        email: '',
        password: ''
    });

    const [status, setStatus] = useState({ error: null, loading: false })
    const { t } = useTranslation();

    function handelChange(event) {
        const { name, value } = event.target;
        setUserInfo({ ...userInfo, [name]: value });
    }

    const { name, email, password } = userInfo;
    const { error, loading } = status;
    const handelUserSignUp = async (e) => {
        e.preventDefault();
        if (!name) return toast.error(t('All fields are required.'));
        if (!email || !password) {
            setStatus({ loading: false, error: t('All fields are required.') });
        }
        try {
            setStatus({ ...status, loading: true });
            const result = await createUser(email, password);
            await setUserData(name, email, result.user.uid);

            await setUserChats(result.user.uid);
            await updateDisplayName(result.user, name);
            setUserInfo({
                name: '',
                email: '',
                password: ''
            });
            setStatus({ error: null, loading: false });
            localStorage.setItem('user', result.user.uid)
            toast.success(t('Sign up is successfull.'));
            navigate(chat);
        } catch (err) {
            setStatus({ error: t(err.message), loading: false });
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
                    <Grid className='item' item>
                        <Grid className='item__header' container columnGap={2} alignItems={'center'}>
                            <img src={Logo} alt='' />
                            <h2>{t('Sign Up')}</h2>
                        </Grid>
                        <form action="">
                            <div className='form-group'>
                                <input
                                    type={'text'}
                                    className="form-control"
                                    placeholder={t('label.Username')}
                                    name='name'
                                    required
                                    onChange={handelChange}
                                    value={userInfo.name} />
                                <i
                                    data-eva="person"
                                    data-eva-animation="pulse"
                                    data-eva-hover="true"
                                    data-eva-infinite="false" />
                            </div>
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
                                onClick={handelUserSignUp}
                                disabled={loading}
                                variant="contained"
                                size="large"
                                className='btn_primary'>
                                {loading ? t("Registering account...") : t('btn.register')}
                            </Button>
                            <p className='link_span'>{t('Already a member?')} <Link to={'/auth/sign_in'}>{t('login')}</Link></p>
                        </form>
                    </Grid>
                </Container>
            </div>
        </>
    )
}