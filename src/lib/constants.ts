// Icons
import { BiSolidOffer } from "react-icons/bi";
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
    href: "/coupons",
    icon: BiSolidOffer,
    menu: "Coupons",
  },
  {
    href: "/templates",
    icon: LuLayoutTemplate,
    menu: "Templates",
  },
];
