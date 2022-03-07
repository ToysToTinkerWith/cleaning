import React, { useState, useEffect } from 'react';

import { db } from "../../../Firebase/FirebaseInit"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"

import GoogleMapReact from 'google-map-react';
import Geocode from "react-geocode";

import HomeIcon from '@material-ui/icons/Home';

import { Formik, Form } from 'formik';
import { Button, TextField, Typography, Grid, makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({

  confirm: {
    color: "green"
  },
  error: {
    color: "red"
  },
  name: {
    width: '60%',
    margin: 25
  },
  description: {
    width: '90%',
    }
}))

 
function NewClient(props) {

  Geocode.setApiKey("AIzaSyCqlMUtnbP4zqJ26Izex4TJ1h6j0aWgiKc");
  Geocode.setLanguage("en");
  Geocode.setRegion("us");

  const [lat, setLat] = useState(37)
  const [lng, setLng] = useState(-95)
  const [zoom, setZoom] = useState(1)

  const classes = useStyles()

  const getMapOptions = (maps) => {

    return {
        streetViewControl: true,
        scaleControl: true,
        fullscreenControl: false,
        
        gestureHandling: "greedy",
  
        mapTypeControl: true,
        mapTypeId: maps.MapTypeId.ROADMAP,
        mapTypeControlOptions: {
            style: maps.MapTypeControlStyle.DROPDOWN_MENU,
            position: maps.ControlPosition.TOP_LEFT,
            mapTypeIds: [
                maps.MapTypeId.ROADMAP,
                maps.MapTypeId.SATELLITE,
                maps.MapTypeId.HYBRID
            ]
        },
  
        zoomControl: true,
        clickableIcons: false
    };
  }

  const handleUpload = async (formData) => {

    const clientRef = collection(db, "clients")

    await addDoc(clientRef, {
      name: formData.name,
      address: formData.address,
      email: formData.email,
      phone: formData.phone,
      lat: formData.lat,
      lng: formData.lng,
      created: serverTimestamp()
    }).then(
      props.goBack()
    )

  }

  const locateAddress = (address, setFieldValue) => {
    Geocode.fromAddress(address).then(
  (response) => {
    const { lat, lng } = response.results[0].geometry.location;
    console.log(lat, lng)
    setLat(lat)
    setLng(lng)
    setZoom(15)
    setFieldValue("lat", lat)
    setFieldValue("lng", lng)
  },
  (error) => {
    console.error(error)
  }
)
  }


  const uploadstyle = {
    backgroundColor: "#3F3D56",
    borderRadius: "15px",
    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
    textAlign: "center",
  }


  return (

    <div style={uploadstyle}>
    <Formik
      initialValues = {{ 
        name: "",
        address: "",
        email: "",
        phone: "",
        lat: 0,
        lng: 0

    }}

    validate = {values => {
      const errors = {}

      if (values.lat == 0 && values.lng == 0){
        errors.lat = "Locate client on map"
      }

      return errors
    }}


      onSubmit = {(values, { setSubmitting }) => {
        setTimeout(() => {
          handleUpload(values)
          setSubmitting(false)

        }, 400);
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleSubmit,
        isSubmitting,
        setFieldValue
        /* and other goodies */
      }) => (
      <Form onSubmit={handleSubmit} autoComplete="off" >

        <Grid container>
          <Grid item xs={12} sm={12} md={6} >
            <br />
              <TextField
            className={classes.name}
            onChange={handleChange}
            type="text"
            label={<Typography style={{color: "#E6E6E6"}}> Name </Typography>}
            name="name"
          />
          <br />

          <TextField
            className={classes.name}
            onChange={handleChange}
            type="text"
            label={<Typography style={{color: "#E6E6E6"}}> Address </Typography>}
            name="address"
          />
          <br />

          <TextField
            className={classes.name}
            onChange={handleChange}
            type="text"
            label={<Typography style={{color: "#E6E6E6"}}> Email </Typography>}
            name="email"
          />
          <br />

          <TextField
            className={classes.name}
            onChange={handleChange}
            type="text"
            label={<Typography style={{color: "#E6E6E6"}}> Phone </Typography>}
            name="phone"
          />
          </Grid>
          <Grid item xs={12} sm={12} md={6} >
            <br />
            <Button className={classes.buttonStyle} variant="contained" color="secondary" onClick={() => locateAddress(values.address, setFieldValue)}
        >Locate Address</Button>

        <div style={{ height: "50vh", width: "100%", padding: 20}}>
          <GoogleMapReact
            bootstrapURLKeys={{ key: "AIzaSyBiB3iNngJM_kFWKxSv9a30O3fww7YTiWA"}}
            options={getMapOptions}
            center={{lat : lat, lng : lng}}
            zoom={zoom}
            onClick={(event) => {

              setFieldValue("lat", event.lat)
              setFieldValue("lng", event.lng)
              
            }}
          >

        <HomeIcon
              lat={values.lat}
              lng={values.lng}
            />

          </GoogleMapReact>
      </div>
          </Grid>
        </Grid>

        

      
      <br/>
      <br/>

      <Typography className={classes.error} > {errors.lat} </Typography>

      <br/>

      <Button type="submit" color="secondary" variant="contained" disabled={isSubmitting}> Upload </Button>

      <br />
      <br />

      </Form>

      )}
    </Formik>
  </div>
)

}



export default NewClient