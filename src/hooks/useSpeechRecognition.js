import { useCallback, useEffect, useRef, useState } from "react";

// Wraps the browser's SpeechRecognition API (Chrome/Edge; Safari partial support).
// Falls back gracefully — `supported` tells the UI whether to show mic-based features.

const SpeechRecognitionAPI =
  typeof window !== "undefined"
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;

export function useSpeechRecognition() {
  const [supported] = useState(!!SpeechRecognitionAPI);
  const [listening, setListening] = useState(false);
  const [finalTranscript, setFinalTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [error, setError] = useState(null);

  const recognitionRef = useRef(null);
  const finalRef = useRef("");
  const shouldRestartRef = useRef(false);

  useEffect(() => {
    if (!SpeechRecognitionAPI) return undefined;

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalRef.current += transcript + " ";
        } else {
          interim += transcript;
        }
      }
      setFinalTranscript(finalRef.current);
      setInterimTranscript(interim);
    };

    recognition.onerror = (event) => {
      // "no-speech" fires often during natural pauses — not a real error.
      if (event.error !== "no-speech") {
        setError(event.error);
      }
    };

    recognition.onend = () => {
      // Some browsers auto-stop after silence; restart seamlessly if the
      // user hasn't intentionally ended the session yet.
      if (shouldRestartRef.current) {
        try {
          recognition.start();
        } catch {
          /* already started */
        }
      } else {
        setListening(false);
      }
    };

    recognitionRef.current = recognition;
    return () => {
      shouldRestartRef.current = false;
      recognition.stop();
    };
  }, []);

  const start = useCallback(() => {
    if (!recognitionRef.current) return;
    finalRef.current = "";
    setFinalTranscript("");
    setInterimTranscript("");
    setError(null);
    shouldRestartRef.current = true;
    try {
      recognitionRef.current.start();
      setListening(true);
    } catch {
      /* already running */
    }
  }, []);

  const stop = useCallback(() => {
    if (!recognitionRef.current) return;
    shouldRestartRef.current = false;
    recognitionRef.current.stop();
    setListening(false);
  }, []);

  const reset = useCallback(() => {
    finalRef.current = "";
    setFinalTranscript("");
    setInterimTranscript("");
  }, []);

  return {
    supported,
    listening,
    finalTranscript,
    interimTranscript,
    fullTranscript: (finalTranscript + " " + interimTranscript).trim(),
    error,
    start,
    stop,
    reset,
  };
}
