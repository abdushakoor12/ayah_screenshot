import { useEffect, useRef, useState } from "react";
import { TRANSLATIONS } from "./translations";
import { SURAH_LIST } from "./surahs";
import { gradientColors } from "./gradients";
import { useAtom } from "jotai";
import {
  appStateAtom,
  AspectRatioType,
  getAspectRatioNum,
} from "./appStateAtom";
import { BACKGROUNDS } from "./backgrounds";
import html2canvas from "html2canvas";
import { FONTS_LISTS } from "./fonts_list";

function App() {
  const [appState, setAppState] = useAtom(appStateAtom);
  const [font, setFont] = useState<string>(FONTS_LISTS[0]);
  const {
    surah,
    ayah,
    translation,
    aspectRatioType,
    fontSize,
    translationFontSize,
    padding,
    showAyah,
    showTranslation,
    textColor,
    gradient1Color,
    gradient2Color,
    backgroundImageUrl,
    backgroundType,
  } = appState;

  const [ayahText, setAyahText] = useState("");
  const [translationText, setTranslationText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"content" | "style" | "background">("content");
  const [downloadingImage, setDownloadingImage] = useState(false);

  const selectedSurah = SURAH_LIST.find((e) => e.number.toString() === surah);

  const ref = useRef(null);

  const aspectRatioNum = getAspectRatioNum(aspectRatioType);

  async function loadAyah(surah: string, ayah: string) {
    setIsLoading(true);
    const url = `https://api.alquran.cloud/v1/ayah/${surah}:${ayah}/quran-uthmani`;
    const response = await fetch(url);
    const data = await response.json();

    if (response.status !== 200) {
      alert("Something went wrong");
      setIsLoading(false);
      return;
    }

    setAyahText(data.data.text);
    setIsLoading(false);
  }

  function loadRandom() {
    setIsLoading(true);
    const surahRandom = getRandomItem(SURAH_LIST);
    const ayahRandom = getRandomIntBetween(1, surahRandom.numberOfAyahs);

    setAppState({
      ...appState,
      surah: surahRandom.number.toString(),
      ayah: ayahRandom.toString(),
    });

    loadAyah(surahRandom.number.toString(), ayahRandom.toString());
    loadTranslation(surahRandom.number.toString(), ayahRandom.toString());
  }

  useEffect(() => {
    loadRandom();
  }, []);

  async function takeScreenshot2(node: HTMLElement) {
    setDownloadingImage(true);
    const canvas = await html2canvas(node, {
      useCORS: true,
    });
    const croppedCanvas = document.createElement("canvas");
    const croppedCanvasContext = croppedCanvas.getContext("2d");
    // init data
    const cropPositionTop = 0;
    const cropPositionLeft = 0;
    const cropWidth = canvas.width;
    const cropHeight = canvas.height;
    croppedCanvas.width = cropWidth;
    croppedCanvas.height = cropHeight;
    croppedCanvasContext!.drawImage(canvas, cropPositionLeft, cropPositionTop);
    const base64Image = croppedCanvas.toDataURL();
    const link = document.createElement("a");
    link.href = base64Image;
    link.download = `${surah}:${ayah}.png`;
    link.click();
    setDownloadingImage(false);
  }

  async function loadTranslation(surah: string, ayah: string) {
    if (!translation) {
      setTranslationText("");
      return;
    }

    setIsLoading(true);
    const url = `https://api.alquran.cloud/v1/ayah/${surah}:${ayah}/${translation}`;
    const response = await fetch(url);
    const data = await response.json();

    if (response.status !== 200) {
      alert("Something went wrong");
      setIsLoading(false);
      return;
    }

    setTranslationText(data.data.text);
    setIsLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Ayah Screenshot Creator</h1>
          <p className="text-gray-600 mt-2">Create beautiful screenshots of Quranic verses</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Preview Panel - Full width on mobile, 5/12 on desktop */}
          <div className="md:col-span-5 order-1">
            <div className="bg-white rounded-xl shadow-lg p-4 mb-4 md:sticky md:top-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Preview</h2>
              
              {/* Aspect ratio container */}
              <div 
                className="w-full relative"
                style={{
                  paddingBottom: `${(1 / aspectRatioNum) * 100}%`,
                }}
              >
                <div
                  ref={ref}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    color: textColor,
                    padding: `${padding}px`,
                    background:
                      backgroundType === "gradient"
                        ? `linear-gradient(to right, ${gradient1Color}, ${gradient2Color})`
                        : `url(${backgroundImageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
                  className="relative"
                >
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 z-10">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                    </div>
                  )}
                  
                  <div className="flex flex-col items-center justify-center w-full h-full">
                    {showAyah && (
                      <p
                        style={{
                          fontSize: `${fontSize}px`,
                          fontFamily: `${font}`,
                          textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                        }}
                        className="text-center mb-4"
                      >
                        {ayahText}
                      </p>
                    )}

                    {showTranslation && (
                      <p
                        style={{
                          fontSize: `${translationFontSize}px`,
                          textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                        }}
                        className="text-center font-serif mb-4"
                      >
                        {translationText}
                      </p>
                    )}

                    <p
                      style={{
                        fontSize: `12px`,
                        fontWeight: "bold",
                        textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                      }}
                      className="mt-auto"
                    >
                      {selectedSurah ? `[ ${ayah} ] [ ${selectedSurah.name} ]` : ""}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-2 text-xs text-gray-500 text-center">
                {aspectRatioType === AspectRatioType.POST && "1:1 Square Format"}
                {aspectRatioType === AspectRatioType.STORY && "9:16 Story Format"}
                {aspectRatioType === AspectRatioType.LANDSCAPE && "16:9 Landscape Format"}
              </div>
              
              <button
                onClick={() => {
                  takeScreenshot2(ref.current!);
                }}
                disabled={downloadingImage || isLoading}
                className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg shadow transition-colors duration-200 flex items-center justify-center"
              >
                {downloadingImage ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Downloading...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Image
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Controls Panel - Full width on mobile, 7/12 on desktop */}
          <div className="md:col-span-7 order-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              {/* Tabs */}
              <div className="flex border-b border-gray-200 mb-6">
                <button
                  onClick={() => setActiveTab("content")}
                  className={`px-4 py-2 font-medium text-sm ${
                    activeTab === "content"
                      ? "text-emerald-600 border-b-2 border-emerald-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Content
                </button>
                <button
                  onClick={() => setActiveTab("style")}
                  className={`px-4 py-2 font-medium text-sm ${
                    activeTab === "style"
                      ? "text-emerald-600 border-b-2 border-emerald-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Style
                </button>
                <button
                  onClick={() => setActiveTab("background")}
                  className={`px-4 py-2 font-medium text-sm ${
                    activeTab === "background"
                      ? "text-emerald-600 border-b-2 border-emerald-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Background
                </button>
              </div>
              
              {/* Content Tab */}
              {activeTab === "content" && (
                <div>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      loadAyah(surah, ayah);
                      loadTranslation(surah, ayah);
                    }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="surah" className="block text-sm font-medium text-gray-700 mb-1">
                          Surah
                        </label>
                        <select
                          id="surah"
                          value={surah}
                          onChange={(e) => {
                            setAppState({
                              ...appState,
                              surah: e.target.value,
                            });
                          }}
                          className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        >
                          {SURAH_LIST.map((surah) => (
                            <option key={surah.number} value={surah.number}>
                              {surah.number}. {surah.englishName}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="ayah" className="block text-sm font-medium text-gray-700 mb-1">
                          Ayah Number
                        </label>
                        <input
                          type="number"
                          id="ayah"
                          value={ayah}
                          onChange={(e) => {
                            setAppState({
                              ...appState,
                              ayah: e.target.value,
                            });
                          }}
                          required
                          placeholder="Enter Ayah Number"
                          min="1"
                          max={selectedSurah?.numberOfAyahs}
                          name="ayah"
                          className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="translation" className="block text-sm font-medium text-gray-700 mb-1">
                        Translation
                      </label>
                      <select
                        id="translation"
                        value={translation}
                        onChange={(e) => {
                          setAppState({
                            ...appState,
                            translation: e.target.value,
                          });
                        }}
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      >
                        <option value={undefined} disabled>
                          Select Translation
                        </option>
                        {TRANSLATIONS.map((translation) => (
                          <option
                            key={translation.identifier}
                            value={translation.identifier}
                          >
                            {translation.englishName} ({translation.language})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-lg shadow transition-colors duration-200"
                      >
                        {isLoading ? "Loading..." : "Load Ayah"}
                      </button>

                      <button
                        type="button"
                        disabled={isLoading}
                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2.5 rounded-lg shadow transition-colors duration-200"
                        onClick={() => {
                          loadRandom();
                        }}
                      >
                        {isLoading ? "Loading..." : "Random Ayah"}
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label htmlFor="ayahText" className="block text-sm font-medium text-gray-700 mb-1">
                          Ayah Text (Edit if needed)
                        </label>
                        <textarea
                          id="ayahText"
                          value={ayahText}
                          onChange={(e) => setAyahText(e.target.value)}
                          className="w-full h-24 border border-gray-300 rounded-lg p-2.5 text-right resize-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="translationText" className="block text-sm font-medium text-gray-700 mb-1">
                          Translation Text (Edit if needed)
                        </label>
                        <textarea
                          id="translationText"
                          value={translationText}
                          onChange={(e) => setTranslationText(e.target.value)}
                          className="w-full h-24 border border-gray-300 rounded-lg p-2.5 resize-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center">
                        <input
                          id="show-ayah"
                          type="checkbox"
                          checked={showAyah}
                          onChange={(e) => {
                            setAppState({
                              ...appState,
                              showAyah: e.target.checked,
                            });
                          }}
                          className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                        />
                        <label htmlFor="show-ayah" className="ml-2 text-sm font-medium text-gray-700">
                          Show Ayah
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          id="show-translation"
                          type="checkbox"
                          checked={showTranslation}
                          onChange={(e) => {
                            setAppState({
                              ...appState,
                              showTranslation: e.target.checked,
                            });
                          }}
                          className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                        />
                        <label htmlFor="show-translation" className="ml-2 text-sm font-medium text-gray-700">
                          Show Translation
                        </label>
                      </div>
                    </div>
                  </form>
                </div>
              )}
              
              {/* Style Tab */}
              {activeTab === "style" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Image Type</h3>
                    <div className="flex flex-wrap gap-3">
                      {[
                        AspectRatioType.POST,
                        AspectRatioType.STORY,
                        AspectRatioType.LANDSCAPE,
                      ].map((type) => (
                        <button
                          key={type}
                          className={`${
                            aspectRatioType === type
                              ? "bg-emerald-600 hover:bg-emerald-700"
                              : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                          } text-white font-medium py-2 rounded-lg px-4 flex-1 transition-colors duration-200`}
                          onClick={() => {
                            setAppState({
                              ...appState,
                              aspectRatioType: type,
                            });
                          }}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      {aspectRatioType === AspectRatioType.POST && "Square format (1:1) - Best for Instagram posts"}
                      {aspectRatioType === AspectRatioType.STORY && "Vertical format (9:16) - Best for Instagram/Facebook stories"}
                      {aspectRatioType === AspectRatioType.LANDSCAPE && "Horizontal format (16:9) - Best for Twitter, Facebook posts"}
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="font" className="block text-sm font-medium text-gray-700 mb-2">
                      Arabic Font
                    </label>
                    <select
                      id="font"
                      value={font}
                      onChange={(e) => {
                        setFont(e.target.value);
                      }}
                      className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      {FONTS_LISTS.map((font) => (
                        <option key={font} value={font}>
                          {font}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label htmlFor="font-slider" className="block text-sm font-medium text-gray-700">
                        Ayah Font Size
                      </label>
                      <span className="text-sm text-gray-500">{fontSize}px</span>
                    </div>
                    <input
                      type="range"
                      min="8"
                      max="100"
                      value={fontSize}
                      onChange={(e) => {
                        setAppState({
                          ...appState,
                          fontSize: parseInt(e.target.value),
                        });
                      }}
                      id="font-slider"
                      name="font"
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label htmlFor="translation-font-slider" className="block text-sm font-medium text-gray-700">
                        Translation Font Size
                      </label>
                      <span className="text-sm text-gray-500">{translationFontSize}px</span>
                    </div>
                    <input
                      type="range"
                      min="8"
                      max="100"
                      value={translationFontSize}
                      onChange={(e) => {
                        setAppState({
                          ...appState,
                          translationFontSize: parseInt(e.target.value),
                        });
                      }}
                      id="translation-font-slider"
                      name="translation-font"
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label htmlFor="padding-slider" className="block text-sm font-medium text-gray-700">
                        Padding
                      </label>
                      <span className="text-sm text-gray-500">{padding}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={padding}
                      onChange={(e) => {
                        setAppState({
                          ...appState,
                          padding: parseInt(e.target.value),
                        });
                      }}
                      id="padding-slider"
                      name="padding"
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="text-color" className="block text-sm font-medium text-gray-700 mb-2">
                      Text Color
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        id="text-color"
                        type="color"
                        value={textColor}
                        onChange={(e) => {
                          setAppState({
                            ...appState,
                            textColor: e.target.value,
                          });
                        }}
                        className="h-10 w-20 border-0 rounded cursor-pointer"
                      />
                      <span className="text-sm text-gray-500">{textColor}</span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Background Tab */}
              {activeTab === "background" && (
                <div className="space-y-6">
                  <div>
                    <label htmlFor="background-type" className="block text-sm font-medium text-gray-700 mb-2">
                      Background Type
                    </label>
                    <div className="flex gap-3">
                      <button
                        className={`${
                          backgroundType === "gradient"
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                            : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                        } font-medium py-2 rounded-lg px-4 flex-1 transition-colors duration-200`}
                        onClick={() => {
                          setAppState({
                            ...appState,
                            backgroundType: "gradient",
                          });
                        }}
                      >
                        Gradient
                      </button>
                      <button
                        className={`${
                          backgroundType === "image"
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                            : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                        } font-medium py-2 rounded-lg px-4 flex-1 transition-colors duration-200`}
                        onClick={() => {
                          setAppState({
                            ...appState,
                            backgroundType: "image",
                          });
                        }}
                      >
                        Image
                      </button>
                    </div>
                  </div>
                  
                  {backgroundType === "gradient" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Custom Gradient Colors
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            value={gradient1Color}
                            onChange={(e) => {
                              setAppState({
                                ...appState,
                                gradient1Color: e.target.value,
                              });
                            }}
                            className="h-10 w-20 border-0 rounded cursor-pointer"
                          />
                          <span className="text-sm text-gray-500">to</span>
                          <input
                            type="color"
                            value={gradient2Color}
                            onChange={(e) => {
                              setAppState({
                                ...appState,
                                gradient2Color: e.target.value,
                              });
                            }}
                            className="h-10 w-20 border-0 rounded cursor-pointer"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Preset Gradients
                        </label>
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                          {gradientColors.map((gradient) => (
                            <button
                              key={gradient.start + gradient.end}
                              style={{
                                background: `linear-gradient(to right, ${gradient.start}, ${gradient.end})`,
                              }}
                              className="aspect-square rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border-2 border-transparent hover:border-gray-300"
                              onClick={() => {
                                setAppState({
                                  ...appState,
                                  gradient1Color: gradient.start,
                                  gradient2Color: gradient.end,
                                });
                              }}
                            ></button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                  
                  {backgroundType === "image" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Background Images
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {BACKGROUNDS.map((bgUrl) => (
                          <button
                            key={bgUrl}
                            style={{
                              backgroundImage: `url(${bgUrl})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }}
                            className={`aspect-square rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 ${
                              backgroundImageUrl === bgUrl
                                ? "ring-2 ring-emerald-500"
                                : "ring-0"
                            }`}
                            onClick={() => {
                              setAppState({
                                ...appState,
                                backgroundImageUrl: bgUrl,
                              });
                            }}
                          ></button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getRandomIntBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomItem<T>(array: T[]): T {
  return array[getRandomIntBetween(0, array.length - 1)];
}

export default App;
