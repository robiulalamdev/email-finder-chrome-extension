import { useState } from "react";
import "./App.css";

function App() {
  const [emails, setEmails] = useState([]);

  const handleScrapeEmails = async () => {
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
  };

  return (
    <div className="w-[400px] h-fit py-6 px-6 bg-white rounded-lg shadow-md">
      <button
        onClick={() => handleScrapeEmails()}
        className="w-full py-2 px-4 mb-4 text-white bg-blue-600 hover:bg-blue-700 font-semibold rounded-md shadow transition duration-200"
      >
        Scrape Emails
      </button>
      <div className="flex justify-center items-center w-full overflow-y-auto h-[400px] max-h-[400px] bg-gray-50 mt-4 rounded-lg shadow-inner">
        <div className="w-full max-w-lg p-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            Email List
          </h2>
          <ul className="bg-white rounded-lg shadow-md divide-y divide-gray-200">
            {emails.map((email, index) => (
              <li
                key={index}
                className="flex items-center justify-between px-4 py-3 hover:bg-gray-100 transition duration-150"
              >
                <span className="text-gray-700">{email}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
