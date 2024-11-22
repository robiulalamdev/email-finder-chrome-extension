/* eslint-disable react/prop-types */
import { useState } from "react";
import "./App.css";
import { I_CopyButton, I_CopyTick, iSpinner } from "./lib/icons";

function App() {
  const [emails, setEmails] = useState([
    // "robiulalamdev@gmail.com",
    // "robiulalamdev@gmail.com",
    // "robiulalamdev@gmail.com",
    // "robiulalamdev@gmail.com",
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const handleScrapeEmails = async () => {
    try {
      setIsLoading(true);
      let [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      const response = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          const emailRegex = /\b[\w.-]+@[\w.-]+\.[A-Za-z]{2,}\b/g;
          const emailsScrapped = document.body.innerHTML.match(emailRegex);
          return emailsScrapped;
        },
      });

      if (response?.length > 0 && response[0]?.result) {
        if (response[0]?.result?.length > 0) {
          setEmails([...response[0].result]);
        }
      }
    } catch (error) {
      setIsLoading(false);
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="w-[450px] h-fit py-6 px-6 bg-white rounded-lg shadow-md mx-auto">
      <div className="w-full h-[400px] max-h-[400px] bg-gray-50 mt-4 rounded-lg shadow-inner p-[20px]">
        <div className="w-full h-full overflow-y-auto">
          {isLoading && (
            <ul className="bg-white rounded-lg shadow-md divide-y divide-gray-200 animate-pulse">
              <EmailLoader />
              <EmailLoader />
              <EmailLoader />
              <EmailLoader />
              <EmailLoader />
              <EmailLoader />
              <EmailLoader />
            </ul>
          )}

          {!isLoading && (
            <ul className="bg-white rounded-lg shadow-md divide-y divide-gray-200">
              {emails.map((email, index) => (
                <SingleEmail key={index} email={email} />
              ))}
            </ul>
          )}

          {!isLoading && emails.length === 0 && (
            <div className="flex justify-center items-center w-full h-full">
              <h1 className="text-black text-[16px] font-medium">No data</h1>
            </div>
          )}
        </div>
      </div>
      <div className="mt-[20px]">
        <button
          disabled={isLoading}
          onClick={() => handleScrapeEmails()}
          className="w-full py-2 px-4 mb-4 text-white bg-blue-600 hover:bg-blue-700 font-semibold rounded-md shadow transition duration-200 flex justify-center items-center gap-2"
        >
          {isLoading && (
            <div className="max-w-[20px] max-h-[20px] flex justify-center items-center">
              {iSpinner}
            </div>
          )}
          Scrape Emails
        </button>
      </div>
    </div>
  );
}

const EmailLoader = () => {
  return (
    <li className="flex items-center justify-between px-4 py-3">
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-6 bg-gray-200 rounded w-16"></div>
    </li>
  );
};

const SingleEmail = ({ email = "" }) => {
  const [copied, setCopied] = useState(false);

  const copyTextToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };
  return (
    <li className="flex items-center justify-between px-4 py-3 hover:bg-gray-100 transition duration-150">
      <span className="flex-grow w-full text-black oneLine">{email}</span>
      {copied ? (
        <button className="text-green-500 w-[14px] h-[14px] flex justify-center items-center">
          {I_CopyTick}
        </button>
      ) : (
        <button
          onClick={() => copyTextToClipboard(email)}
          className="w-[14px] h-[14px] flex justify-center items-center text-black"
        >
          {I_CopyButton}
        </button>
      )}
    </li>
  );
};

export default App;
