import React, { useState } from 'react'
import SetNameProfile from './SetNameProfile'
import { Button, Divider, Grow } from '@mui/material'
import Icon from 'react-eva-icons';
import { useEffect } from 'react';
import SendIcon from '../../../assets/images/send.svg'
import { Timestamp, addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { userDB, userStorage } from '../../../services/firebase';
import { UserAuth } from '../../../services/auth/authContext';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { MessageBox } from './MessageBox';
import Moment from 'react-moment';

const ChatMessage = ({ chat, messageList }) => {

    const [animation, setAnimation] = useState(false);
    const { user } = UserAuth();
    const [text, setText] = useState('');
    const [img, setImg] = useState();
    const user1 = user.uid;
    const user2 = chat.uid;
    const messageId = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
    console.log(user);
    useEffect(() => {
        setAnimation(true);
    }, [chat]);

    const sendMessageHandle = async (e) => {
        e.preventDefault();
        if (!text) return;
        let url = '';
        if (img) {
            console.log('have img');
            const imgRef = ref(userStorage, `images/${new Date().getTime()}-${img.name}`);
            const snap = await uploadBytes(imgRef, img)
            const dlurl = await getDownloadURL(ref(userStorage, snap.ref.fullPath));
            url = dlurl;
        }
        await addDoc(collection(userDB, "messages", messageId, "chat"), {
            text: text || '',
            from: user1,
            to: user2,
            media: url || '',
            createdAt: Timestamp.fromDate(new Date()),
        });

       const messageText = text;
        setText('');

        await updateDoc(doc(userDB, "userChats", user.uid), {
            [messageId + ".date"]: Timestamp.fromDate(new Date()),
            [messageId + ".unread"]: false,
            [messageId + ".userInfo"]: {
                name: chat.name,
                uid: chat.uid,
                avatar: chat.photoURL ? chat.photoURL : null,
                text: messageText || '',
                media: url || '',
            },
        });

        await updateDoc(doc(userDB, "userChats", chat.uid), {
            [messageId + ".date"]: Timestamp.fromDate(new Date()),
            [messageId + ".unread"]: true,
            [messageId + ".userInfo"]: {
                name: user.displayName,
                uid: user.uid,
                avatar: user.photoURL ? user.photoURL : null,
                text: messageText || '',
                media: url || '',
            },
        });
    }

    return (
        <Grow
            in={animation}
            style={{ transformOrigin: '0 0 0' }}
            {...(animation ? { timeout: 800 } : {})}
        >
            <div className='chat_container'>
                <div className="message">
                    <div className="message_header">
                        <div className="message_header_user">
                            <div className='user'>
                                <div className='default_profile'>
                                    {chat.photoURL ? <img src={chat.photoURL} alt='' /> : SetNameProfile(chat.name)}
                                </div>
                            </div>
                            <div className='details'>
                                <p className='username'>{chat.name}</p>
                                <p className='last_active'>{chat.isOnline ? 'Online' : <>last active <Moment date={chat.lastActive.toDate()} format="LT" /></>}</p>
                            </div>

                        </div>
                        <div className='message_header_action'>
                            <div>
                                <Icon name="video" size="xlarge" />
                            </div>
                            <Icon name="phone" size="xlarge" />
                        </div>
                    </div>
                    <Divider />
                    <div className="message_content">
                        {
                            (messageList.length > 0) ?
                                messageList.map((msg, index) => {
                                    return <MessageBox key={index} message={msg} user={user} />
                                }) :
                                <div className='no_message'>
                                    <p>
                                        No messages here yet...
                                    </p>
                                </div>
                        }
                    </div>
                    <Divider />
                    <form action="">
                        <div className='message_handler'>
                            <div>
                                <label htmlFor="attach"><Icon name="attach" size="xlarge" /></label>
                                <input onChange={e => setImg(e.target.files[0])} type="file" name='attach' id='attach' style={{ display: 'none' }} />
                            </div>
                            <div className='form_input'>
                                <input value={text} onChange={e => setText(e.target.value)} placeholder='Type message...' />
                                <Button type='submit' onClick={sendMessageHandle}>
                                    <img src={SendIcon} alt="" />
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </Grow>
    )
}

export default ChatMessage
