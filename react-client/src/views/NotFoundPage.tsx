import React from 'react';
import { Link } from 'react-router-dom';

    export function NotFoundPage() {

        return (
            <div>


                <img style={{width:"40%", marginLeft:"30%"}} src="/images/PageNotFound.gif" alt={"404-man"} />
                <p style={{textAlign:"center"}}>
                    <Link to="/">Find your way back </Link>
                </p>
            </div>
);

    }


export default NotFoundPage;