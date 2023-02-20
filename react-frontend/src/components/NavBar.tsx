import { AppBar, IconButton, Toolbar, Typography } from "@material-ui/core";
import { FunctionComponent } from "react";
import {DriveEta} from '@material-ui/icons'

export const NavBar: FunctionComponent = () => {
    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton edge='start' color="inherit" aria-label="menu">
                    <DriveEta />
                </IconButton>
                <Typography variant="h6">Code Delivery</Typography>
            </Toolbar>
        </AppBar>
    );
};