import React from 'react';
import Logo from '../../assets/images/logo.png';
import ReactLoading from "react-loading";

function ChatLoading() {
  return (
    <div className='loadding'>
      <img className='loadding_logo' src={Logo} alt='' />
      <ReactLoading type={'spinningBubbles'} color="#007bff" height={'100px'} width={'100px'} />
    </div>
  )
}

export default ChatLoading