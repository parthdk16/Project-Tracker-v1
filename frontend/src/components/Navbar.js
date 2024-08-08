import React, { useState, useEffect, useRef } from 'react';
import '../styles/Navbar.css';
import { FaBell } from 'react-icons/fa';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import Notifications from './Notification.js';

function Navbar({ notificationCount, setNotificationCount }) {
    const navigate = useNavigate();
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const dropdownRef = useRef(null);
    const [username, setUsername] = useState('');
    const [name, setname] = useState('');

    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUsername(decoded.username);
                setname(decoded.name);
            } catch (err) {
                console.error('Invalid token:', err);
                navigate('/login');
            }
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        Cookies.remove('token');
        navigate('/login');
    };

    const handleProfileClick = () => {
        navigate(`/profile/${username}`);
    };

    const toggleDropdown = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsDropdownVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const getUserImageUrl = () => {
        const [firstName, lastName] = name.split(' ');
        return `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`;
    };

    return (
        <div className="navbar">
            <h1>Project Tracker</h1>
            <div className="right-section">
                <div className="notification" onClick={toggleDropdown} ref={dropdownRef}>
                    <FaBell size={30} className="notification-icon" />
                    {notificationCount > 0 && <span className="notification-count">{notificationCount}</span>}
                    {isDropdownVisible && (
                        <div className="notification-dropdown">
                            <Notifications username={username} setNotificationCount={setNotificationCount} />
                        </div>
                    )}
                </div>
                <div className="user-info">
                    <span>Welcome, {name}</span>
                    <button onClick={handleLogout}>Logout</button>
                </div>
                <div className="profile" onClick={handleProfileClick} style={{ cursor: 'pointer' }}>
                    <img
                        src={getUserImageUrl()}
                        alt={`${username}'s profile`}
                        className="profile-icon"
                        style={{ width: 40, height: 40, borderRadius: '50%' }}
                    />
                </div>
            </div>
        </div>
    );
}

export default Navbar;
