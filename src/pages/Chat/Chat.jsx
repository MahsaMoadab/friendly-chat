import React, { useState, useEffect } from 'react';
import { UserAuth } from '../../services/auth/authContext';
import ChatLoading from '../../components/ChatLoading'
import Logo from '../../assets/images/logo.png';
import useDarkMode from '../../theme/useDarkMode';
import { collection, doc, onSnapshot, orderBy, query, updateDoc, where } from 'firebase/firestore';
import { userDB } from '../../services/firebase';
import ChatLogo from '../../assets/images/noChat.svg';
import ChatMessage from './components/ChatMessage';
import Profile from './components/Profile';
import CurrentUser from "./components/CurrentUser";
import UserBox from './components/UserBox';
import { NotFound } from '../../components/NotFound/NotFound';
import ChatBox from './components/ChatBox';
import * as eva from 'eva-icons';

export default function Chat() {
    const { user } = UserAuth();
    const [loading, setLoading] = useState(true);
    const [theme, toggleTheme] = useDarkMode();
    const [toggleState, setToggleState] = useState(1);
    const [openChat, setOpenChat] = useState(false);
    const [chat, setChat] = useState('');
    const [users, setUsers] = useState([]);
    const [filterUsers, setFilterUsers] = useState([]);
    const [userChats, setUserChats] = useState([]);
    const [filterChats, setFilterChats] = useState([]);
    const [messageList, setMessageList] = useState([]);
    const [clearSearch, setClearSearch] = useState(false);
    const [clearSearchUser, setClearSearchUser] = useState(false);
    const [haveChat, setHaveChat] = useState(false);

    const toggleTab = (index) => {
        setToggleState(index);
    };

    const getActiveClass = (index, className) =>
        toggleState === index ? className : "";



    useEffect(() => {
        eva.replace();
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



    useEffect(() => {
        if (!user || !user.uid) return;
        const getChatList = async () => {
            setLoading(true);
            const unSubChats = await onSnapshot(doc(userDB, "userChats", user.uid), (doc) => {
                console.log(doc.data());
                if(Object.keys(doc.data()).length !== 0) setHaveChat(true);
                setUserChats(doc.data());
                setFilterChats(doc.data());
            });
            setLoading(false);
            return () => unSubChats();
        }
        getChatList();
    }, [user]);

    const [qChat, setQChat] = useState('');

    const handleSearchChat = (query) => {
        setQChat(query)
        setClearSearch(true);
        if (query === "") {
            setClearSearch(false);
            setQChat('');
            return setFilterChats(userChats)}
        
        const results = Object.entries(filterChats).filter(chat => {
            if (query === "") return setFilterChats(userChats)
            return chat[1]['userInfo'].text.toLowerCase().includes(query.toLowerCase())
        });
        setFilterChats(Object.fromEntries(results));
    }
    const [qUser, setqUser] = useState('')
    const handleSearch = (query) => {
        setqUser(query);
        setClearSearchUser(true);
        if (query === "") {
            setqUser('');
            setClearSearchUser(false);
            return setFilterUsers(users)}
        const results = filterUsers.filter(user => {
            if (query === "") return setFilterUsers(users)
            return user.name.toLowerCase().includes(query.toLowerCase())
        });
        setFilterUsers(results)
    }

    const selectUser = async (userSelect) => {
        setChat(userSelect);
        setOpenChat(true);
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
    const contactList = (filterUsers.length > 0) ?
        filterUsers.map((user) => {
            return <UserBox key={user.uid} user={user} selectUser={selectUser} />
        })
        : <NotFound message={"No Contact to display"} icon={"people-outline"} />;

    const handleClearSearch = ()=>{
        handleSearchChat('');
    }
    const handleClearSearchUser = ()=>{
        handleSearch('');
    }

    const selectUserChat = async (userSelect, messageId) => {
        const getChat = async () => {
            const unSubChats = onSnapshot(doc(userDB, "users", userSelect), (doc) => {
                setChat(doc.data())
            });
            return () => unSubChats();
        }
        getChat();
        setOpenChat(true);
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
console.log(Object.keys(filterChats).length);
    const chatList = haveChat ?
        Object.entries(filterChats).sort((a, b) => b[1].date - a[1].date).map((user) => {
            return <ChatBox key={user[1]['userInfo'].uid} user={user} chat={chat} selectUserChat={selectUserChat} />
        })
        : <NotFound message={"No Chat to display"} icon={"message-circle-outline"} />;

    

    const closeChat = () => {
        setOpenChat(false);
        setChat('');
        setMessageList([]);
    }


    return (
        <>
            {
                loading && <ChatLoading />
            }
            {
                !!user && <>
                    <div className="main_app">
                        <div className='main_chat'>
                            <div className='main_chat_sidebar'>
                                <div className="sidebar_top">
                                    <img className='logo' src={Logo} alt='' />
                                    <p className={`tabs ${getActiveClass(1, "active-tabs")}`} onClick={() => toggleTab(1)}>
                                        <i
                                            data-eva="message-circle"
                                            data-eva-animation="pulse"
                                            data-eva-hover="true"
                                            data-eva-infinite="false" />
                                    </p>
                                    <p className={`tabs ${getActiveClass(2, "active-tabs")}`} onClick={() => toggleTab(2)}>

                                        <i
                                            data-eva="people"
                                            data-eva-animation="pulse"
                                            data-eva-hover="true"
                                            data-eva-infinite="false" />
                                    </p>
                                    <p className={`tabs ${getActiveClass(3, "active-tabs")}`} onClick={() => toggleTab(3)}>

                                        <i
                                            data-eva="phone"
                                            data-eva-animation="pulse"
                                            data-eva-hover="true"
                                            data-eva-infinite="false" />
                                    </p>

                                    <p className={`tabs settings_mobile ${getActiveClass(4, "active-tabs")}`} onClick={() => toggleTab(4)}>
                                        <i
                                            data-eva="settings"
                                            data-eva-animation="pulse"
                                            data-eva-hover="true"
                                            data-eva-infinite="false" />
                                    </p>
                                </div>

                                <div className="sidebar_bottom">
                                    <p className={`tabs ${getActiveClass(4, "active-tabs")}`} onClick={() => toggleTab(4)}>
                                        <i
                                            data-eva="settings"
                                            data-eva-animation="pulse"
                                            data-eva-hover="true"
                                            data-eva-infinite="false" />
                                    </p>
                                    <button className='theme' datatype={theme} onClick={e => toggleTheme()}>
                                        <i
                                            data-eva="bulb"
                                            data-eva-animation="pulse"
                                            data-eva-hover="true"
                                            data-eva-infinite="false" />
                                    </button>
                                    <CurrentUser user={user} />
                                </div>

                            </div>
                            <div className="main_chat_tab">
                                <div className={`main_chat_list content ${getActiveClass(1, "active-content")}`}>
                                    <div className="list_search">
                                        <input className='form-control' type="text" placeholder='Chats' value={qChat} onChange={e => handleSearchChat(e.target.value)} />
                                        <i data-eva="search" data-eva-hover="true" />
                                        <button className={`clear_button ${clearSearch ? 'show_clear' : ''}`} onClick={handleClearSearch}>×</button>
                                    </div>

                                    <div className="list_chat">
                                        {chatList}
                                    </div>
                                </div>
                                <div className={`main_chat_list content ${getActiveClass(2, "active-content")}`}>
                                    <div className="list_search">
                                        <input value={qUser} className='form-control' type="text" placeholder='Contact' onChange={e => handleSearch(e.target.value)} />
                                        <i data-eva="search" data-eva-hover="true" />
                                        <button className={`clear_button ${clearSearchUser ? 'show_clear' : ''}`} onClick={handleClearSearchUser}>×</button>
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

                            <div className={`main_chat_message ${openChat ? 'open' : ''}`}>
                                {
                                    !chat ?
                                        <div className="no_message">
                                            <img src={ChatLogo} alt="" />
                                        </div>
                                        :
                                        <ChatMessage chat={chat} messageList={messageList} closeChat={closeChat} />
                                }
                            </div>
                        </div>
                    </div>
                </>
            }
        </>
    )
}
