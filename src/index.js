import React from 'react';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import ProfileRoleInformation from "./ProfileRoleInformation";
import {createRoot} from "react-dom/client";

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/character-system-role/:name" element={<ProfileRoleInformation />} />
        </Routes>
    </BrowserRouter>
);