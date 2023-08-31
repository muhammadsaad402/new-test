// @mui
import { styled } from '@mui/material/styles';
import { Typography, Container } from '@mui/material';
// components
import Page from '../components/Page';

// ----------------------------------------------------------------------

const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: 480,
    margin: 'auto',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------

export default function Page404() {
    return (
        <Page title="loading">
            <Container>
                <ContentStyle sx={{ textAlign: 'center', alignItems: 'center' }}>
                    <Typography variant="h3" paragraph>
                        Loading...
                    </Typography>
                </ContentStyle>
            </Container>
        </Page>
    );
}