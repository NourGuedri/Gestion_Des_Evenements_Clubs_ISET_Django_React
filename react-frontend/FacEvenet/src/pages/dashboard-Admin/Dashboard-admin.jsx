import React, { useEffect,useState } from "react";
import './dashboard_admin.css';
import { get_stats } from "../../services/staticsservice";

import { Card } from 'primereact/card';

const header = (
    <img alt="Card" src="https://primefaces.org/cdn/primereact/images/usercard.png" />
);

export const Dashboard_admin = () => {

    const [stats, setStats] = useState({});

    useEffect(() => {
        get_stats().then((data) => {
            if (data.error) {
                console.log(data.error);
            } else {
                setStats(data);
            }
        }
        );
    }
        , []);



    return (
        <div className="container">
            <div className="content">
                <div className="cards">
                    {Object.entries(stats).map(([key, value]) => (
                        <Card key={key} title={key.replace(/_/g, ' ')} style={{ width: '300px' }} header={header} className="md:w-25rem">
                            <div style={{textAlign:'center'}}>
                            <h2 className="m-0">{value}</h2>

                            </div>
                        </Card>
                    ))} 

                </div>
            </div>
        </div>
    )
}