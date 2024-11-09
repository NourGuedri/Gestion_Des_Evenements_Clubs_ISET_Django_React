import { Outlet } from "react-router-dom"

import {Footer} from "./Footer"
import './Layout.css'
import { Header_president } from "./Header_president"

export default function Layout_president() {
    return (
        <>
            <Header_president />
            <main>                
                <Outlet />
            </main>
            <Footer />
        </>
    )
}