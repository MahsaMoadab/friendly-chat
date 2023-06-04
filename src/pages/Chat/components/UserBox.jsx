import React from 'react'
import SetNameProfile from './SetNameProfile'
import Moment from 'react-moment'

export default function UserBox({user, selectUser}) {
    return (
        <div className={`list_chat_box`}  onClick={() => selectUser(user)}>
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
        </div>
    )
}
