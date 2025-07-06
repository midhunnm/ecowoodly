import { AppBar, Button, Stack, Toolbar, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './Nav.css';

const Nav = () => {
  const { user, logout } = useAuth();

  return (
    <div className="nav">
      <AppBar
        position="static"
        sx={{ backgroundColor: '#7F461B', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
        className="appbar"
      >
        <Toolbar>
          {/* Woodly Logo Behavior */}
          {user?.isAdmin ? (
            <Typography
              variant="h6"
              sx={{
                color: '#FDF6EC',
                fontSize: '30px',
                fontFamily: 'Lilita One',
                fontWeight: 700,
                letterSpacing: '1px',
                cursor: 'default',
              }}
              className="logo"
            >
              Woodly
            </Typography>
          ) : (
            <Link
              to={user ? '/open' : '/'}
              style={{ textDecoration: 'none' }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: '#FDF6EC',
                  fontSize: '30px',
                  fontFamily: 'Lilita One',
                  fontWeight: 700,
                  letterSpacing: '1px',
                }}
                className="logo"
              >
                Woodly
              </Typography>
            </Link>
          )}

          <div style={{ flexGrow: 1 }} />

          <Stack direction="row" spacing={2}>
            {!user ? (
              <>
                <Link to="/login">
                  <Button className="nav-btn">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button className="nav-btn">Signup</Button>
                </Link>
              </>
            ) : (
              <>
                <Typography
                  sx={{
                    color: '#FDF6EC',
                    alignSelf: 'center',
                    fontWeight: 500,
                    fontSize: '18px',
                    fontFamily: 'Poppins',
                  }}
                >
                  Hi, {user.username}
                </Typography>

                {!user.isAdmin && (
                  <Link to="/cart">
                    <Button className="nav-btn">Cart</Button>
                  </Link>
                )}

                {user.isAdmin && (
                  <Link to="/admin">
                    <Button className="nav-btn">Admin</Button>
                  </Link>
                )}

                <Button className="nav-btn" onClick={logout}>
                  Logout
                </Button>
              </>
            )}
          </Stack>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Nav;
