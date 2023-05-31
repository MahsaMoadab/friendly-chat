import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import Chat from '../pages/Chat/Chat'
import SignIn from '../pages/Auth/SignIn/SignIn'
import SignUp from '../pages/Auth/SignUp/SignUp'
import { UserAuth } from '../services/auth/authContext'

export default function ChatRoutes({ theme }) {
  const { user } = UserAuth();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProtectedRoute user={user}><Chat /></ProtectedRoute>} />
        <Route path="auth/sign_in" element={<SignIn />} />
        <Route path="auth/sign_up" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  )
}
