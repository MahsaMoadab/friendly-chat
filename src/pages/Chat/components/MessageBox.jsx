import React, { useEffect, useRef } from 'react'
import Moment from 'react-moment';
import Default from "../../../assets/images/image.svg";
import { useTranslation } from 'react-i18next';

export const MessageBox = ({ message, user, handleJoinTiCall }) => {

  const scrollRef = useRef();
  const { t } = useTranslation();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [message]);

  const onImageError = (e) => {
    e.target.src = Default;
    scrollRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div ref={scrollRef}>
      {
        message.call !== "endCall" ?
          <div className='message__content'>
            <div>
              <div className={`message_box ${message.from === user.uid ? 'you' : ''}`}>
                {
                  message.media && <img src={message.media} alt='' onError={onImageError} />
                }
                {
                  message.text && <p>{message.text}</p>
                }
                {message.call && <p>{t('Video call')}...</p>}
              </div>
              <small className={`time ${message.from === user.uid ? 'you' : ''}`}>
                <Moment date={message.createdAt.toDate()} format="LT" />
              </small>
            </div>
          </div>
          : null
      }
    </div>

  )
}