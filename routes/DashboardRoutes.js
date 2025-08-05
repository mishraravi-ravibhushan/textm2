import { v4 as uuid } from "uuid";
/**
 *  All Dashboard Routes
 *
 *  Understanding name/value pairs for Dashboard routes
 *
 *  Applicable for main/root/level 1 routes
 *  icon 		: String - It's only for main menu or you can consider 1st level menu item to specify icon name.
 *
 *  Applicable for main/root/level 1 and subitems routes
 * 	id 			: Number - You can use uuid() as value to generate unique ID using uuid library, you can also assign constant unique ID for react dynamic objects.
 *  title 		: String - If menu contains childern use title to provide main menu name.
 *  badge 		: String - (Optional - Default - '') If you specify badge value it will be displayed beside the menu title or menu item.
 * 	badgecolor 	: String - (Optional - Default - 'primary' ) - Used to specify badge background color.
 *
 *  Applicable for subitems / children items routes
 *  name 		: String - If it's menu item in which you are specifiying link, use name ( don't use title for that )
 *  children	: Array - Use to specify submenu items
 *
 *  Used to segrigate menu groups
 *  grouptitle : Boolean - (Optional - Default - false ) If you want to group menu items you can use grouptitle = true,
 *  ( Use title : value to specify group title  e.g. COMPONENTS , DOCUMENTATION that we did here. )
 *
 */

export const DashboardMenu = [
  {
    id: uuid(),
    title: "Dashboard",
    icon: "home",
    link: "/home",
  },
  {
    id: uuid(),
    title: "Human Resource ",
    icon: "users",
    children: [{ id: uuid(), link: "/users/list", name: "User List" }],
  },
  {
    id: uuid(),
    title: "Communication",
    icon: "video",
    link: "/communication",
  },
  {
    id: uuid(),
    title: "Reports",
    icon: "users",
    link: "#",
  },
  {
    id: uuid(),
    title: "Stockpile Management",
    icon: "layers",
    link: "#",
  },
  {
    id: uuid(),
    title: "Surveillance",
    icon: "video",
    link: "/surveillance",
  },
  {
    id: uuid(),
    title: "Vehicle Management",
    icon: "truck",
    link: "#",
  },
  {
    id: uuid(),
    title: "Report",
    icon: "briefcase",
    link: "#",
  },
  {
    id: uuid(),
    title: "Assets Management",
    icon: "slack",
    link: "/Assets",
  },
];

export default DashboardMenu;
