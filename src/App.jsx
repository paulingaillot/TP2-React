import { useState } from 'react'
import React from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import sun from './assets/sun.png'
import cloud from './assets/cloud.png'
import rain from './assets/rain.png'
import thunder from './assets/thunder.png'
import search from './assets/search.png'
import location from './assets/location.png'
import wind from './assets/wind.png'

function App() {
  const [temperature, setTemperature] = useState(0)
  const [condition, setCondition] = useState(0)
  const [loading, setLoading] = useState(0)
  const tiltRef = React.useRef(); 


  function handleLocate(e) {
    setLoading(1)
     // Le navigateur prend en charge la géolocalisation
    navigator.geolocation.getCurrentPosition(function(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    console.log("Latitude : " + latitude + ", Longitude : " + longitude);
    // Vous pouvez maintenant utiliser les valeurs de latitude et longitude
    // Par exemple, les envoyer à un serveur ou les utiliser dans votre application

    try {
      const response = fetch("https://jb03dcnv74.execute-api.eu-west-1.amazonaws.com/Prod/geo?lon="+longitude+"&lat="+latitude)
        .then((response) => response.json())
        .then((data) => {
          tiltRef.current.value=  data.city

          handleCity();
        }); // Remplacez l'URL par l'URL de votre API
    } catch (error) {
      console.error("Erreur lors de la récupération des données : ", error);
      setLoading(2)
    }


  }, function(error) {
    setLoading(2)
    // Gestion des erreurs
    switch(error.code) {
      case error.PERMISSION_DENIED:
        console.error("L'utilisateur a refusé la demande de géolocalisation.");
        break;
      case error.POSITION_UNAVAILABLE:
        console.error("Les informations de géolocalisation ne sont pas disponibles.");
        break;
      case error.TIMEOUT:
        console.error("La demande de géolocalisation a expiré.");
        break;
      default:
        console.error("Une erreur inconnue s'est produite.");
        break;
    }
  });
  }

  function handleCity() {
      setLoading(1)
      if(tiltRef.current != undefined ) {
        fetch("https://jb03dcnv74.execute-api.eu-west-1.amazonaws.com/Prod/weather/" + tiltRef.current.value)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          setTemperature(data.temperature);
          setCondition(data.condition);
          setLoading(0);
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des données : ", error);
          setLoading(2);
        });
    }

  }

  var tips = ""
  var img = sun
  switch (condition) {
    case "windy":
      tips = "Attention a ne pas vous envoler"
      img = wind
      break;
    case "sunny":
        tips = "Attention le soleil il brule "
        img = sun
        break;
        case "stormy":
          tips = "Restez chez vous et regardez les lumières"
          img = thunder
          break;
          case "cloudy":
            tips = "Le ciel nous tombe sur la tête"
            img = cloud
            break;
            case "rainy":
              tips = "L'eau ca mouille"
              img = rain
              break;
    default:
      break;
  }
 
  if(tiltRef.current != undefined) console.log(tiltRef.current.value)


  return (
    <div style={{ backgroundColor: '#76CDCD', color: '#5484BA', paddingLeft: '75px', paddingRight: '75px', padding: '35px',   borderRadius: '10px' 
  }}>
      <div >

      <div  style={{  display: 'inline-block', borderRadius: '10px', backgroundColor: '#FFFFFF', margin: '0px', alignItems: 'center' /* Centre verticalement */}}><label height='20px' onClick={e => handleCity(e)}>
       <img style={{  verticalAlign: 'middle'}} src={search} alt="Description de l'image" />
      </label>
      <input  placeholder="Rechercher" className="input-style"  ref={tiltRef} /></div>
      <label style={{marginLeft : '10px'}} onClick={_ =>handleLocate()} >
       <img  style={{  verticalAlign: 'middle'}} width='30px' src={location} alt="Description de l'image" />
      </label>
      </div>
      {loading == 1 ? ( <p> Loading</p>): null}
      {loading == 2 ? ( <p> Error</p>): null}
      {tiltRef.current !== undefined  && loading == 0? (
      /* HTML avec les classes CSS */
<div >
<h3>{tiltRef.current.value} - France</h3>
  <hr / >
    <div className="weather-container">
  <div className="weather-text">
  

    <h1> {temperature}°C </h1>
    <h3> {condition} </h3>
   

  </div>
  
  <div className="weather-image">
    <img src={img} width="100px" alt="Weather Icon" />
  </div>
  </div>

  <hr />
    <p>{tips}</p>

</div>     ): null}
    </div>

  )
}

export default App
