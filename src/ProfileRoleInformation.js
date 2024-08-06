import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import {Spinner} from "react-bootstrap";

const ProfileRoleInformation = () => {
    const { name } = useParams();
    const navigate = useNavigate();

    const [roleInformation, setRoleInformation] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getRoleInformation = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/character-system-role', {
                    params: { character_name: name }
                });
                setRoleInformation(response.data);
            } catch (error) {
                console.error("Error fetching role information", error);
            } finally {
                setLoading(false);
            }
        };

        getRoleInformation().then(r => console.log(r));
    }, [name]);

    const handleImg = () => {
        if (name === "lucia") return "/lucia.webp"
        else if (name === "mateo") return  "/mateo.webp"
        else if (name === "mariana") return "/mariana.webp"
    }

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '20px',
            borderRadius: '10px',
            marginTop: '40px',
            width: '50%',
            margin: "auto"
        }}>
            <button onClick={() => navigate(-1)} style={{ position: 'absolute', top: '20px', left: '20px' }}>Atrás</button>
            {loading ? (
                <div className="d-flex justify-content-center w-100">
                    <Spinner animation="border" role="status">
                        <span className="sr-only"></span>
                    </Spinner>
                </div>
            ) : (
                <>
                    <img src={handleImg()} alt={name}
                         style={{ width: '250px', height: '250px', borderRadius: '50%', marginRight: '20px' }} />
                    <p style={{ fontSize: '1.5rem', textAlign: "center", fontWeight: "bold" }}>{roleInformation}</p>
                </>
            )}
        </div>
    );
};

export default ProfileRoleInformation;