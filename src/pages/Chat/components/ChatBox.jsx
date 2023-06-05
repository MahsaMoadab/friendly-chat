import React from 'react'
import SetNameProfile from './SetNameProfile'
import Moment from 'react-moment'
import Notif from '../../../assets/images/icons/notif.svg';

export default function ChatBox({ user, chat, selectUserChat }) {
    return (
        <div className={`list_chat_box ${chat.name === user[1]['userInfo'].name && 'list_chat_box_active'}`} key={user[0]} onClick={() => selectUserChat(user[1]['userInfo'].uid, user[0])}>
            <div className='list_chat_box_message'>
                <div className='user'>
                    <div className='default_profile'>
                        {user[1]['userInfo'].avatar ? <img src={user[1]['userInfo'].avatar} alt='' /> : SetNameProfile(user[1]['userInfo'].name)}
                    </div>
                </div>
                <div className='details'>
                    <span className="username">{user[1]['userInfo'].name}</span>
                    <p className='last_message'>{user[1]['userInfo'].text ? user[1]['userInfo'].text : user[1]['userInfo'].media ? user[1]['userInfo'].media : user[1]['userInfo'].call ? "Video message" : ""}</p>
                </div>
            </div>
            <div className='time_notif'>
                <p className='last_message_time'><Moment date={user[1]['date'].toDate()} format="h:mm" /></p>
                {user[1]['unread'] && <p className='notif_number'><img src={Notif} alt="" /></p>}
            </div>
        </div>
    )
}
