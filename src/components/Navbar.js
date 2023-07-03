import React, { useContext, Fragment, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { AppBar, Toolbar, IconButton, Typography, List, ListItem, ListItemText, useMediaQuery, Drawer, Hidden } from '@mui/material';
import { AuthContext } from '../AuthContext'


const bounceAnimation = keyframes`
  0%, 20%, 60%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-20px);
  }
  80% {
    transform: translateY(-10px);
  }
`;


const NavbarLogo = styled(Typography)`
  flex-grow: 1;
  text-decoration: inherit;
  color: #fff;
`;

const NavbarLogoLink = styled(Link)`
  text-decoration: none;
  color: #fff;
`;

const NavbarMenu = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
`;

const NavbarItem = styled(Link)`
  text-decoration: none;
  color: #fff;
  margin-left: 16px;
	display: inline-block;

  &:hover {
    color: yellow;
    transform: scale(1.2);
    animation: ${bounceAnimation} 1s;
  }
`


const DrawerList = styled(List)`
  width: 250px;
`;

const DrawerContent = styled.div`
  width: 250px;
  @media screen and (min-width: 600px) {
    width: 300px;
  }
  background-color: rgba(255, 255, 255, 0.5);
`;

const MenuIconWrapper = styled.span`
  display: inline-block;
  width: 24px;
  height: 24px;
  background-color: #fff;
  border-radius: 50%;
  margin-right: 8px;
`;

const Navbar = ({ userId }) => {
  const { loggedIn, logout, currentUser } = useContext(AuthContext);
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  let currentUserID;
  try {
    const jsonUser = JSON.parse(currentUser);
    currentUserID = jsonUser.userId;
  } catch (error) {
    console.error('Error parsing or accessing user data:', error);
  }

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Home', path: currentUserID ? `/profile/${currentUserID}` : '/' },
    { name: 'About', path: '/services' },
    { name: 'Contact', path: '/contact' },
    { name: 'Doctor Login', path: '/doctorlogin' },
    { name: 'Logout', path: '/' }
  ];
	const renderNavItems = (
		<List className={isMobile ? 'drawerList' : 'navbarMenu'}>
			{navItems.map((item) => {
				if ((item.name === 'Logout' && !loggedIn) || (item.name === 'Doctor Login' && loggedIn)) {
					return null;
				}
	
				return (
					<NavbarItem
						key={item.name}
						to={item.path}
						className="navbarItem"
						onClick={() => {
							toggleDrawer();
							if (item.name === 'Logout') handleLogout();
						}}
					>
						<ListItemText primary={item.name} />
					</NavbarItem>
				);
			})}
		</List>
	);

  return (
    <AppBar position="fixed">
      <Toolbar>
        <NavbarLogo variant="h6" className="navbarLogo customClassName">
          <NavbarLogoLink to="/" className="navbarLogoLink">
            Regen Global
          </NavbarLogoLink>
        </NavbarLogo>

        {isMobile ? (
          <>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer}
            >
              <MenuIconWrapper />
            </IconButton>
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={toggleDrawer}
              classes={{ paper: 'drawerContent' }}
              PaperProps={{ component: 'div', style: { zIndex: 1200 } }}
            >
              {renderNavItems}
            </Drawer>
          </>
        ) : (
          <Hidden smDown implementation="css">
            <NavbarMenu>
              {loggedIn ? (
                <>
                  {renderNavItems}
                </>
              ) : (
                navItems.slice(0, -1).map((item) => (
                  <Fragment key={item.name}>
                    <NavbarItem
                      to={item.path}
                      className="navbarItem"
                      onClick={item.name === 'Logout' ? handleLogout : undefined}
                    >
                      <ListItemText primary={item.name} />
                    </NavbarItem>
                  </Fragment>
                ))
              )}
            </NavbarMenu>
          </Hidden>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
