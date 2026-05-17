import { useCallback, useMemo, useRef, useState } from "react";

export const useVoiceInput = ({ onResult } = {}) => {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState("");
  const recognitionRef = useRef(null);

  const supported = useMemo(
    () => typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window),
    []
  );

  const start = useCallback(() => {
    if (!supported) {
      setError("Voice input is not supported in this browser.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setError("");
      setListening(true);
    };
    recognition.onerror = (event) => {
      setError(event.error || "Voice recognition failed.");
      setListening(false);
    };
    recognition.onend = () => setListening(false);
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0]?.transcript)
        .filter(Boolean)
        .join(" ");
      onResult?.(transcript);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [onResult, supported]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  return { supported, listening, error, start, stop };
};
