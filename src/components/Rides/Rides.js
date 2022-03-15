import React, { useEffect, useState } from 'react';
import styles from './Rides.module.scss';
import { Box, Divider, Grid, IconButton, Menu, MenuItem, Paper, Tab, Tabs, Tooltip, Typography} from '@mui/material';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';


const Rides = () => {
    const [openMenu, setOpenMenu] = useState(null);
    const [value, setValue] = useState(0);
    const [firstArray, setFirstArray] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    // const [secondArray, setSecondArray] = useState([]);


    // fetching user Data
    useEffect(()=>{

    const uri = 'https://assessment.api.vweb.app/user';
        fetch(uri)
        .then(res => res.json())
        .then(user => {          

        const uri = 'https://suryaansh-edvora-backend.herokuapp.com/api';
        fetch(uri)
        .then(res => res.json())
        .then(data => {

            const temp1 = JSON.parse(data);
            const arr = JSON.parse(data);
            var d;
            var user_d = user?.station_code; // userStation code
            // extra
            //getting distance value for all objects
            for (var i = 0; i < arr.length; i++) {
                d = 10000000;
                for (var j = 0; j < arr[i]?.station_path.length; j++) {
                  if (Math.abs(arr[i].station_path[j] - user_d) < d) {
                    d = Math.abs(arr[i].station_path[j] - user_d);
                  }
                }
                temp1[i].distance = d;
              }
            
              //sorting by distance
              for (var i = 0; i < temp1.length; i++) {
                for (var j = 0; j < temp1.length; j++) {
                  if (temp1[i].distance < temp1[j].distance) {
                    var temp2 = temp1[i];
                    temp1[i] = temp1[j];
                    temp1[j] = temp2;
                  }
                }
              }
  
              setFirstArray(temp1);
            //   setSecondArray(temp1);
  
            // extra 1

            // extra 2
             //getting arrays of all states and cities
             const states = temp1.map((item) => {
                return item.state;
              });
              const cities = temp1.map((item) => {
                return item.city;
              });
              const statesUnique = [...new Set(states)];
              const citiesUnique = [...new Set(cities)];
  
              //creating an object to map state to city
              const stateMap = {};
              statesUnique.map((item) => {
                return stateMap[item] = [];
              });
              for (var i = 0; i < arr.length; i++) {
                stateMap[arr[i].state].push(arr[i].city);
              }
              for (var i = 0; i < Object.keys(stateMap).length; i++) {
                stateMap[Object.keys(stateMap)[i]] = [
                  ...new Set(stateMap[Object.keys(stateMap)[i]]),
                ];
              }
              stateMap["all"] = citiesUnique;

              setStates(statesUnique);
              setCities(citiesUnique);
            // extra 2

        })
    })
    },[])

    // filtering rides by distance, upcoming date, past date
    const handleChange = (event, newValue) => {
        setValue(newValue);
        var todayDate = new Date(); //Today Date.

        switch(newValue) {
            case 0:
                setFilteredData(firstArray);
                break;
            case 1:
                const upComingRides = firstArray.filter(one=> (new Date(one?.date))>todayDate);
                setFilteredData(upComingRides);
                break;
            case 2:
                const pastRides = firstArray.filter(one=> (new Date(one?.date))<todayDate);
                setFilteredData(pastRides);
            break;
        default:
          // code block
      }
    };

    
    // nested menu for sorting
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    

    // filtering with nearest cities and states
    const handleFilterWithState = (e) =>{
        const filterStates = firstArray.filter(one=>one.state === e);
        setFilteredData(filterStates.slice(0, 1));
    }
    const handleFilterWithCity = (e) =>{
        const filterCities = firstArray.filter(one=> one.city === e);
        setFilteredData(filterCities.slice(0, 1))
    }
    return(
            <>
            <Box className={styles.ridesContainer}>

            {/* filtering rides, with nearest, upcoming, past */}
                <Box sx={{ width: '100%', mb:3, display:'flex', justifyItems:'center', justifyContent:'space-between' }}>
                    <Tabs className={styles.tabsContainer} value={value} onChange={handleChange}>
                        <Tab className={`${value=== 0 ? styles.newColor : styles.singleTab}`} label={`Nearest rides (${firstArray?.length})`} />
                        <Tab className={`${value=== 1 ? styles.newColor : styles.singleTab}`} label={`Upcoming rides(${(firstArray.filter(one=>(new Date(one?.date))>(new Date())))?.length})`} />
                        <Tab className={`${value=== 2 ? styles.newColor : styles.singleTab}`} label={`Past rides(${(firstArray.filter(one=>(new Date(one?.date))<(new Date()))?.length)})`} />
                    </Tabs>
                    <Box>

                    {/* Nested Filter Menu section */}
                    <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                            <Tooltip title="Filter">
                            <IconButton
                                onClick={handleClick}
                                size="small"
                                sx={{ ml: 2 }}
                                aria-controls={open ? 'account-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                            >
                                <FormatAlignLeftIcon style={{color:'white', fontSize:20}} />
                                <Typography style={{color:'#ffffff', fontWeight:400, fontSize:14, paddingTop:'5px', paddingLeft:'5px', textTransform: 'none'}} variant="p" gutterBottom component="div">
                                    Filter
                                </Typography>
                            </IconButton>
                            </Tooltip>
                    </Box>

                    {/* Menu After Click */}
                        <Menu
                            anchorEl={anchorEl}
                            id="account-menu"
                            open={open}
                            PaperProps={{
                            elevation: 0,
                            sx: {
                                bgcolor:'#131313',
                                p:3,
                                overflow: 'visible',
                                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                mt: 1.5,
                                '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                                },
                                '&:before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: '#131313',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                                },
                            },
                            }}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            
                            {/* nested menu */}
                            <MenuItem disabled sx={{display:'flex', justifyContent:'space-between', color:'#ffffff', columnGap:6}}>
                            Filter
                            </MenuItem>
                            <Divider style={{backgroundColor:'#CBCBCB'}}/>
                            <MenuItem onClick={()=>setOpenMenu(openMenu === null ? 1 : null)} sx={{display:'flex', justifyContent:'space-between', columnGap:6,color:'#ffffff', mt:2}}>
                            State 
                                <ArrowDropDownIcon/>
                            </MenuItem>
                                <Box style={{display:`${openMenu === 1 ? 'block' : 'none'}`, overflow:'hidden', overflowY:'scroll' , maxHeight:'180px', width:'120px',margin:'auto', backgroundColor:'#292929'}}>
                                    {states.map((one, index)=><MenuItem key={`one+ ${index}`} onClick={() => (`${handleFilterWithState(one)} ${handleClose(true)}`)} sx={{display:'flex', justifyContent:'space-between', fontSize:14,  columnGap:6,color:'#ffffff'}}> 
                                    {one}
                                    </MenuItem>)}
                                </Box>
                            <MenuItem onClick={()=>setOpenMenu(openMenu === null ? 2 : null)} sx={{display:'flex', justifyContent:'space-between', color:'#ffffff'}}>
                            City
                                <ArrowDropDownIcon/>
                            </MenuItem>
                                <Box style={{display:`${openMenu === 2 ? 'block' : 'none'}`, overflow:'hidden',overflowY:'scroll' , maxHeight:'180px', width:'120px',margin:'auto', backgroundColor:'#292929'}}>
                                    {cities.map((one, index)=><MenuItem key={`one+ ${index}`} onClick={() => (`${handleFilterWithCity(one)} ${handleClose(true)}`)} sx={{display:'flex', justifyContent:'space-between', fontSize:14,  columnGap:6,color:'#ffffff'}}> 
                                    {one}
                                    </MenuItem>)}
                                </Box>
                        </Menu>
                    </Box>
                </Box>

                {/* cards */}
                <Box>
                    {(filteredData.length === 0 ?  firstArray : filteredData).map((one,index)=><Paper key={`new+${index}`} sx={{p:{xs:2, md:3,}, mb:{xs:1, md:2,}, bgcolor:'#171717'}}>
                            <Grid container sx={{p:{xs:2, md:0}}} rowGap={0} spacing={4}>
                                <Grid item xs={12} md={3}>
                                    <img style={{width:'100%', height:'148px', objectFit:'cover'}} src={one?.map_url} alt="" />
                                </Grid>
                                <Grid item xs={12} md={7}>
                                    <Typography variant="body2" sx={{color:'#CFCFCF'}} gutterBottom component="div">
                                        Ride Id : <span style={{color:'#ffffff'}}>{one?.id}</span>
                                    </Typography>
                                    <Typography variant="body2" sx={{color:'#CFCFCF'}} gutterBottom component="div">
                                        Origin Station : <span style={{color:'#ffffff'}}>{one?.origin_station_code}</span>
                                    </Typography>
                                    <Typography variant="body2" sx={{color:'#CFCFCF'}} gutterBottom component="div">
                                        station_path : <span style={{color:'#ffffff'}}>[ {(`${one?.station_path}`)} ]</span>
                                    </Typography>
                                    <Typography variant="body2" sx={{color:'#CFCFCF'}} gutterBottom component="div">
                                        Date : <span style={{color:'#ffffff'}}>{one?.date}</span>
                                    </Typography>

                                    {/* conditionally needed */}
                                    <Typography variant="body2" sx={{color:'#CFCFCF'}} gutterBottom component="div">
                                        Distance : <span style={{color:'#ffffff'}}>{one?.distance}</span>
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <Typography variant="body2" sx={{color:'#CFCFCF', bgcolor:'#0A0A0A', px:1,py:0.5, mr:2, display:'inline-block', borderRadius:3}} gutterBottom component="div">
                                        {one?.city}
                                    </Typography>
                                    <Typography variant="body2" sx={{color:'#CFCFCF', bgcolor:'#0A0A0A', px:1,py:0.5, display:'inline-block', borderRadius:3}} gutterBottom component="div">
                                        {one?.state}
                                    </Typography>
                                </Grid>
                            </Grid>
                    </Paper> )}     
                </Box>
            </Box>
            </>
    );
};

export default Rides;
