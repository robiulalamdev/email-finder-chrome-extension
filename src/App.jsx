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
    <div className="w-[400px] h-fit py-[32px] px-[32px] bg-white">
      <button onClick={() => handleScrapeEmails()}>Scrape Emails</button>
      <div className="flex justify-center items-center w-full overflow-y-auto h-[400px] max-h-[400px] bg-gray-100 mt-[32px]">
        <div className="w-full max-w-lg p-4">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Email List
          </h2>
          <ul className="bg-white shadow-lg rounded-lg">
            {emails.map((email, index) => (
              <li
                key={index}
                className="flex items-center justify-between px-4 py-3 border-b border-gray-200 last:border-b-0"
              >
                <span className="text-gray-600">{email}</span>
                <button className="text-blue-500 hover:text-blue-700 font-medium">
                  Details
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
