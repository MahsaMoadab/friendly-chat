import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../../../services/auth/authContext';
import { routes } from '../../../Routes/routes';
import { toast } from 'react-toastify';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, userDB, userStorage } from '../../../services/firebase';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Tooltip } from '@mui/material'
import Logout from '../../../assets/images/icons/logout.svg';
import SetNameProfile from './SetNameProfile';
import { updateProfile } from 'firebase/auth';
import ChatLoading from '../../../components/ChatLoading/ChatLoading';
import Camera from "../../../assets/images/icons/camera.svg";
import Trash from "../../../assets/images/icons/trash.svg";


const Profile = ({ user }) => {
    const { logoutUser, setOffline } = UserAuth();
    let navigate = useNavigate();
    const { signIn } = routes;

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

    }, [user])

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
                toast.success('پروفایل شما با موفقیت تغییر کرد.')
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
            toast.success('Profile deleted successfully.')
            setProfileImage();
        } catch (err) {
            console.log(err);
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
                                <span>Delete Profile</span>
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Delete Profile image?
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                {/* <Grid> */}
                                <Button variant="outlined" onClick={handleClose}>
                                    Cancel
                                </Button>
                                <Button color='error' variant="contained" onClick={handleDeleteAvatar}>Delete</Button>
                                {/* </Grid> */}

                            </DialogActions>
                        </Dialog>
                        <div className='logout'>
                            <Tooltip title="Logout">
                                <Button
                                    onClick={e => handelUserSignOut()}
                                    type='submit'
                                    className='btn_logout'>
                                    <img src={Logout} alt="" />
                                </Button>
                            </Tooltip>
                        </div>
                    </div>
                    <h2>Settings</h2>
                    {/* <form action="">
   
    <div className='form-group'>
        <input
            type={'text'}
            className="form-control"
            placeholder='Username' name='name'
        />

    </div>
    <Button
        type='submit'
        variant="contained"
        size="large"
        className='btn_primary' fullWidth>
        save
    </Button>
</form> */}


                </div>
                : null}
        </>
    )
}

export default Profile;