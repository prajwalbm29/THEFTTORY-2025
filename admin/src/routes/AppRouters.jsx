import { createBrowserRouter } from 'react-router-dom'
import Home from '../pages/Home'
import PageNotFound from '../pages/PageNotFound'
import Login from '../pages/Login'
import Complaints from '../pages/Complaints'
import Police from '../pages/Police'
import Assignment from '../pages/Assignment'
import GeneralSafety from '../pages/GeneralSafety'
import ProtectedRouter from './ProtectedRouter'
import PhoneComplaints from '../components/complaints/PhoneComplaints'
import LaptopComplaints from '../components/complaints/LaptopComplaints'
import BikeComplaints from '../components/complaints/BikeComplaints'
import CarComplaints from '../components/complaints/CarComplaints'
import GoldComplaints from '../components/complaints/GoldComplaints'
import PhoneDetails from '../components/complaints/PhoneDetails'
import LaptopDetails from '../components/complaints/LaptopDetails'
import BikeDetails from '../components/complaints/BikeDetails'
import CarDetails from '../components/complaints/CarDetails'
import GoldDetails from '../components/complaints/GoldDetails'
import Phone from '../components/assignments/Phone'
import Laptop from '../components/assignments/Laptop'
import Bike from '../components/assignments/Bike'
import Car from '../components/assignments/Car'
import Gold from '../components/assignments/Gold'
import ResolvedComplaints from '../pages/ResolvedComplaints'
import ResolvedPhone from '../components/resolvedComplaints/ResolvedPhone'
import ResolvedLaptop from '../components/resolvedComplaints/ResolvedLaptop'
import ResolvedDetails from '../components/resolvedComplaints/ResolvedDetails'

const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />,
        errorElement: <PageNotFound />
    },
    {
        path: '/login',
        element: <Login />,
        errorElement: <PageNotFound />
    },
    {
        path: '/admin',
        element: <ProtectedRouter />,
        children: [
            {
                path: 'complaints',
                element: <Complaints />,
                children: [
                    {
                        path: 'phone',
                        element: <PhoneComplaints />
                    },
                    {
                        path: 'phone/:id',
                        element: <PhoneDetails />
                    },
                    {
                        path: 'laptop',
                        element: <LaptopComplaints />
                    },
                    {
                        path: 'laptop/:id',
                        element: <LaptopDetails/>
                    },
                    {
                        path: 'bike',
                        element: <BikeComplaints />
                    },
                    {
                        path: 'bike/:id',
                        element: <BikeDetails />
                    },
                    {
                        path: 'car',
                        element: <CarComplaints />
                    },
                    {
                        path: 'car/:id',
                        element: <CarDetails />
                    },
                    {
                        path: 'gold',
                        element: <GoldComplaints />
                    },
                    {
                        path: 'gold/:id',
                        element: <GoldDetails />
                    }
                ]
            },
            {
                path: 'polices',
                element: <Police />
            },
            {
                path: 'assignment',
                element: <Assignment />,
                children: [
                    {
                        path: 'phone',
                        element: <Phone />
                    },
                    {
                        path: 'laptop',
                        element: <Laptop />
                    },
                    {
                        path: 'bike',
                        element: <Bike />
                    },
                    {
                        path: 'car',
                        element: <Car />
                    },
                    {
                        path: 'gold',
                        element: <Gold />
                    }
                ]
            },
            {
                path: 'general-safety',
                element: <GeneralSafety />
            },
            {
                path: 'resolved-complaints',
                element: <ResolvedComplaints/>,
                children: [
                    {
                        path: 'phone',
                        element: <ResolvedPhone />
                    },
                    {
                        path: 'laptop',
                        element: <ResolvedLaptop />
                    },
                    {
                        path: ':type/:id',
                        element: <ResolvedDetails />
                    }
                ]
            }
        ],
        errorElement: <PageNotFound />
    }
])

export default router 