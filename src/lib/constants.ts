// Icons
import { HiOutlineSpeakerphone } from "react-icons/hi";
import { LuLayoutTemplate } from "react-icons/lu";
import { IoAddCircleOutline } from "react-icons/io5";
import { HiOutlineOfficeBuilding } from "react-icons/hi";

// Interfaces for constants
interface MenuItem {
  href: string;
  icon: any;
  menu: string;
}

// constants
export const menuItems: MenuItem[] = [
  {
    href: "/company-list",
    icon: HiOutlineOfficeBuilding,
    menu: "Company list",
  },
  {
    href: "/customers",
    icon: IoAddCircleOutline,
    menu: "Customers",
  },
  {
    href: "/templates",
    icon: LuLayoutTemplate,
    menu: "Templates",
  },
  {
    href: "/broadcast",
    icon: HiOutlineSpeakerphone,
    menu: "Broadcast",
  },
];
