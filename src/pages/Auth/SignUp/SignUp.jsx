import React, { useEffect, useState } from 'react'
import { Button, Container, Grid } from '@mui/material';
import Icon from 'react-eva-icons';
import Logo from '../../../assets/images/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ChatLoading from '../../../components/ChatLoading/ChatLoading';
import { UserAuth } from '../../../services/auth/authContext';
import { routes } from '../../../Routes/routes';
import { updateProfile } from 'firebase/auth';

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

    function handelChange(event) {
        const { name, value } = event.target;
        setUserInfo({ ...userInfo, [name]: value });
    }

    const { name, email, password } = userInfo;
    const { error, loading } = status;
    const handelUserSignUp = async (e) => {
        e.preventDefault();
        if (!name || !email || !password) {
            setStatus({ loading: false, error: 'All fields are required.' });
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
            toast.success('sign up is successfull.');
            navigate(chat);
        } catch (err) {
            setStatus({ error: err.message, loading: false });
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
                    <Grid className='item' item>
                        <Grid className='item__header' container columnGap={2} alignItems={'center'}>
                            <img src={Logo} alt='' />
                            <h2>Sign Up</h2>
                        </Grid>
                        <form action="">
                            <div className='form-group'>
                                <input
                                    type={'text'}
                                    className="form-control"
                                    placeholder='Username' name='name'
                                    onChange={handelChange}
                                    value={userInfo.name} />
                                <Icon
                                    name="person"
                                    size="large"
                                    animation={{
                                        type: "pulse",
                                        hover: true,
                                        infinite: false
                                    }} />
                            </div>
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
                                onClick={handelUserSignUp}
                                disabled={loading}
                                variant="contained"
                                size="large"
                                className='btn_primary'>
                                {loading ? "Registering account..." : "Create account"}
                            </Button>
                            <p className='link_span'>Already a member? <Link to={'/auth/sign_in'}>Sign In.</Link></p>
                        </form>
                    </Grid>
                </Container>
            </div>
        </>
    )
}