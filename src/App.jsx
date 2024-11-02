import { useState } from "react";
import "./App.css";

function App() {
  const [emails, setEmails] = useState([]);

  const handleScrapeEmails = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.scripting.executeScript(
          {
            target: { tabId: tabs[0].id },
            function: findEmailsInPage,
          },
          (results) => {
            if (results && results[0]?.result) {
              setEmails(results[0].result);
            } else {
              console.error("No response or emails found.");
            }
          }
        );
      }
    });
  };

  return (
    <div>
      <button onClick={handleScrapeEmails}>Scrape Emails</button>
      <ul>
        {emails.map((email, index) => (
          <li key={index}>{email}</li>
        ))}
      </ul>
    </div>
  );
}

// Function to be injected into the page to find emails
function findEmailsInPage() {
  const emails = new Set();
  const regex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/gi;
  document.body.innerText.match(regex)?.forEach((email) => emails.add(email));
  return Array.from(emails); // Return unique emails as an array
}

export default App;
