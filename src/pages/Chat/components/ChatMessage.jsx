import React, { useState } from 'react'
import SetNameProfile from './SetNameProfile'
import { Button, Divider } from '@mui/material'
import { useEffect } from 'react';
import SendIcon from '../../../assets/images/send.svg'
import { Timestamp, addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { userDB, userStorage } from '../../../services/firebase';
import { UserAuth } from '../../../services/auth/authContext';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { MessageBox } from './MessageBox';
import Moment from 'react-moment';
import Attach from "../../../assets/images/icons/attach.svg";
import BackIcon from "../../../assets/images/icons/back.svg";
import VideoIcon from "../../../assets/images/icons/video.svg";
import Call from './Call';
import { useRef } from 'react';

const ChatMessage = ({ chat, messageList, closeChat }) => {

    // const [animation, setAnimation] = useState(false);
    const { user } = UserAuth();
    const [text, setText] = useState('');
    const [img, setImg] = useState();
    const user1 = user.uid;
    const user2 = chat.uid;
    const messageId = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
    const [call, setCall] = useState(false);
    let lastCall = "";
    const scrollRef = useRef();


    useEffect(() => {
        setCall(false);
        lastCall = messageList.at(-1);
        scrollRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [chat, messageList]);

    const handleAttach = (file) => {
        setImg(file);
        const fileType = file['type'];
        const validImageTypes = ['image/gif', 'image/jpeg', 'image/svg+xml', 'image/png', 'image/svgz', 'image/ico', 'image/tif'];
        if (!validImageTypes.includes(fileType)) {
            console.log("no image");
        }
    }
    const sendMessageHandle = async (e) => {
        e.preventDefault();
        console.log(img);
        console.log(text);
        if (!text) return;
        let url = '';
        if (img) {
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
            call: null,
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
                media: img ? img.name : '',
                call: null,
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
                media: img ? img.name : '',
                call: null,
            },
        });
        setImg();
    }

    const handleVideoCall = async (e) => {
        e.preventDefault();
        await addDoc(collection(userDB, "messages", messageId, "chat"), {
            text: '',
            from: user1,
            to: user2,
            media: '',
            call: "video",
            createdAt: Timestamp.fromDate(new Date()),
        });
        await updateDoc(doc(userDB, "userChats", user.uid), {
            [messageId + ".date"]: Timestamp.fromDate(new Date()),
            [messageId + ".unread"]: false,
            [messageId + ".userInfo"]: {
                name: chat.name,
                uid: chat.uid,
                avatar: chat.photoURL ? chat.photoURL : null,
                text: '',
                media: '',
                call: "video",
            },
        });

        await updateDoc(doc(userDB, "userChats", chat.uid), {
            [messageId + ".date"]: Timestamp.fromDate(new Date()),
            [messageId + ".unread"]: true,
            [messageId + ".userInfo"]: {
                name: user.displayName,
                uid: user.uid,
                avatar: user.photoURL ? user.photoURL : null,
                text: '',
                media: '',
                call: "video",
            },
        });
        setCall(true);
    }

    const handleJoinTiCall = () => {
        console.log("calll");
        setCall(true);
    }
    const handleCloseCall = () => {
        console.log("calll ended");
        lastCall = "";
        setCall(false);
    }
    return (
        <>
            <div className='chat_container'>
                <div className={`message ${call ? 'hidden' : ''}`}>
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
                            <button className='call_btn' onClick={handleVideoCall}>
                                <img src={VideoIcon} alt="" />
                            </button>
                            <button className='close__Chat' onClick={closeChat}><img src={BackIcon} alt="" /></button>
                        </div>
                    </div>
                    <Divider />
                    <div className="message_content">
                        {
                            (messageList.length > 0) ?
                                messageList.map((msg, index) => {
                                    return <MessageBox key={index} message={msg} user={user} handleJoinTiCall={handleJoinTiCall} />
                                }) :
                                <div className='no_message'>
                                    <p>
                                        No messages here yet...
                                    </p>
                                </div>
                        }
                        
                        {
                            lastCall && lastCall.call === 'video' ? <div className='message__content'><div ref={scrollRef} className={`message_box call ${lastCall.from === user.uid ? 'you' : ''}`}><button onClick={handleJoinTiCall}>Join to Call</button></div></div>  : ''
                        }
                    </div>
                    <Divider />
                    <form action="">
                        <div className='message_handler'>
                            <div>
                                <label htmlFor="attach">
                                    <img src={Attach} alt='' />
                                </label>
                                <input accept="image/*" onChange={e => handleAttach(e.target.files[0])} type="file" name='attach' id='attach' style={{ display: 'none' }} />
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
                {call && 
                <div className={`view_call join_call`}>
                    <Call roomName={messageId} username={user.displayName} handleCloseCall={handleCloseCall}/>
                </div>}
            </div>
        </>
    )
}

export default ChatMessage
