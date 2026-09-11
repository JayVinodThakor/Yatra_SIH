/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import logo from "/icons.svg";
import favicon from "/favicon.svg";

export type SettingConfig = {
  name: string;
  mobile: number;
  email: string;
  address: string;
  logo: string;
  favicon: string;
  copyrightYear: number;
  facebookLink: string;
  linkedinLink: string;
  youtubeLink: string;
  instagramLink: string;
};

export const initialSettingsState = {
  name: "Citizen Connect AI",
  mobile: NaN,
  email: "info@citizenconnectai.com",
  address: ``,
  logo: logo,
  favicon: favicon,
  copyrightYear: new Date().getFullYear(),
  facebookLink: "",
  linkedinLink: "",
  youtubeLink: "",
  instagramLink: "",
};

const setingConfigSlice = createSlice({
  name: "setting",
  initialState: initialSettingsState,
  reducers: {
    setSettingConfig: (state, { payload }: PayloadAction<SettingConfig>) => {
      state.name = payload.name || state.name;
      state.mobile = payload.mobile || state.mobile;
      state.email = payload.email || state.email;
      state.address = payload.address || state.address;
      state.logo = payload.logo
        ? `${import.meta.env.VITE_APP_Image_URL}/settings/${payload.logo}`
        : state.logo;
      state.favicon = payload.favicon
        ? `${import.meta.env.VITE_APP_Image_URL}/settings/${payload.favicon}`
        : state.favicon;
      state.copyrightYear = payload.copyrightYear || state.copyrightYear;
      state.facebookLink = payload.facebookLink || state.facebookLink;
      state.linkedinLink = payload.linkedinLink || state.linkedinLink;
      state.youtubeLink = payload.youtubeLink || state.youtubeLink;
      state.instagramLink = payload.instagramLink || state.instagramLink;
    },

    updateDocumentHead: (state) => {
      let faviconElement = document.querySelector(
        "link[rel*='icon']",
      ) as HTMLLinkElement | null;

      if (!faviconElement) {
        faviconElement = document.createElement("link") as HTMLLinkElement;
        faviconElement.rel = "icon";
        document.head.appendChild(faviconElement);
      }

      if (state.favicon) {
        faviconElement.href = state.favicon;
      }
    },

    setAllSetting(_state: any, { payload }: any) {
      localStorage.setItem("setting", JSON.stringify(payload));
      return payload;
    },

    setSetting(state: any, { payload }: any) {
      state[payload.type] = payload.data;
      localStorage.setItem("setting", JSON.stringify(state));
    },
  },
});

export const {
  setSetting,
  setSettingConfig,
  setAllSetting,
  updateDocumentHead,
} = setingConfigSlice.actions;

export default setingConfigSlice.reducer;