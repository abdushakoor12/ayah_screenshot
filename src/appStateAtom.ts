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
  POST = "POST",
  STORY = "STORY",
  LANDSCAPE = "LANDSCAPE",
}

export function getAspectRatioNum(aspectRatioType: AspectRatioType): number {
  switch (aspectRatioType) {
    case AspectRatioType.POST:
      return 1;
    case AspectRatioType.STORY:
      return 9/16;
    case AspectRatioType.LANDSCAPE:
      return 16/9;
    default:
      return 1;
  }
}

const initialState: AppState = {
  surah: "1",
  ayah: "",
  translation: "en.asad",
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