import React, { useEffect, useRef } from 'react'
import Moment from 'react-moment';


export const MessageBox = ({ message, user }) => {

  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [message])

  return (
    <div className='message__content' ref={scrollRef}>
      <div className={`message_box ${message.from === user.uid ? 'you' : ''}`}>
        {
          message.media && <img src={message.media} alt="" />
        }
        {
          message.text && <p>{message.text}</p>
        }
      </div>
      <small className={`time ${message.from === user.uid ? 'you' : ''}`}>
        <Moment date={message.createdAt.toDate()} format="LT" />
      </small>
    </div>
  )
}