import React from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile
} from "firebase/auth";
import { auth, userDB } from "../firebase";
import { Timestamp, doc, setDoc, updateDoc } from "firebase/firestore";
import { useEffect } from "react";
import { useState } from "react";


const UserContext = React.createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState({});

    const createUser = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    const signInUser = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    }

    const logoutUser = () => {
        return signOut(auth);
    }

    const setUserData = (name, email, uId) => {
        return setDoc(doc(userDB, 'users', uId), {
            uid: uId,
            name,
            email,
            createAt: Timestamp.fromDate(new Date()),
            isOnline: true,
            lastActive: Timestamp.fromDate(new Date()),
        });
    }

    const setUserChats = (uId) => {
        return setDoc(doc(userDB, "userChats", uId), {});
    }

    const updateDisplayName = (currentUser, name) => {
        return updateProfile(currentUser, {
            displayName: name
        });
    }

    const setOnline = (uId) => {
        return updateDoc(doc(userDB, 'users', uId), {
            isOnline: true,
            lastActive: Timestamp.fromDate(new Date()),
        });
    }

    const setOffline = (uId) => {
        return updateDoc(doc(userDB, 'users', uId), {
            isOnline: false,
            lastActive: Timestamp.fromDate(new Date()),
        });
    }
    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            return () => {
                unSubscribe();
            }
        });

    }, [])


    return (
        <UserContext.Provider value={{ user, logoutUser, createUser, signInUser, setUserChats, updateDisplayName, setUserData, setOnline, setOffline }}>
            {children}
        </UserContext.Provider>
    );
}



export const UserAuth = () => {
    return React.useContext(UserContext)
};