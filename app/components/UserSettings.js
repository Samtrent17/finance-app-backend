import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserSettings = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [user, setUser] = useState({}); // Assuming you have user data

    useEffect(() => {
        // Fetch user data when the component mounts
        const fetchUserData = async () => {
            const response = await axios.get('/api/user'); // Adjust the endpoint as necessary
            setUser(response.data);
            setDarkMode(response.data.darkMode); // Set initial dark mode state
        };
        fetchUserData();
    }, []);

    const handleToggleDarkMode = async () => {
        const newDarkMode = !darkMode;
        setDarkMode(newDarkMode);

        // Send the updated dark mode preference to the server
        await axios.put('/api/update', {
            darkMode: newDarkMode,
            // Include other user fields if necessary
        });
    };

    return (
        <div>
            <h2>User Settings</h2>
            <label>
                <input
                    type="checkbox"
                    checked={darkMode}
                    onChange={handleToggleDarkMode}
                />
                Dark Mode
            </label>
            {/* Other user settings fields */}
        </div>
    );
};

export default UserSettings; 