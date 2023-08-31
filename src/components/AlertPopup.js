import { Alert } from '@mui/material';
import useAlert from '../hooks/useAlert';

const AlertPopup = () => {
    const { text, type } = useAlert();

    if (text && type) {
        return (
            <div style={{
                position: 'fixed',
                zIndex: 10000,
                width: "100%",
                top: "18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <Alert
                    severity={type}
                    variant="filled"
                    sx={{
                        width: "99%",
                        ...(type === "success" && { backgroundColor: "#135100", color: "#fff" })
                    }
                    }
                >
                    {text}
                </Alert >
            </div>
        );
    }
};

export default AlertPopup;