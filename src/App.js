import React, {useState, useEffect} from "react";
import { CssBaseline, Grid } from "@material-ui/core";


import Header from './Components/Header/Header';
import List from './Components/List/List';
import Map from './Components/Map/Map';

import { getPlacesData, getWeatherData } from "./api";


const App = () => {


        // hooks to achieve different features        
        const [places, setPlaces] = useState([]);
        const [weatherData, setWeatherData] = useState([]);

        const [filterdPlaces, setFilteredPlaces] = useState([]);
        const [childClicked, setChildClicked] = useState(null);


        const [coordinates, setCoordinates] = useState({});
        const [bounds, setBounds] = useState({});

        const [isLoading, setIsLoading] = useState(false);
        const [type, setType] = useState('restaurants');
        const [rating, setRating] = useState('rating');
    
        

        // hook to find our current locations lat and lng
        useEffect(()=> {
            navigator.geolocation.getCurrentPosition(({coords: {latitude, longitude}})=> {
                setCoordinates({lat: latitude, lng: longitude});
            })
        }, []);

        useEffect(()=>{
            const filteredPlaces = places.filter((place)=> place.rating > rating);
            setFilteredPlaces(filterdPlaces);
        }, [rating]);

        // hook to make a asynch call to places
        useEffect(()=> {
            if(bounds.sw && bounds.ne) {
                setIsLoading(true);

                getWeatherData(coordinates.lat, coordinates.lng)
                    .then((data)=> setWeatherData(data));
            
                getPlacesData(type,bounds.sw, bounds.ne)
                    .then((data)=> {
                    
                    setPlaces(data?.filter((place)=> place.name && place.num_reviews > 0));
                    setFilteredPlaces([]);
                    setIsLoading(false);
                })
            }
                
        }, [type, bounds]);


        return (
            <>
                <CssBaseline />
                <Header setCoordinates={setCoordinates}/>
                <Grid container spacing={3} style={{width: '100%'}}>
                    <Grid item xs={12} md={4}>
                        <List places={filterdPlaces.length?filterdPlaces : places} childClicked={childClicked} isLoadingj={isLoading} type={type} setType={setType} rating={rating} setRating={setRating}/>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Map 
                            setCoordinates={setCoordinates}
                            setBounds={setBounds}
                            coordinates={coordinates}
                            places={filterdPlaces.length? filterdPlaces : places}
                            setChildClicked={setChildClicked}
                            weatherData={weatherData}
                        />
                    </Grid>
                </Grid>
            </>
        );
}

export default App;