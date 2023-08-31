import { useContext } from 'react';
import AlertContext from '../context/authContext';

const useAlert = () => useContext(AlertContext);

export default useAlert;