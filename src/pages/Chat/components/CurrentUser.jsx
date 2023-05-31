import SetNameProfile from "./SetNameProfile";

const CurrentUser = ({user}) => {
    return (
        !!user ?
            <div className='user'>
                <div className='default_profile'>
                    {user.photoURL ? <img src={user.photoURL} alt='' /> :  user.displayName && SetNameProfile(user.displayName) }
                </div>
                <span className='status online'></span>
            </div>
            : null
    )
}

export default CurrentUser;
