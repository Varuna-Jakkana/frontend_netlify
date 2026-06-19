import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import i18n from "i18next";
//import soilImg from "./assets/imm.jpeg";
const cropTranslationKeys = {
  Barley: "barley",
  Cotton: "cotton",
  "Ground Nuts": "ground_nuts",
  Maize: "maize",
  Millets: "millets",
  "Oil seeds": "oil_seeds",
  Paddy: "paddy",
  Pulses: "pulses",
  Sugarcane: "sugarcane",
  Tobacco: "tobacco",
  Wheat: "wheat",
  Jowar: "jowar",
  Bajra: "bajra",
  Gram: "gram",
  Soyabean: "soyabean",
  Sunflower: "sunflower",
  Safflower: "safflower",
  Linseed: "linseed",
  "Castor seed": "castor_seed",
  Coriander: "coriander",
  Ragi: "ragi",
  Arhar: "arhar",
  Urad: "urad",
  Moong: "moong",
  Horsegram: "horsegram",
  Cowpea: "cowpea",
  Sesamum: "sesamum",
  "Niger seed": "niger_seed",
  "Sweet potato": "sweet_potato",
  Tapioca: "tapioca",
  Moth: "moth",
  "Guar seed": "guar_seed",
  Coconut: "coconut",
  Cashewnut: "cashewnut",
  Masoor: "masoor",
  "Peas & beans": "peas_beans",
  Potato: "potato",
  Onion: "onion",
  Garlic: "garlic",
  Ginger: "ginger",
  Turmeric: "turmeric",
  Banana: "banana",
  Rapeseed: "rapeseed",
  Jute: "jute",
  Arecanut: "arecanut",
};
function App() {
  const [error, setError] = useState("");
  const { t } = useTranslation();
  const [page, setPage] = useState("home");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!result) return;

    const soilName = t(result.soil.toLowerCase());
    
    const cropNames = result.crops
      .map((c) => {
        const key = cropTranslationKeys[c.name];
        return key ? t(key) : c.crop;
      })
      .join(", ");
    let text = "";
    let lang = "en-IN";

    switch (i18n.language) {
      case "te":
        lang = "te-IN";
        text = `మీ నేల రకం ${soilName}. సిఫారసు చేసిన పంటలు ${cropNames}.`;
        break;

      case "hi":
        lang = "hi-IN";
        text = `आपकी मिट्टी का प्रकार ${soilName} है। अनुशंसित फसलें ${cropNames} हैं।`;
        break;

      case "ta":
        lang = "ta-IN";
        text = `உங்கள் மண் வகை ${soilName}. பரிந்துரைக்கப்படும் பயிர்கள் ${cropNames}.`;
        break;

      case "mr":
        lang = "mr-IN";
        text = `तुमच्या मातीचा प्रकार ${soilName}. शिफारस केलेली पिके ${cropNames}.`;
        break;

      case "pa":
        lang = "pa-IN";
        text = `ਤੁਹਾਡੀ ਮਿੱਟੀ ਦੀ ਕਿਸਮ ${soilName} ਹੈ। ਸਿਫਾਰਸ਼ ਕੀਤੀਆਂ ਫਸਲਾਂ ${cropNames}.`;
        break;

      default:
        lang = "en-IN";
        text = `Your soil type is ${soilName}. Recommended crops are ${cropNames}.`;
    }

    const speech = new SpeechSynthesisUtterance(text);

    speech.lang = lang;
    speech.rate = 1;
    speech.pitch = 1;
    speech.volume = 1;

    window.speechSynthesis.cancel();
    

    const voices = window.speechSynthesis.getVoices();

    console.log("Available voices:");
    voices.forEach((voice) => {
      console.log(voice.name, voice.lang);
    });
    const selectedVoice =
      voices.find((v) => v.lang.includes(lang)) ||
      voices.find((v) => v.lang.startsWith(i18n.language));

    if (selectedVoice) {
      speech.voice = selectedVoice;
    }

    window.speechSynthesis.speak(speech);
  }, [result, t]);

  // BACKEND CONNECTION
  const handleDetect = async () => {
    setError("");
    if (!image) {
      alert("Please upload image");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const formData = new FormData();
        formData.append("image", image);
        formData.append("lat", lat);
        formData.append("lon", lon);
        try {
          const res = await fetch("https://varuna9-backend.hf.space/predict", {
            method: "POST",
            body: formData,
          });
          const data = await res.json();
          if (!res.ok || data.error) {
            setError(data.error || "Error");
            return;
          }
          setResult({
            soil: data.soil,
            crops: data.crops.map((c) => ({
              name: c.crop,
            })),
          });
        } catch (error) {
          setError("Network Error");
        }
      },
      (error) => {
        setError("Please allow location access");
      },
    );
  };
  return (
    <div className="bg-[#f5f3ef] text-gray-900 min-h-screen">
      {/* NAVBAR */}
      <div className="flex flex-col md:flex-row justify-between items-center px-4 md:px-8 py-4 bg-white shadow-sm gap-3 md:gap-0">
        <h1 className="text-xl font-bold text-center md:text-left leading-tight">
          🌾 {t("titleApp")}
        </h1>

        <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm">
          <span
            className="cursor-pointer hover:text-green-700"
            onClick={() => setPage("home")}
          >
            {t("home")}
          </span>
          <span
            className="cursor-pointer hover:text-green-700"
            onClick={() => setPage("analyze")}
          >
            {t("analyze")}
          </span>

          <span
            className="cursor-pointer hover:text-green-700"
            onClick={() => setPage("help")}
          >
            {t("help.title")}
          </span>

          <span
            className="cursor-pointer hover:text-green-700"
            onClick={() => setPage("about")}
          >
            {t("about.title")}
          </span>
        </div>

        {/* LANGUAGE */}
        <div className="mt-2 md:mt-0">
          <select
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            <option value="en">EN</option>
            <option value="te">తెలుగు</option>
            <option value="hi">हिंदी</option>
            <option value="ta">தமிழ்</option>
            <option value="mr">मराठी</option>
            <option value="pa">ਪੰਜਾਬੀ</option>
          </select>
        </div>
      </div>

      {/* ================= HERO ================= */}
      {page === "home" && (
        <div className="relative h-[90vh] flex items-center justify-center text-center">
          <img
            src="https://images.unsplash.com/photo-1605000797499-95a51c5269ae"
            alt="farm"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/40"></div>

          <div className="relative z-10 text-white px-6">
            <h1 className="text-6xl md:text-7xl font-bold mb-4">
              {t("titleApp")} <span className="text-green-400">AI</span>
            </h1>

            <p className="text-xl md:text-2xl mb-4">{t("title")}</p>

            <p className="text-gray-200 mb-8">{t("subtitle")}</p>
            <div className="flex justify-center gap-4 flex-wrap">
              {/* Upload Button */}
              <button
                onClick={() => {
                  setPage("analyze");
                }}
                className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-full text-lg"
              >
                {t("upload")}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* HELP PAGE */}
      {/* HELP PAGE */}
      {page === "help" && (
        <div className="bg-[#f6f8f5] min-h-screen px-4 py-10">
          {/* HEADER */}
          <div className="text-center mb-10">
            <div className="w-14 h-14 bg-green-700 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
              ?
            </div>

            <h1 className="text-4xl font-bold">{t("help.title")}</h1>
          </div>

          {/* STEPS */}
          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              <div className="border rounded-xl bg-white p-4 flex items-center gap-4">
                <div className="text-green-700 font-bold">
                  {t("help.step1")}
                </div>
                <div>{t("help.step1")}</div>
              </div>

              <div className="border rounded-xl bg-white p-4 flex items-center gap-4">
                <div className="text-green-700 font-bold">
                  {t("help.step2")}
                </div>
                <div>{t("help.step2")}</div>
              </div>

              <div className="border rounded-xl bg-white p-4 flex items-center gap-4">
                <div className="text-green-700 font-bold">
                  {t("help.step3")}
                </div>
                <div>{t("help.step3")}</div>
              </div>

              <div className="border rounded-xl bg-white p-4 flex items-center gap-4">
                <div className="text-green-700 font-bold">
                  {t("help.step4")}
                </div>
                <div>{t("help.step4")}</div>
              </div>

              <div className="border rounded-xl bg-white p-4 flex items-center gap-4">
                <div className="text-green-700 font-bold">
                  {t("help.step5")}
                </div>
                <div>{t("help.step5")}</div>
              </div>
            </div>

            {/* SOIL TYPES */}
            <div className="bg-white border rounded-2xl p-6 mt-10">
              <h2 className="font-bold text-lg mb-4">{t("help.soilsTitle")}</h2>

              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-2 bg-green-100 rounded-full text-sm">
                  {t("black")}
                </span>

                <span className="px-4 py-2 bg-green-100 rounded-full text-sm">
                  {t("clay")}
                </span>

                <span className="px-4 py-2 bg-green-100 rounded-full text-sm">
                  {t("loamy")}
                </span>

                <span className="px-4 py-2 bg-green-100 rounded-full text-sm">
                  {t("red")}
                </span>

                <span className="px-4 py-2 bg-green-100 rounded-full text-sm">
                  {t("sandy")}
                </span>
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-white border rounded-2xl p-6 mt-10">
              <h2 className="font-bold text-lg mb-6">{t("help.faqTitle")}</h2>

              <details className="border-b py-4">
                <summary className="cursor-pointer font-medium">
                  {t("help.faq1")}
                </summary>
                <p className="mt-2 text-gray-600">{t("help.faq1Answer")}</p>
              </details>

              <details className="border-b py-4">
                <summary className="cursor-pointer font-medium">
                  {t("help.faq2")}
                </summary>
                <p className="mt-2 text-gray-600">{t("help.faq2Answer")}</p>
              </details>

              <details className="border-b py-4">
                <summary className="cursor-pointer font-medium">
                  {t("help.faq3")}
                </summary>
                <p className="mt-2 text-gray-600">{t("help.faq3Answer")}</p>
              </details>

              <details className="py-4">
                <summary className="cursor-pointer font-medium">
                  {t("help.faq4")}
                </summary>
                <p className="mt-2 text-gray-600">{t("help.faq4Answer")}</p>
              </details>
            </div>
          </div>
        </div>
      )}

      {/* ================= UPLOAD ================= */}
      {page === "analyze" && (
        <div
          id="uploadSection"
          className="bg-white mx-8 p-8 rounded-2xl shadow-lg"
        >
          <h2 className="text-3xl font-bold text-center mb-6">
            {t("analyzeSoil")}
          </h2>
          {error && (
            <p className="text-red-600 text-center mb-4 font-semibold">
              {error}
            </p>
          )}
          <div
            className="border-2 border-dashed border-green-600 p-10 text-center rounded-xl cursor-pointer hover:bg-green-50 transition"
            onClick={() => document.getElementById("fileInput").click()}
          >
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setImage(file);
                  setPreview(URL.createObjectURL(file));
                }
              }}
            />

            {preview ? (
              <img
                src={preview}
                alt="preview"
                className="mx-auto rounded-xl max-h-60"
              />
            ) : (
              <div className="flex flex-col items-center text-gray-600">
                <span className="text-4xl mb-2">📷</span>
                <p>{t("clickPhoto")}</p>
              </div>
            )}
          </div>

          <button
            onClick={handleDetect}
            className="w-full mt-6 bg-green-700 text-white py-4 rounded-xl text-lg hover:bg-green-800 transition"
          >
            {t("detect")}
          </button>
        </div>
      )}

      {/* RESULTS */}
      {page === "analyze" && result && (
        <div className="px-8 py-12">
          <h2 className="text-4xl font-bold text-center mb-8">{t("report")}</h2>

          <div className="max-w-md mx-auto mb-10">
            <div className="bg-white p-6 rounded-xl shadow text-center">
              <h3>{t("soil")}</h3>
              <p className="text-2xl font-bold">
                {t(result.soil.toLowerCase(), result.soil)}
              </p>
            </div>
          </div>

          <h3 className="text-2xl font-bold mb-6 text-center">
            🌾 {t("crops")}
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            {result.crops.map((c, i) => (
              <div
                key={i}
                className="bg-[#e9e3d9] rounded-2xl p-6 shadow-sm relative hover:shadow-md transition"
              >
                <h3 className="text-xl font-bold mb-2">
                  {t(c.name.toLowerCase().replace(/ /g, "_"), c.name)}
                </h3>
                <p>{t("cropDesc")}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ABOUT PAGE */}
      {page === "about" && (
        <div className="bg-[#f6f8f5] min-h-screen px-6 py-12">
          {/* ICON */}
          <div className="flex justify-center mb-4">
            <h1 className="flex items-center gap-3 border rounded-xl p-4 bg-[#f8fbf8] text-5xl">
              🌾
            </h1>
          </div>

          {/* TITLE */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-green-900 mb-3">
              {t("about.title")}
            </h1>

            <p className="text-gray-600 max-w-2xl mx-auto text-sm">
              {t("about.intro")}
            </p>
          </div>

          {/* FEATURES CARD */}
          <div className="max-w-4xl mx-auto bg-white border rounded-3xl p-8 shadow-sm">
            <h2 className="font-bold text-lg mb-6">
              {t("about.featuresTitle")}
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 border rounded-xl p-4 bg-[#f8fbf8]">
                <span className="text-green-700">🌱</span>
                <span>{t("about.f1")}</span>
              </div>

              <div className="flex items-center gap-3 border rounded-xl p-4 bg-[#f8fbf8]">
                <span className="text-green-700">☁️</span>
                <span>{t("about.f2")}</span>
              </div>

              <div className="flex items-center gap-3 border rounded-xl p-4 bg-[#f8fbf8]">
                <span className="text-green-700">🤖</span>
                <span>{t("about.f3")}</span>
              </div>

              <div className="flex items-center gap-3 border rounded-xl p-4 bg-[#f8fbf8]">
                <span className="text-green-700">🌐</span>
                <span>{t("about.f4")}</span>
              </div>

              <div className="flex items-center gap-3 border rounded-xl p-4 bg-[#f8fbf8]">
                <span className="text-green-700">📱</span>
                <span>{t("about.f5")}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default App;
