"use client";
import { Search } from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { useRouter } from "next/router";
interface SearchResult {
  query: string;
  response: string;
}

const ChatbotModal: React.FC = () => {
  const { onOpen, isOpen, onClose, type } = useModal();
  const [inputText, setInputText] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [currentQuery, setCurrentQuery] = useState<string | null>(null);

  const isModalOpen = isOpen && type === "chatbot";
  const debouncedInput = useDebounce(inputText, 300); // Debounce input text

  const url = `http://rohanphulari2.pythonanywhere.com/data/?query=${debouncedInput}`;

  const search = useMemo(() => {
    return () => {
      if (!debouncedInput) return; // Check for empty input
      fetch(url)
        .then((resp) => {
          if (!resp.ok) throw new Error("was not a valid url");

          return resp.json();
        })
        .then((data) => {
          setSearchResults((prevResults) => [
            ...prevResults,
            { query: debouncedInput, response: data.Response },
          ]); // Append new search result to searchResults array
          setCurrentQuery(debouncedInput); // Set current query
        })
        .catch((err) => {
          console.log(err.message);
        });
      setInputText("");
    };
  }, [debouncedInput, url]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      search();
    }
  };

  const setInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  console.log(inputText);

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="dark:bg-neutral-950 dark:text-white flex justify-center items-center flex-col ">
        <DialogTitle className="dark:bg-neutral-950 text-center ">
          Chat with Chatbot
        </DialogTitle>
        <div className="lg:w-[68vw] w-[90vw] relative h-[80vh] dark:bg-neutral-950 flex flex-col items-center justify-between p-4 gap-5">
          <div className=" w-full h-full dark:bg-neutral-800 bg-gray-100 rounded-lg p-4 text-justify overflow-y-auto overflow-x-hidden">
            <div className="w-[70vw] h-10 flex items-center mb-2"></div>
            {/* Render each character of the data */}
            <div className=" flex flex-col gap-4 ">
              {searchResults.map((result, index) => (
                <div key={index} className="flex flex-col gap-2 justify-center">
                  <span className="text-gray-300">{result.query}</span>
                  <div className="text-gray-200 mb-2 p-4 rounded-lg  bg-neutral-950 ">
                    <div>{result.response}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full h-10 flex rounded-lg overflow-hidden">
            <input
              type="text"
              placeholder="Message here"
              className="w-full  dark:bg-neutral-700 bg-gray-100 p-4 text-gray-300 outline-none focus:outline-none"
              value={inputText}
              onChange={(e) => setInput(e)}
              onKeyDown={handleKeyPress}
            />

            <button
              className="dark:bg-neutral-700 bg-orange-500 p-2"
              onClick={search}
            >
              <Search className=" text-white " />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Custom hook for debouncing input
const useDebounce = <T extends any>(value: T, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default ChatbotModal;
