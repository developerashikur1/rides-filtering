import { Avatar, Box, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react';
import styles from './Header.module.scss';

const Header = () => {
    const [user, setUser] = useState({});
console.log(user)
        // fetching user Data
        useEffect(()=>{
            const uri = 'https://assessment.api.vweb.app/user';
            fetch(uri)
            .then(res => res.json())
            .then(data => setUser(data))
        },[])
    return (
            <Box className={styles.headerSection}>
                <Typography className={styles.logoName} variant="h6" gutterBottom component="div">
                    Edvora
                </Typography>
                <Box className={styles.avatarSection}>
                    <Typography className={styles.name} variant="h6" gutterBottom component="div">
                        {user?.name}
                    </Typography>

                    <Avatar alt="" src={user?.url} title={user?.station_code} />
                </Box>
            </Box>
    );
};

export default Header;