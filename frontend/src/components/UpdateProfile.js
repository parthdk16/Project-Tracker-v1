// project-tracker-frontend/src/components/UpdateProfile.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';
import { FaArrowLeft } from 'react-icons/fa';
import '../styles/UpdateProfile.css';

const UpdateProfile = () => {
    const { username } = useParams();
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: ''
    });

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
            setFormData({
                name: decoded.name,
                username: decoded.username,
                email: decoded.useremail
            });
        } catch (err) {
            navigate('/login');
        }
    }, [username, navigate]);

    if (!userData) {
        return <div>Loading...</div>;
    }

    const handleBackClick = () => {
        navigate(`/profile/${username}`);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:3000/users/${userData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('token')}`,
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert('Profile updated successfully. Please log in again.');
                Cookies.remove('token');
                navigate('/login');
            } else {
                alert('Failed to update profile.');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile.');
        }
    };

    const getUserImageUrl = () => {
        const [firstName, lastName] = formData.name.split(' ');
        return `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`;
    };

    return (
        <div className='wrapper'>
            <div className="profile-page">
                <div className="back-arrow" onClick={handleBackClick}>
                    <FaArrowLeft size={30} />
                </div>
                <img
                    src={getUserImageUrl()}
                    alt={`${formData.username}'s profile`}
                    className='user-icon'
                    style={{ width: 50, height: 50, borderRadius: '50%', position: 'absolute', top: '2.5rem', right: '1.5rem' }}
                />
                <h2>Update Profile</h2>
                <hr />
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="name"><strong>Name:</strong></label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="username"><strong>Username:</strong></label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                        />
                    </div>
                    <button type="submit">Update</button>
                </form>
            </div>
        </div>
    );
};

export default UpdateProfile;
