import { useRef, useState } from "react";
import { useScreenshot } from "use-react-screenshot";
import { TRANSLATIONS } from "./translations";

const ASPECT_RATIO = ["POST", "STORY"];

function App() {
  const [surah, setSurah] = useState("1");
  const [ayah, setAyah] = useState("");
  const [translation, setTranslation] = useState<string | undefined>(undefined);

  const [aspectRatioType, setAspectRatioType] = useState("POST");

  const [fontSize, setFontSize] = useState(16);
  const [translationFontSize, setTranslationFontSize] = useState(16);

  const [ayahText, setAyahText] = useState("");
  const [translationText, setTranslationText] = useState("");

  const [showTranslation, setShowTranslation] = useState(true);
  const [showAyah, setShowAyah] = useState(true);

  const [padding, setPadding] = useState(16);

  const [_, takeScreenshot] = useScreenshot();

  const ref = useRef(null);

  const aspectRatioNum = aspectRatioType === "POST" ? 1 : 9 / 16;

  async function loadAyah() {
    const url = `https://api.alquran.cloud/v1/ayah/${surah}:${ayah}/quran-uthmani`;
    const response = await fetch(url);
    const data = await response.json();

    if (response.status !== 200) {
      alert("Something went wrong");
      return;
    }

    setAyahText(data.data.text);
  }

  async function loadTranslation() {
    if (!translation) {
      setTranslationText("");
      return;
    }

    const url = `https://api.alquran.cloud/v1/ayah/${surah}:${ayah}/${translation}`;
    const response = await fetch(url);
    const data = await response.json();

    if (response.status !== 200) {
      alert("Something went wrong");
      return;
    }

    setTranslationText(data.data.text);
  }

  return (
    <div className="container mx-auto flex max-w-lg min-w-lg flex-col items-center gap-4 py-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          loadAyah();
          loadTranslation();
        }}
        className="w-full flex flex-col gap-2"
      >
        <div className="flex gap-2 items-center w-full">
          <select
            value={surah}
            onChange={(e) => setSurah(e.target.value)}
            className="border-2 border-gray-400 rounded-lg p-2 w-full"
          >
            {Array.from({ length: 114 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                Surah {i + 1}
              </option>
            ))}
          </select>

          <input
            type="number"
            id="ayah"
            value={ayah}
            onChange={(e) => setAyah(e.target.value)}
            required
            placeholder="Enter Ayah Number"
            min="1"
            max="286"
            name="ayah"
            className="border-2 border-gray-400 rounded-lg p-2 w-full"
          />
        </div>

        <div className="flex gap-2 items-center w-full">
          <select
            value={translation}
            onChange={(e) => setTranslation(e.target.value)}
            className="border-2 border-gray-400 rounded-lg p-2 w-full"
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

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 rounded px-16"
          >
            Load
          </button>
        </div>
      </form>

      <hr className="border-gray-400 w-full" />

      <div className="flex w-full gap-2 items-center">
        <h1 className="text-xl">Type</h1>

        <div className="flex-1" />

        {ASPECT_RATIO.map((type) => (
          <div
            key={type}
            className={`${
              aspectRatioType === type
                ? "bg-blue-500 hover:bg-blue-700"
                : "bg-gray-400 hover:bg-gray-500"
            } text-white font-bold py-2 rounded px-8 flex items-center gap-2`}
            onClick={() => setAspectRatioType(type)}
          >
            {type}
          </div>
        ))}
      </div>

      <div className="flex w-full gap-2 items-center">
        <h1 className="text-xl ">Font Size</h1>

        <div className="w-16" />

        <input
          type="range"
          min="8"
          max="100"
          value={fontSize}
          onChange={(e) => setFontSize(parseInt(e.target.value))}
          id="font-slider"
          name="font"
          className="flex-1"
        />
      </div>

      <div className="flex w-full gap-2 items-center">
        <h1 className="text-xl">Translation Font Size</h1>

        <div className="w-16" />

        <input
          type="range"
          min="8"
          max="100"
          value={translationFontSize}
          onChange={(e) => setTranslationFontSize(parseInt(e.target.value))}
          id="translation-font-slider"
          name="translation-font"
          className="flex-1"
        />
      </div>

      <div className="flex w-full gap-2 items-center">
        <h1 className="text-xl">Padding</h1>

        <div className="w-16" />

        <input
          type="range"
          min="0"
          max="100"
          value={padding}
          onChange={(e) => setPadding(parseInt(e.target.value))}
          id="padding-slider"
          name="padding"
          className="flex-1"
        />
      </div>

      <div className="flex w-full gap-2 items-center">
        <h1 className="text-xl">Show Ayah</h1>

        <input
          type="checkbox"
          checked={showAyah}
          onChange={(e) => setShowAyah(e.target.checked)}
          id="show-ayah"
          name="show-ayah"
        />

        <div className="w-16" />

        <h1 className="text-xl">Show Translation</h1>

        <input
          type="checkbox"
          checked={showTranslation}
          onChange={(e) => setShowTranslation(e.target.checked)}
          id="show-translation"
          name="show-translation"
        />
      </div>

      <hr className="border-gray-400 w-full" />

      <div
        ref={ref}
        style={{
          aspectRatio: aspectRatioNum,
          width: "100%",
          padding: `${padding}px`,
        }}
        className="aspect-square  text-white overflow-clip bg-gradient-to-r from-blue-500 to-blue-700 flex flex-col items-center justify-center"
      >
        {showAyah && (
          <p
            style={{
              fontSize: `${fontSize}px`,
            }}
            className="text-center font-indopak"
          >
            {ayahText}
          </p>
        )}

        {showTranslation && (
          <p
            style={{
              fontSize: `${translationFontSize}px`,
            }}
            className="text-center font-serif"
          >
            {translationText}
          </p>
        )}
      </div>

      <button
        onClick={() => {
          takeScreenshot(ref.current).then((image: any) => {
            const link = document.createElement("a");
            link.href = image;
            link.download = "ayah.png";
            link.click();
          });
        }}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 rounded px-16"
      >
        Download Image
      </button>
    </div>
  );
}

export default App;
