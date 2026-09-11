  // /* eslint-disable @typescript-eslint/no-explicit-any */
  // /* eslint-disable @typescript-eslint/no-unused-expressions */
  // import { createSlice } from "@reduxjs/toolkit";
  // import type { PayloadAction } from "@reduxjs/toolkit";
  // import { decryptData, encryptData } from "../utils/Helper";

  // export type UserConfig = {
  //   _id: string;
  //   email: string;
  //   role: number;
  //   roleId: string;
  //   departmentId: string;
  //   branchId: string;
  //   // photo?: string;
  //   fullName: string;
  //   mobile: string;
  //   country: string;
  //   state: string;
  //   permissions: any;
  //   city: string;
  //   pincode: string;
  //   address: string;
  //   token: string;
  //   isPaid: boolean;
  //   expiresAt?: any;
  // };

  // // const data = localStorage.getItem('authData');
  // const localStorageData = decryptData("authData");
  // // if(data){
  // //     localStorageData = decryptData('authData') || null;
  // // }

  // export const defaultUserConfigState: UserConfig = {
  //   token: localStorageData?.token || null,
  //   fullName: localStorageData?.user?.fullName || null,
  //   mobile: localStorageData?.user?.mobile || null,
  //   email: localStorageData?.user?.email || null,
  //   _id: localStorageData?.user?._id || null,
  //   pincode: localStorageData?.user?.pincode || null,
  //   permissions: localStorageData?.user?.permissions || null,
  //   role: localStorageData?.user?.role || null,
  //   roleId: localStorageData?.user?.roleId || null,
  //   departmentId: localStorageData?.user?.departmentId || null,
  //   branchId: localStorageData?.user?.branchId || null,
  //   country: localStorageData?.user?.country || null,
  //   state: localStorageData?.user?.state || null,
  //   city: localStorageData?.user?.city || null,
  //   address: localStorageData?.user?.address || null,
  //   // photo: localStorageData?.user?.photo || null,
  //   isPaid: localStorageData?.user?.isPaid || false,
  //   expiresAt: localStorageData?.expiresAt || false,
  // };
  // const initialState = defaultUserConfigState;

  // const userConfigSlice = createSlice({
  //   name: "userConfig",
  //   initialState: initialState,
  //   reducers: {
  //     setUserConfig: (state, { payload }: PayloadAction<UserConfig>) => {
  //       ((state.token = payload.token || state.token),
  //         (state.email = payload.email || ""),
  //         (state.fullName = payload.fullName || ""),
  //         (state.mobile = payload.mobile || ""),
  //         (state._id = payload._id || ""),
  //         (state.state = payload.state || ""),
  //         (state.city = payload.city || ""),
  //         (state.role = payload.role || 6),
  //         // state.roleId = payload.roleId || "",
  //         (state.departmentId = payload.departmentId),
  //         (state.branchId = payload.branchId),
  //         (state.permissions = payload.permissions || []),
  //         (state.roleId = payload.roleId));
  //       ((state.expiresAt = payload.expiresAt || state.expiresAt),
  //         encryptData("authData", {
  //           token: payload.token || state.token,
  //           user: {
  //             _id: payload._id || state._id,
  //             fullName: payload.fullName || state.fullName,
  //             mobile: payload.mobile || state.mobile,
  //             email: payload.email || state.email,
  //             role: payload.role || state.role,
  //             roleId: payload.roleId,
  //             departmentId: payload.departmentId,
  //             branchId: payload.branchId,
  //             state: payload.state || state.state,
  //             city: payload.city || state.city,
  //             permissions: payload.permissions || state.permissions,
  //           },
  //           expiresAt: payload.expiresAt || state.expiresAt || false,
  //         }));
  //     },

  //     setUserRolePermissionConfig: (
  //       state,
  //       { payload }: PayloadAction<UserConfig>,
  //     ) => {
  //       state.permissions = payload;
  //       encryptData("authData", {
  //         token: state.token,
  //         user: {
  //           _id: state._id,
  //           fullName: state.fullName,
  //           email: state.email,
  //           role: state.role,
  //           roleId: state.roleId,
  //           departmentId: state.departmentId,
  //           branchId: state.branchId,
  //           mobile: state.mobile,
  //           country: state.country,
  //           state: state.state,
  //           city: state.city,
  //           permissions: state.permissions,
  //         },
  //         expiresAt: state.expiresAt || false,
  //       });
  //     },

  //     setUserClearConfig: (state) => {
  //       state.token = "";
  //       state.email = "";
  //       state.fullName = "";
  //       state.mobile = "";
  //       state.country = "";
  //       state.state = "";
  //       state.city = "";
  //       state.address = "";
  //       state._id = "";
  //       state.role = NaN;
  //       state.roleId = "";
  //       state.departmentId = "";
  //       state.branchId = "";
  //       state.expiresAt = NaN;
  //       state.permissions = null;
  //       localStorage.clear();
  //     },
  //   },
  // });

  // export const {
  //   setUserConfig,
  //   setUserRolePermissionConfig,
  //   setUserClearConfig,
  // } = userConfigSlice.actions;
  // export default userConfigSlice.reducer;