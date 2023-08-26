import React,{useState,useEffect} from "react";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import HotelIcon from '@mui/icons-material/Hotel';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {NodeInfoContext, nodeInfoContextDefaultValue } from "./context"
import CreateAccountDialog from "./components/dialogs/CreateAccountDialog";
import CreateCityDialog from "./components/dialogs/CreateCityDialog";
import CreateSuperAdminDialog from "./components/dialogs/CreateSuperAdminDialog";
import CreateHotelDialog from "./components/dialogs/CreateHotelDialog";
import CreateGuestDialog from "./components/dialogs/CreateGuestDialog";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Hotels from "./components/Hotels"
import CityHotel from "./components/CityHotel"
import * as api from "./api"
import User from "./components/User";
import Cities from "./components/Cities";
import PersonIcon from '@mui/icons-material/Person';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import GuestUser from "./components/GuestUser";
import TransferFundsDialog from "./components/dialogs/TransferFundsDialog";
import UserCheckIn from "./components/UserCheckIn";
function App(){

  const [openSpeedDial, setOpenSpeedDial] = useState(false);
	const [openDialog, setOpenDialog] = useState(null);
  const [nodeInfoState, updateNodeInfoState] = useState(
		nodeInfoContextDefaultValue,
	);
  const handleSpeedDialClose = () => {
		setOpenSpeedDial(false);
	};

	const updateHeight = async () => {
		const info = await api.fetchNodeInfo();

		updateNodeInfoState({
			networkIdentifier: info.networkIdentifier,
			minFeePerByte: info.genesisConfig.minFeePerByte,
			height: info.height,
		});
	};
	useEffect(() => {
		async function fetchData() {
		  const info = await api.fetchNodeInfo();
		  updateNodeInfoState({
			networkIdentifier: info.networkIdentifier,
			minFeePerByte: info.genesisConfig.minFeePerByte,
			height: info.height,
		  });
		  setInterval(updateHeight, 1000);
		}
		fetchData();
	  }, []);
	const handleSpeedDialOpen = () => {
		setOpenSpeedDial(true);
	};
  return (<>
  <NodeInfoContext.Provider value={nodeInfoState}>
    <BrowserRouter>
    <Navbar/>
    <Routes>
        <Route exact path="/" element={ <Home/> } />
        <Route path="/account" element={ <User/> } />
        <Route path="/cities" element={ <Cities/> } />
        <Route path="/hotels" element={ <Hotels/> } />
        <Route path="/cityHotel/:cityId" element={ <CityHotel/> } />
        <Route path="/guestUser" element={ <GuestUser/> } />
        <Route path="/guest/checkin" element={ <UserCheckIn/> } />
        {/* <Route path="/contact" element={ <Contact/> } /> */}
      </Routes>
    
    <Box sx={{ height: 320, transform: 'translateZ(0px)', flexGrow: 1 }}>
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: 'absolute', bottom: -200, right: 16 }}
        icon={<SpeedDialIcon />}
        onClose={handleSpeedDialClose}
				onOpen={handleSpeedDialOpen}
				open={openSpeedDial}
				direction={'up'}
      >
        <SpeedDialAction
							key={'Create City'}
							icon={<LocationCityIcon />}
							tooltipTitle={'Create City'}
							onClick={() => {
								setOpenSpeedDial(false);
								setOpenDialog('CreateCityTokenDialog');
							}}
						/>
            <SpeedDialAction
							key={'Create superadmin'}
							icon={<SupervisorAccountIcon />}
							tooltipTitle={'Create SuperAdmin'}
							onClick={() => {
								setOpenSpeedDial(false);
								setOpenDialog('CreateSuperAdmin');
							}}
						/>
            <SpeedDialAction
							key={'Create Account'}
							icon={<AccountCircleIcon />}
							tooltipTitle={'Create Account'}
							onClick={() => {
								setOpenSpeedDial(false);
								setOpenDialog('CreateAccount');
							}}
						/>
			<SpeedDialAction
							key={'Create Hotel'}
							icon={<HotelIcon />}
							tooltipTitle={'Create Hotel'}
							onClick={() => {
								setOpenSpeedDial(false);
								setOpenDialog('CreateHotel');
							}}
						/>
			<SpeedDialAction
							key={'Create User'}
							icon={<PersonIcon />}
							tooltipTitle={'Add guest'}
							onClick={() => {
								setOpenSpeedDial(false);
								setOpenDialog('CreateUser');
							}}
						/>
			<SpeedDialAction
							key={'Transfer'}
							icon={<LocalAtmIcon />}
							tooltipTitle={'Transfer Funds'}
							onClick={() => {
								setOpenSpeedDial(false);
								setOpenDialog('TransferFundsDialog');
							}}
						/>
      </SpeedDial>
      <CreateCityDialog
						open={openDialog === 'CreateCityTokenDialog'}
						handleClose={() => {
							setOpenDialog(null);
						}}
					/>

					<CreateSuperAdminDialog
						open={openDialog === 'CreateSuperAdmin'}
						handleClose={() => {
							setOpenDialog(null);
						}}
					/>

					<CreateAccountDialog
						open={openDialog === 'CreateAccount'}
						handleClose={() => {
							setOpenDialog(null);
						}}
					/>
					<CreateHotelDialog
						open={openDialog === 'CreateHotel'}
						handleClose={() => {
							setOpenDialog(null);
						}}
					/>
					<CreateGuestDialog
						open={openDialog === 'CreateUser'}
						handleClose={() => {
							setOpenDialog(null);
						}}
					/>
					<TransferFundsDialog
						open={openDialog === 'TransferFundsDialog'}
						handleClose={() => {
							setOpenDialog(null);
						}}
					/>
					
    </Box>
    </BrowserRouter>
    </NodeInfoContext.Provider>
    </>
  )
  

}

export default App