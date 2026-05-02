 
export interface NavItem{
  id:number,
  name: string,
  Link: string,
}

export const navItems: NavItem[] = [
  { id: 1, name: "Home",     Link: "/"    },
  { id: 2, name: "About",    Link: "/about"    },
  { id: 3, name: "Services", Link: "/services" },
  { id: 4, name: "Contact",  Link: "/contact"  },
  { id: 5, name: "Login",  Link: "/login"  },

];