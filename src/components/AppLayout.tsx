import { useLocation, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Box, IconButton } from '@mui/material';
import { Preview as PreviewIcon, List as ListIcon, Create, ArrowBack } from '@mui/icons-material';
import { useEffect, useState } from 'react';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formsCount, setFormsCount] = useState(0);

  useEffect(() => {
    // Update forms count when on MyForms page
    if (location.pathname === '/myforms') {
      const savedForms = JSON.parse(localStorage.getItem('savedForms') || '[]');
      setFormsCount(savedForms.length);
    }
  }, [location.pathname]);

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/create':
        return 'Form Builder - Create New Form';
      case '/preview':
        return 'Form Preview';
      case '/myforms':
        return `My Forms (${formsCount})`;
      default:
        return 'Form Builder';
    }
  };

  const showBackButton = location.pathname !== '/create';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <AppBar position="static" sx={{ bgcolor: 'primary.main', boxShadow: 'none' }}>
        <Toolbar>
          {showBackButton && (
            <Button
              color="inherit"
              startIcon={<ArrowBack />}
              onClick={() => navigate(-1)}
              sx={{ mr: 2, fontFamily: 'Poppins' }}
            >
              Back
            </Button>
          )}
          <h1 className="text-lg md:text-xl font-semibold text-white flex-grow font-poppins truncate">
            {getPageTitle()}
          </h1>
          <Box sx={{ display: 'flex', gap: { xs: 1, sm: 2 } }}>
            {location.pathname !== '/create' && (
              <Button
                color="inherit"
                startIcon={<Create />}
                onClick={() => navigate('/create')}
                sx={{ 
                  fontFamily: 'Poppins',
                  display: { xs: 'none', sm: 'flex' }
                }}
              >
                Create Form
              </Button>
            )}
            {location.pathname !== '/create' && (
              <IconButton
                color="inherit"
                onClick={() => navigate('/create')}
                sx={{ 
                  display: { xs: 'flex', sm: 'none' }
                }}
              >
                <Create />
              </IconButton>
            )}
            {location.pathname !== '/preview' && (
              <Button
                color="inherit"
                startIcon={<PreviewIcon />}
                onClick={() => {
                  // If coming from MyForms, go to preview without form ID (show current Redux form)
                  // If coming from Create, also go to preview without form ID
                  navigate('/preview');
                }}
                sx={{ 
                  fontFamily: 'Poppins',
                  display: { xs: 'none', sm: 'flex' }
                }}
              >
                Preview
              </Button>
            )}
            {location.pathname !== '/preview' && (
              <IconButton
                color="inherit"
                onClick={() => navigate('/preview')}
                sx={{ 
                  display: { xs: 'flex', sm: 'none' }
                }}
              >
                <PreviewIcon />
              </IconButton>
            )}
            {location.pathname !== '/myforms' && (
              <Button
                color="inherit"
                startIcon={<ListIcon />}
                onClick={() => navigate('/myforms')}
                sx={{ 
                  fontFamily: 'Poppins',
                  display: { xs: 'none', sm: 'flex' }
                }}
              >
                My Forms
              </Button>
            )}
            {location.pathname !== '/myforms' && (
              <IconButton
                color="inherit"
                onClick={() => navigate('/myforms')}
                sx={{ 
                  display: { xs: 'flex', sm: 'none' }
                }}
              >
                <ListIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      {children}
    </div>
  );
};

export default AppLayout;
