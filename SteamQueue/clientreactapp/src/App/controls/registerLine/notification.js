import { Alert } from '@material-ui/lab';
import { Snackbar, makeStyles } from '@material-ui/core';
import { useStore } from '../../stores/store';

const useStyles = makeStyles(theme => ({
    root:{
        top: theme.spacing(9),
        backgroundColor: 'red'
    },
    body:{
        backgroundColor: 'red',
        color: 'white'
    }

}))
export default function Notification() {
    const {lineStore} = useStore();
    const classes = useStyles();
    const handleClose = (event, reason) => {
        if (reason === 'clickaway')
        {
            return;
        }
            lineStore.notify['isOpen'] = false;
    }
    return(
        <Snackbar
            className={classes.root}
            open={lineStore.notify.isOpen}
            autoHideDuration={1000}
            anchorOrigin=
            {{
                 vertical: 'top', 
                 horizontal: 'right' 
            }}
            onClose={handleClose}>
            <Alert 
                className={classes.body}
                severity={lineStore.notify.type}
                onClose={handleClose}
            >
                {lineStore.notify.message}
            </Alert>
        </Snackbar>
    )
}
