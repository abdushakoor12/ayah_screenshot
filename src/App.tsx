import { useRef, useState } from "react";
import { useScreenshot } from "use-react-screenshot";
import { TRANSLATIONS } from "./translations";
import { SURAH_LIST } from "./surahs";
import { gradientColors } from "./gradients";

const ASPECT_RATIO = ["POST", "STORY"];

function App() {
  const [surah, setSurah] = useState("1");
  const [ayah, setAyah] = useState("");
  const [translation, setTranslation] = useState<string | undefined>("en.asad");

  const [aspectRatioType, setAspectRatioType] = useState("POST");

  const [fontSize, setFontSize] = useState(16);
  const [translationFontSize, setTranslationFontSize] = useState(16);

  const [ayahText, setAyahText] = useState("");
  const [translationText, setTranslationText] = useState("");

  const [showTranslation, setShowTranslation] = useState(true);
  const [showAyah, setShowAyah] = useState(true);

  const [padding, setPadding] = useState(16);

  const selectedSurah = SURAH_LIST.find((e) => e.number.toString() === surah);

  const [_, takeScreenshot] = useScreenshot();

  const ref = useRef(null);

  const aspectRatioNum = aspectRatioType === "POST" ? 1 : 9 / 16;

  const [textColor, setTextColor] = useState("#FFFFFF");
  const [gradient1Color, setGradient1Color] = useState("#00D8FF");
  const [gradient2Color, setGradient2Color] = useState("#BD34FE");

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

  function loadRandom() {
    const surahRandom = getRandomItem(SURAH_LIST);
    setSurah(surahRandom.number.toString());
    setAyah(getRandomIntBetween(1, surahRandom.numberOfAyahs).toString());

    loadAyah();
    loadTranslation();
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
            {SURAH_LIST.map((surah) => (
              <option key={surah.number} value={surah.number}>
                {surah.number}. {surah.englishName}
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
            max={selectedSurah?.numberOfAyahs}
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
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 rounded px-16"
        >
          Load
        </button>

        <button
          type="button"
          className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 rounded px-16"
          onClick={() => {
            loadRandom();
          }}
        >
          Randomize
        </button>
      </form>

      <textarea
        value={ayahText}
        onChange={(e) => setAyahText(e.target.value)}
        className="w-full h-16 border-2 text-right border-gray-400 rounded-lg p-2 resize-none"
      />

      <textarea
        value={translationText}
        onChange={(e) => setTranslationText(e.target.value)}
        className="w-full h-16 border-2 border-gray-400 rounded-lg p-2 resize-none"
      />

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
        <h1 className="text-md">Show Ayah</h1>

        <input
          type="checkbox"
          checked={showAyah}
          onChange={(e) => setShowAyah(e.target.checked)}
          id="show-ayah"
          name="show-ayah"
        />

        <div className="w-2" />

        <h1 className="text-md">Show Translation</h1>

        <input
          type="checkbox"
          checked={showTranslation}
          onChange={(e) => setShowTranslation(e.target.checked)}
          id="show-translation"
          name="show-translation"
        />

        <div className="h-4 w-[1px] bg-gray-400" />

        <h1 className="text-md">Text Color</h1>

        <input
          type="color"
          value={textColor}
          onChange={(e) => setTextColor(e.target.value)}
          className="border-2  w-12"
        />
      </div>

      <div className="flex w-full gap-2 items-center">
        <h1 className="text-xl">Gradient Colors</h1>

        <div className="w-16" />

        <input
          type="color"
          value={gradient1Color}
          onChange={(e) => setGradient1Color(e.target.value)}
          className="border-2  w-12"
        />

        <input
          type="color"
          value={gradient2Color}
          onChange={(e) => setGradient2Color(e.target.value)}
          className="border-2  w-12"
        />
      </div>

      <div className="flex w-full gap-2 overflow-x-auto">
        {gradientColors.map((gradient) => (
          <div
            style={{
              aspectRatio: 1,
              width: "100%",
              background: `linear-gradient(to right, ${gradient.start}, ${gradient.end})`,
            }}
            key={gradient.start}
            className={`${
              gradient1Color === gradient.start
                ? "bg-blue-500 hover:bg-blue-700"
                : "bg-gray-400 hover:bg-gray-500"
            } text-white font-bold aspect-square rounded`}
            onClick={() => {
              setGradient1Color(gradient.start);
              setGradient2Color(gradient.end);
            }}
          ></div>
        ))}
      </div>

      <hr className="border-gray-400 w-full" />

      <div
        ref={ref}
        style={{
          aspectRatio: aspectRatioNum,
          width: "100%",
          color: textColor,
          padding: `${padding}px`,
          background: `linear-gradient(to right, ${gradient1Color}, ${gradient2Color})`,
        }}
        className="aspect-square   overflow-clip bg-gradient-to-r from-blue-500 to-blue-700 flex flex-col items-center justify-center"
      >
        {showAyah && (
          <p
            style={{
              fontSize: `${fontSize}px`,
              fontFamily: "indopak",
            }}
            className="text-center"
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

        <p
          style={{
            fontSize: `12px`,
            fontWeight: "bold",
          }}
        >
          {selectedSurah ? `[ ${ayah} ] [ ${selectedSurah.name} ]` : ""}
        </p>
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

function getRandomIntBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomItem<T>(array: T[]) {
  return array[getRandomIntBetween(0, array.length - 1)];
}

export default App;
