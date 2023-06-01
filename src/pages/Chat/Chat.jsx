import React, { useState, useEffect } from 'react';
import Icon from 'react-eva-icons';
import { UserAuth } from '../../services/auth/authContext';
import ChatLoading from '../../components/ChatLoading'
import Logo from '../../assets/images/logo.png';
import useDarkMode from '../../theme/useDarkMode';
import { collection, doc, onSnapshot, orderBy, query, updateDoc, where } from 'firebase/firestore';
import { userDB } from '../../services/firebase';
import SetNameProfile from './components/SetNameProfile';
import ChatLogo from '../../assets/images/noChat.svg';
import ChatMessage from './components/ChatMessage';
import Moment from 'react-moment';
import { Grid, Typography } from '@mui/material';
import Profile from './components/Profile'
import Notif from '../../assets/images/icons/notif.svg';
import CurrentUser from "./components/CurrentUser";
export default function Chat() {
    const { user } = UserAuth();
    const [theme, toggleTheme] = useDarkMode();

    const [toggleState, setToggleState] = useState(1);

    const toggleTab = (index) => {
        setToggleState(index);
    };

    const getActiveClass = (index, className) =>
        toggleState === index ? className : "";

    const [users, setUsers] = useState([]);
    const [filterUsers, setFilterUsers] = useState([]);

    useEffect(() => {
        if (!user || !user.uid) return;
        const getUsers = async () => {
            const userRef = await collection(userDB, 'users');
            const userList = await query(userRef, where('uid', 'not-in', [user.uid]))
            const unSub = onSnapshot(userList, querySnapshot => {
                let userList = [];
                querySnapshot.forEach(doc => {
                    userList.push(doc.data())
                });
                setUsers(userList);
                setFilterUsers(userList)
            });
            return () => unSub();
        }

        getUsers();
    }, [user]);

    const [userChats, setUserChats] = useState([]);
    const [filterChats, setFilterChats] = useState([]);

    useEffect(() => {
        if (!user || !user.uid) return;
        const getChatList = async () => {
            const unSubChats = onSnapshot(doc(userDB, "userChats", user.uid), (doc) => {
                setUserChats(doc.data());
                setFilterChats(doc.data());
            });
            return () => unSubChats();
        }
        getChatList();
    }, [user])
    const [chat, setChat] = useState('');


    const chatList = Object.entries(filterChats).length ?
        Object.entries(filterChats).sort((a,b)=> b[1].date - a[1].date).map((user) => {
            return (
                <div className={`list_chat_box ${chat.name && true === user[1]['userInfo'].name && 'list_chat_box_active'}`} key={user[0]} onClick={() => selectUserChat(user[1]['userInfo'].uid, user[0])}>
                    <div className='list_chat_box_message'>
                        <div className='user'>
                            <div className='default_profile'>
                                {user[1]['userInfo'].avatar ? <img src={user[1]['userInfo'].avatar} alt='' /> : SetNameProfile(user[1]['userInfo'].name)}
                            </div>
                        </div>
                        <div className='details'>
                            <span className="username">{user[1]['userInfo'].name}</span>
                            <p className='last_message'>{user[1]['userInfo'].text}</p>
                        </div>
                    </div>
                    <div className='time_notif'>
                        <p className='last_message_time'><Moment date={user[1]['date'].toDate()} format="h:mm" /></p>
                        {user[1]['unread'] && <p className='notif_number'><img src={Notif} alt="" /></p>}
                    </div>
                </div>)
        })
        : <Grid container alignItems={'center'} gap={1} justifyContent={'center'} className='no_contact'>
            <Icon
                name="message-circle-outline"
                size="xlarge"
                fill="#007BFF" />
            <Typography variant="p" component="p" color={'#007BFF'}>
                No Chat to display
            </Typography>
        </Grid>;
    const handleSearchChat = (query) => {
        if (query === "") return setFilterChats(userChats)
        const results = Object.entries(filterChats).filter(chat => {
            if (query === "") return setFilterChats(userChats)
            return chat[1]['userInfo'].text.toLowerCase().includes(query.toLowerCase())
        });
        setFilterChats(Object.fromEntries(results));
    }
    const handleSearch = (query) => {
        if (query === "") return setFilterUsers(users)
        const results = filterUsers.filter(user => {
            if (query === "") return setFilterUsers(users)
            return user.name.toLowerCase().includes(query.toLowerCase())
        });
        setFilterUsers(results)
    }
    const contactList = (filterUsers.length > 0) ?
        filterUsers.map((user) => {
            return (
                <div className={`list_chat_box`} key={user.uid} onClick={() => selectUser(user)}>
                    <div className='list_chat_box_message' >
                        <div className='user'>
                            <div className='default_profile'>
                                {user.photoURL ? <img src={user.photoURL} alt='' /> : SetNameProfile(user.name)}
                            </div>
                            <span className={`status ${user.isOnline ? 'online' : 'offline'}`}></span>
                        </div>
                        <div className='details'>
                            <span className="username">{user.name}</span>
                            <p className='last_message'>{user.isOnline ? 'Online' : <> last active <Moment date={user.lastActive.toDate()} format="LT" /></>}</p>
                        </div>
                    </div>
                </div>)
        })
        : <Grid container alignItems={'center'} gap={1} justifyContent={'center'} className='no_contact'>
            <Icon
                name="people-outline"
                size="xlarge"
                fill="#007BFF" />
            <Typography variant="p" component="p" color={'#007BFF'}>
                No Contact to display
            </Typography>
        </Grid>;


    const [messageList, setMessageList] = useState([]);
    const selectUser = async (userSelect) => {
        setChat(userSelect);
        const user1 = user.uid;
        const user2 = userSelect.uid;
        const messageId = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
        const messageRef = collection(userDB, 'messages', messageId, 'chat');
        const q = query(messageRef, orderBy('createdAt', 'asc'));
        onSnapshot(q, querySnapshot => {
            let msgs = [];
            querySnapshot.forEach(doc => {
                msgs.push(doc.data())
            })
            setMessageList(msgs)
        });
        toggleTab(1)
    }


    const selectUserChat = async (userSelect, messageId) => {
        const getChat = async () => {
            const unSubChats = onSnapshot(doc(userDB, "users", userSelect), (doc) => {
                setChat(doc.data())
            });
            return () => unSubChats();
        }
        getChat();
        await updateDoc(doc(userDB, "userChats", user.uid), {
            [messageId + ".unread"]: false,
        });
        const messageRef = collection(userDB, 'messages', messageId, 'chat');
        const q = query(messageRef, orderBy('createdAt', 'asc'));
        onSnapshot(q, querySnapshot => {
            let msgs = [];
            querySnapshot.forEach(doc => {
                msgs.push(doc.data())
            })
            setMessageList(msgs)
        });
    }


    return (
        <>
            {
                !user && <ChatLoading />
            }
            {
                !!user && <>
                    <div className="main_app">
                        <div className='main_chat'>
                            <div className='main_chat_sidebar'>
                                <div className="sidebar_top">
                                    <img className='logo' src={Logo} alt='' />
                                    <div>
                                        <p className={`tabs ${getActiveClass(1, "active-tabs")}`} onClick={() => toggleTab(1)}>
                                            <Icon
                                                name="message-circle"
                                                size="xlarge"
                                                animation={{
                                                    type: "pulse",
                                                    hover: true,
                                                    infinite: false
                                                }} />
                                        </p>
                                        <p className={`tabs ${getActiveClass(2, "active-tabs")}`} onClick={() => toggleTab(2)}>
                                            <Icon
                                                name="people"
                                                size="xlarge"
                                                animation={{
                                                    type: "pulse",
                                                    hover: true,
                                                    infinite: false
                                                }} />
                                        </p>
                                        <p className={`tabs ${getActiveClass(3, "active-tabs")}`} onClick={() => toggleTab(3)}>
                                            <Icon
                                                name="phone"
                                                size="xlarge"
                                                animation={{
                                                    type: "pulse",
                                                    hover: true,
                                                    infinite: false
                                                }} />
                                        </p>
                                    </div>
                                </div>

                                <div className="sidebar_bottom">
                                    <p className={`tabs ${getActiveClass(4, "active-tabs")}`} onClick={() => toggleTab(4)}>
                                        <Icon
                                            name="settings"
                                            animation={{
                                                type: "pulse",
                                                hover: true,
                                                infinite: false
                                            }} />
                                    </p>
                                    <button className='theme' datatype={theme} onClick={e => toggleTheme()}>
                                        <Icon
                                            name="bulb"
                                            animation={{
                                                type: "pulse",
                                                hover: true,
                                                infinite: false
                                            }} />
                                    </button>
                                    <CurrentUser user={user} />
                                </div>

                            </div>
                            <div className="main_chat_tab">
                                <div className={`main_chat_list content ${getActiveClass(1, "active-content")}`}>
                                    <div className="list_search">
                                        <input className='form-control' type="text" placeholder='Chats' onChange={e => handleSearchChat(e.target.value)}/>
                                        <Icon
                                            name="search"
                                            size="xlarge" />
                                    </div>

                                    <div className="list_chat">

                                        {chatList}
                                    </div>
                                </div>
                                <div className={`main_chat_list content ${getActiveClass(2, "active-content")}`}>
                                    <div className="list_search">
                                        <input className='form-control' type="text" placeholder='Contact' onChange={e => handleSearch(e.target.value)} />
                                        <Icon
                                            name="search"
                                            size="xlarge" />
                                    </div>

                                    <div className="list_chat">
                                        {contactList}
                                    </div>
                                </div>
                                <div className={`main_chat_list content ${getActiveClass(3, "active-content")}`}>
                                    <div className="list_chat">
                                        <h2>Call history</h2>
                                        <div className="list_chat_box">
                                            <div className='list_chat_box_message'>
                                                <div className='user'>
                                                    {/* <img src={Logo} alt='' /> */}
                                                    <div className='default_profile'>
                                                        M
                                                    </div>
                                                </div>
                                                <div className='details'>
                                                    <span className="username">Mahsa Moadab</span>
                                                    <p className='last_message'>53 sec , 21:10</p>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <div className={`content ${getActiveClass(4, "active-content")}`}>
                                    <Profile user={user} />
                                </div>
                            </div>

                            <div className='main_chat_message'>
                                {
                                    !chat ?
                                        <div className="no_message">
                                            <img src={ChatLogo} alt="" />
                                        </div>
                                        :
                                        <ChatMessage chat={chat} messageList={messageList} />
                                }
                            </div>
                        </div>
                    </div>
                </>
            }
        </>
    )
}
