import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import Chat from '../pages/Chat/Chat'
import SignIn from '../pages/Auth/SignIn/SignIn'
import SignUp from '../pages/Auth/SignUp/SignUp'
import { UserAuth } from '../services/auth/authContext'
import AuthProtected from './AuthProtected'

export default function ChatRoutes({ theme }) {
  const { user } = UserAuth();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProtectedRoute user={user}><Chat /></ProtectedRoute>} />
        <Route path="auth/sign_in" element={<AuthProtected user={user}><SignIn /></AuthProtected>} />
        <Route path="auth/sign_up" element={<AuthProtected user={user}><SignUp /></AuthProtected>} />
      </Routes>
    </BrowserRouter>
  )
}
