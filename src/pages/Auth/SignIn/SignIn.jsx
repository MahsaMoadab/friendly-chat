import React, { useEffect, useState } from 'react'
import { Button, Container, Grid } from '@mui/material';
import Logo from '../../../assets/images/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import Icon from 'react-eva-icons';
import { toast } from 'react-toastify';
import ChatLoading from '../../../components/ChatLoading/ChatLoading';
import { routes } from '../../../Routes/routes';
import { UserAuth } from '../../../services/auth/authContext';

export default function SignIn() {

    let navigate = useNavigate();
    const {chat} = routes;
    const { signInUser, setOnline } = UserAuth();
    const [userInfo, setUserInfo] = useState({ email: '', password: '' });
    const [status, setStatus] = useState({ error: null, loading: false });


    function handelChange(event) {
        const { name, value } = event.target;
        setUserInfo({ ...userInfo, [name]: value });
    }

    const { email, password } = userInfo;
    const { error, loading } = status;

    const handelUserSignIn = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setStatus({ loading: false, error: 'All fields are required.' });
        }
        else {
            try {
                setStatus({ ...status, loading: true });
                const result = await signInUser(email, password);
                await setOnline(result.user.uid);
                setUserInfo({ email: '', password: '' });
                setStatus({ error: null, loading: false });
                localStorage.setItem('user', result.user.uid)
                toast.success('sign In is successfull.');
                navigate(chat)
            } catch (err) {
                setStatus({ error: err.message, loading: false });
            }
        }
    };
    useEffect(() => {
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
                                <h2>Sign In</h2>
                            </Grid>
                            <div className='form-group'>
                                <input
                                    type={'email'}
                                    className="form-control"
                                    placeholder='Email Address'
                                    name='email'
                                    value={userInfo.email}
                                    onChange={handelChange}
                                    required />
                                <Icon
                                    name="email"
                                    size="large"
                                    animation={{
                                        type: "pulse",
                                        hover: true,
                                        infinite: false
                                    }} />
                            </div>
                            <div className='form-group'>
                                <input
                                    type={'password'}
                                    className="form-control"
                                    placeholder='Password'
                                    name='password'
                                    onChange={handelChange}
                                    value={userInfo.password} />
                                <Icon
                                    name="lock"
                                    size="large"
                                    animation={{
                                        type: "pulse",
                                        hover: true,
                                        infinite: false
                                    }} />
                            </div>

                            <Button
                                type='submit'
                                onClick={handelUserSignIn}
                                disabled={loading}
                                variant="contained"
                                size="large"
                                className='btn_primary'>
                                {loading ? "Loading..." : "Login"}
                            </Button>
                            <p className='link_span'>Don't have account? <Link to={'/auth/sign_up'}>Create Account.</Link></p>
                        </Grid>
                    </form>
                </Container>
            </div>
        </>
    )
}