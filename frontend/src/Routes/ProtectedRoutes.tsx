import React, { JSX, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import UserContext from '../Context/UserContext';
import { IContext } from '../Context/UserContextInterface';
import { useSelector } from 'react-redux';
import { RootState } from '../Component/Redux/Store';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {

    const { accessToken } = useSelector((state: RootState) => state.authLogin);

    if (!accessToken) {
        return <Navigate to="/Login" replace />;
    }

    return children;
};

export default ProtectedRoute;
