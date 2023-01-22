import { Button, Grid, MenuItem, Select } from '@material-ui/core';
import * as React from 'react';
import { Route } from '../util/models';

const API_URL = process.env.REACT_APP_API_URL

type Props = {
    
};
export const Mapping = (props: Props) => {
    const [routes, setRoutes] = React.useState<Route[]>([])

    React.useEffect(() => {
        fetch(`${API_URL}/routes`)
            .then(data => data.json())
            .then(data => setRoutes(data))
    }, [])

    return (
        <Grid container>
            <Grid item xs={12} sm={3}>
                Formulário
                <form>
                    <Select fullWidth>
                        {routes.map((route, key) => (
                            <MenuItem key={key} value={route.id}>
                                <em>{route.title}</em>
                            </MenuItem>
                        ))}
                    </Select>
                    <Button type='submit' color='primary' variant='contained'>Iniciar uma corrida</Button>
                </form>
            </Grid>
            <Grid item xs={12} sm={9}>
                Mapa
                <div id='map'></div>
            </Grid>
        </Grid>
    );
};