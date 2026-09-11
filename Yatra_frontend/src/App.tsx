import { useEffect, type PropsWithChildren } from "react";
import "./App.css";
// import { getActiveRolePermissions } from "./utils/API";
// import { useDispatch, useSelector } from "react-redux";
// import type { IRootState } from "./store";
// import { setUserClearConfig, setUserRolePermissionConfig } from "./store/userConfigSlice";
// import { decryptData } from "./utils/Helper";
// import { useNavigate } from "react-router-dom";

function App({ children }: PropsWithChildren) {
  // const authData = useSelector((state: IRootState) => state.userConfig);
  // const dispatch = useDispatch();
  // const localStorageData = decryptData("authData", "object");
  // const isAdminRoute = location.pathname.startsWith("/admin/");
  // const navigate = useNavigate();
  // const authToken = authData.token;
  // console.log("auth", authData);

  // useEffect(() => {
  //   const getRoles = async () => {
  //     try {
  //       const res: any = await getActiveRolePermissions(authData?.roleId);
  //       if (res.data.success) {
  //         dispatch(setUserRolePermissionConfig(res.data.data));
  //       }
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   authData.token && getRoles();
  // }, []);

  // useEffect(() => {
  //   if ((!localStorageData?.token && authData.token && authData.token != "") || Date.now() > localStorageData?.expiresAt) {
  //     localStorage.removeItem("authData");
  //     dispatch(setUserClearConfig());
  //   }
  //   if (!localStorageData?.token && isAdminRoute) {
  //     navigate("/");
  //   }
  // }, []);

  // useEffect(() => {
  //   if (authData.token && location.pathname == "/login") {
  //     navigate("/admin/dashboard");
  //   }
  // }, [location.pathname]);

  return (
    <>
      <section>
        {children}
      </section>
    </>
  );
}

export default App;
