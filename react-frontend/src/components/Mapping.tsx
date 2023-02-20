import { Button, Grid, makeStyles, MenuItem, Select } from '@material-ui/core';
import { FormEvent, FunctionComponent, useCallback, useEffect, useRef, useState } from 'react';
import { Route } from '../util/models';
import { Loader } from 'google-maps'
import { getCurrentPosition } from '../util/geolocation';
import { makeCarIcon, makeMarkerIcon, Map } from '../util/map';
import {sample, shuffle} from 'lodash'
import { useSnackbar } from 'notistack'
import { RouteExistsError } from '../errors/route-exists.error';
import { NavBar } from './NavBar';
const io = require('socket.io-client')

const API_URL = process.env.REACT_APP_API_URL as string

const googleMapsLoader = new Loader(process.env.REACT_APP_GOOGLE_API_KEY)

const colors = [
    "#b71c1c",
    "#4a148c",
    "#2e7d32",
    "#e65100",
    "#2962ff",
    "#c2185b",
    "#FFCD00",
    "#3e2723",
    "#03a9f4",
    "#827717",
];
  
const useStyles = makeStyles({
    root: {
        width: '100%',
        height: '100%'
    },
    form: {
        margin: '16px'
    },
    btnSubmitWrapper: {
        textAlign: 'center',
        marginTop: '8px'
    },
    map: {
        width: '100%',
        height: '100%'
    }
})

export const Mapping: FunctionComponent = () => {
    const classes = useStyles()
    const [routes, setRoutes] = useState<Route[]>([])
    const [routeIdSelected, setRouteIdSelected] = useState<string>('')
    const mapRef = useRef<Map>()
    const socketIORef = useRef<any>()
    const pageMapContent = useRef<HTMLDivElement>(null)
    const {enqueueSnackbar} = useSnackbar()

    useEffect(() => {
        socketIORef.current = io.connect(API_URL)

        socketIORef.current.on('connect', () => console.log('foi'))
    }, [])

    useEffect(() => {
        fetch(`${API_URL}/routes`)
            .then(data => data.json())
            .then(data => setRoutes(data))
    }, [])

    useEffect(() => {
        (async () => {
            const [, position] = await Promise.all([
                googleMapsLoader.load(),
                getCurrentPosition({enableHighAccuracy: true})
            ])

            mapRef.current = new Map(pageMapContent.current as Element, {
                zoom: 15,
                center: position
            })
        })()
    }, [])

    const startRoute = useCallback((event: FormEvent) => {
        event.preventDefault()
        const route = routes.find(route => route._id == routeIdSelected)

        try {
            const color = sample(shuffle(colors)) as string
    
            mapRef.current?.addRoute(routeIdSelected, {
                currentMarkerOptions: {
                    position: route?.startPosition,
                    icon: makeCarIcon(color)
                },
                endMarkerOptions: {
                    position: route?.endPosition,
                    icon: makeMarkerIcon(color)
                }
            })

            socketIORef.current?.emit('new-direction', {
                routeId: routeIdSelected
            })
        } catch (error) {
            if(error instanceof RouteExistsError) {
                enqueueSnackbar(`${route?.title} já adicionado, espere finalizar`, {
                    variant: 'error'
                })

                return
            }

            throw error
        }
    }, [routeIdSelected, routes, enqueueSnackbar])

    return (
        <Grid container className={classes.root}>
            <Grid item xs={12} sm={3}>
                <NavBar />
                <form onSubmit={startRoute} className={classes.form}>
                    <Select
                        fullWidth
                        displayEmpty
                        value={routeIdSelected}
                        onChange={event => setRouteIdSelected(event.target.value + '')}
                    >
                        {routes.map((route, key) => (
                            <MenuItem key={key} value={route._id}>
                                <em>{route.title}</em>
                            </MenuItem>
                        ))}
                    </Select>
                    <div className={classes.btnSubmitWrapper}>
                        <Button type='submit' color='primary' variant='contained'>Iniciar uma corrida</Button>
                    </div>
                </form>
            </Grid>
            <Grid item xs={12} sm={9}>
                <div id='map' ref={pageMapContent} className={classes.map}></div>
            </Grid>
        </Grid>
    );
};