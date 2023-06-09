import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../../../services/auth/authContext';
import { routes } from '../../../Routes/routes';
import { toast } from 'react-toastify';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, userDB, userStorage } from '../../../services/firebase';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, MenuItem, Select, Tooltip } from '@mui/material'
import Logout from '../../../assets/images/icons/logout.svg';
import SetNameProfile from './SetNameProfile';
import { updateProfile } from 'firebase/auth';
import ChatLoading from '../../../components/ChatLoading/ChatLoading';
import Camera from "../../../assets/images/icons/camera.svg";
import Trash from "../../../assets/images/icons/trash.svg";
import Persian from "../../../assets/images/icons/fa.svg";
import English from "../../../assets/images/icons/en.svg";
import { useTranslation } from 'react-i18next';
import useLang from '../../../lang/useLang';
import useDarkMode from '../../../theme/useDarkMode';


const Profile = ({ user }) => {
    const { logoutUser, setOffline } = UserAuth();
    let navigate = useNavigate();
    const { signIn } = routes;
    const { t } = useTranslation();
    const [lang, changeLang] = useLang();
    const [theme, chooseTheme] = useDarkMode();

    const [loading, setLoading] = useState(false)
    const handelUserSignOut = async () => {
        try {
            await setOffline(user.uid)
            await logoutUser();
            navigate(signIn);
        } catch (error) {
            toast.error(error.message);
        }
    }
    const [profileImage, setProfileImage] = useState(null);
    const [userInfo, setUserInfo] = useState();
    useEffect(() => {
        if (!user || !user.uid) return;
        const getUser = async () => {
            const userDoc = doc(userDB, "users", user.uid);
            const docSnap = await getDoc(userDoc);
            const currentUser = docSnap.data();
            if (currentUser) {
                setUserInfo(currentUser);
                setProfileImage(docSnap.data().photoURL)
            }
            else {
                navigate(signIn)
            }
        };
        getUser();

    }, [user, navigate, signIn])

    const handelAvatarChange = (e) => {
        setLoading(true);
        const profile = e.target.files[0];
        const uploadImage = async () => {
            const imgRef = ref(userStorage, `avatar/${new Date().getTime()}-${profile.name}`);
            try {
                if (userInfo.avatarPath) {
                    await deleteObject(ref(userStorage, userInfo.avatarPath));
                }
                const snap = await uploadBytes(imgRef, profile)
                const url = await getDownloadURL(ref(userStorage, snap.ref.fullPath));
                setProfileImage(url);
                await updateDoc(doc(userDB, 'users', (auth.currentUser.uid)), {
                    photoURL: url,
                    avatarPath: snap.ref.fullPath,
                });
                await updateProfile(user, {
                    photoURL: url
                });
                setLoading(false);
                toast.success(t('Your profile has been successfully changed.'))
            } catch (err) {
                toast.error(err.message)
            }
        };

        uploadImage();
    }

    const handleDeleteAvatar = async () => {
        handleClose();
        setLoading(true);
        try {
            if (userInfo.avatarPath) {
                await deleteObject(ref(userStorage, userInfo.avatarPath));
            }
            await updateDoc(doc(userDB, 'users', (auth.currentUser.uid)), {
                photoURL: '',
                avatarPath: '',
            });
            await updateProfile(auth.currentUser, {
                photoURL: ''
            });
            toast.success(t('Profile deleted successfully.'))
            setProfileImage();
        } catch (err) {
            toast.error(err);
        }
        setLoading(false);
    }

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    console.log(lang);
    const [language, setLanguage] = useState(lang);
    const [changeTheme, setChangeTheme] = useState(theme);

    useEffect(() => {
        setLanguage(lang)
    }, [lang]);
    useEffect(() => {
        setChangeTheme(theme)
    }, [theme])

    const handleChange = (event) => {
        setLanguage(event.target.value);
        changeLang(event.target.value);
    };

    const handleChangeTheme = (event) => {
        setChangeTheme(event.target.value);
        chooseTheme(event.target.value);
    };

    return (
        <>
            {loading && <ChatLoading />}

            {!!userInfo ?
                <div className="main_chat_profile">
                    <div className='profile'>
                        <div className="profile_info">
                            <div className='user'>
                                <div className='default_profile'>
                                    {profileImage ? <img src={profileImage} alt='' /> : SetNameProfile(userInfo.name)}
                                </div>
                                <div className="overlay">
                                    <label htmlFor="profile">
                                        <img src={Camera} alt='' />
                                    </label>
                                    {
                                        !!profileImage &&
                                        <label onClick={handleClickOpen} htmlFor="deleteObject">
                                            <img src={Trash} alt='' />
                                        </label>
                                    }
                                    <input type="file" accept='image/*' name="profile" id="profile" onChange={handelAvatarChange} />
                                </div>
                            </div>
                            <span>{userInfo.name}</span>
                        </div>
                        <Dialog
                            open={open}
                            fullWidth={true}
                            maxWidth="xs"
                            onClose={handleClose}
                            aria-labelledby="draggable-dialog-title"
                        >
                            <DialogTitle id="draggable-dialog-title">
                                <img src={Trash} alt='' />
                                <span>{t('Delete Profile')}</span>
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    {t('Delete Profile image?')}
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button variant="outlined" style={{ margin: '0 0.5em' }} onClick={handleClose}>
                                    {t('Cancel')}
                                </Button>
                                <Button color='error' variant="contained" onClick={handleDeleteAvatar}>{t('Delete')}</Button>

                            </DialogActions>
                        </Dialog>
                        <div className='logout'>
                            <Tooltip title={t("Logout")}>
                                <Button
                                    onClick={e => handelUserSignOut()}
                                    type='submit'
                                    className='btn_logout'>
                                    <img src={Logout} alt="" />
                                </Button>
                            </Tooltip>
                        </div>
                    </div>
                    <h2>{t('Settings')}</h2>

                    <div>
                        <h4>{t('Language selection')}</h4>
                        <FormControl fullWidth>
                            <Select
                                value={language}
                                onChange={handleChange}
                                variant="filled"
                            >
                                <MenuItem value='fa'><img className='img_lang' src={Persian} alt='fa' />{t('Persian')}</MenuItem>
                                <MenuItem value='en'><img className='img_lang' src={English} alt='en' />{t('English')}</MenuItem>
                            </Select>
                        </FormControl>
                    </div>

                    <div style={{marginTop: '1em'}}>
                        <h4>{t('Choose theme')}</h4>
                        <FormControl fullWidth>
                            <Select
                                value={changeTheme}
                                onChange={handleChangeTheme}
                                variant="filled"
                            >
                                <MenuItem value='light'>{t('Light')}</MenuItem>
                                <MenuItem value='dark'>{t('Dark')}</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                </div>
                : null}
        </>
    )
}

export default Profile;