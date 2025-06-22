import { createContext } from "react";
const TabDataContext = createContext({
    tabData: {},
    setTabData: ()=>{}
});
export { TabDataContext };
