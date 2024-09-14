import { atom } from "jotai";

export interface AppState {
  surah: string;
  ayah: string;
  translation: string;
  aspectRatioType: AspectRatioType;
  fontSize: number;
  translationFontSize: number;
  padding: number;
  showAyah: boolean;
  showTranslation: boolean;
  textColor: string;
  gradient1Color: string;
  gradient2Color: string;
}

export enum AspectRatioType {
  POST = 1/1,
  STORY = 9/16,
  LANDSCAPE = 16/9,
}

const initialState: AppState = {
  surah: "1",
  ayah: "",
  translation: "",
  aspectRatioType: AspectRatioType.POST,
  fontSize: 16,
  translationFontSize: 16,
  padding: 16,
  showAyah: true,
  showTranslation: true,
  textColor: "#FFFFFF",
  gradient1Color: "#00D8FF",
  gradient2Color: "#BD34FE",
};

export const appStateAtom = atom(initialState);