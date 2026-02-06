import { FaHome } from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";

interface navbarProps {
    label: string,
    icon: React.ReactNode,
    to: string
}



export const NavBarLinks: navbarProps[] = [
    {
        label: 'Home',
        icon: <FaHome />,
        to: '/'
    },

    {
        label: 'Admin',
        icon: <RiAdminFill />,
        to: '/admin'
    },
    {
        label: 'Admin',
        icon: <RiAdminFill />,
        to: '/admin'
    },
]