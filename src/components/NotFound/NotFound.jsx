import { Grid, Typography } from '@mui/material'
import * as eva from 'eva-icons';
import { useEffect } from 'react';

export const NotFound = ({ message, icon }) => {
    useEffect(() => {
        eva.replace();
    }, [])
    
    return (
        <Grid container alignItems={'center'} gap={1} justifyContent={'center'} className='no_contact'>
            <i
                data-eva={`${icon}`}
                data-eva-animation="pulse"
                data-eva-hover="true"
                data-eva-fill="#007BFF"
                data-eva-infinite="false" />
            <Typography variant="p" component="p" color={'#007BFF'}>
                {message}
            </Typography>
        </Grid>
    )
}
