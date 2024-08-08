// project-tracker-frontend/src/components/ProfilePage.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';
import { FaArrowLeft } from 'react-icons/fa';
import '../styles/ProfilePage.css';

const ProfilePage = () => {
    const { username } = useParams();
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const token = Cookies.get('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const decoded = jwtDecode(token);
            if (decoded.username !== username) {
                navigate('/login');
                return;
            }

            setUserData(decoded);
        } catch (err) {
            navigate('/login');
        }
    }, [username, navigate]);

    if (!userData) {
        return <div>Loading...</div>;
    }

    const handleBackClick = () => {
        navigate(`/dashboard/${username}`);
    };

    const handleUpdateProfileClick = () => {
        navigate(`/updateprofile/${username}`);
    };

    const getUserImageUrl = () => {
        const [firstName, lastName] = userData.name.split(' ');
        return `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`;
    };

    return (
        <div className='wrapper'>
            <div className="profile-page">
                <div className="back-arrow" onClick={handleBackClick}>
                    <FaArrowLeft size={30} />
                </div>
                <h2>Profile Page</h2>
                <hr />
                <img
                    src={getUserImageUrl()}
                    alt={`${userData.username}'s profile`}
                    className='user-icon'
                    style={{ width: 50, height: 50, borderRadius: '50%', position: 'absolute', top: '2.5rem', right: '2rem' }}
                />
                <p><strong>Name:</strong> {userData.name}</p>
                <br />
                <p><strong>Username:</strong> {userData.username}</p>
                <br />
                <p><strong>Email:</strong> {userData.useremail}</p>
                <br />
                <p><strong>User Type:</strong> {userData.usertype === 1 ? 'Task Maker' : 'Task Completer'}</p>
                <button onClick={handleUpdateProfileClick} className='updateButton'>Update</button>
            </div>
        </div>
    );
};

export default ProfilePage;
