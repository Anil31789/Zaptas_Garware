import React, { useState } from "react";

const PostCard = ({ post, size = 108 }) => {
  const [showFullText, setShowFullText] = useState(false);

  const toggleText = () => {
    setShowFullText((prev) => !prev);
  };

  const renderText = (text) => {
    if (!text) return null;

    const processedText = text
      .replace(/{hashtag\|\\#\|/g, "#") // Replace starting hashtag syntax
      .replace(/}/g, "") // Remove closing syntax
      .replace(/#(\w+)/g, '<span style="color:blue;">#$1</span>') // Make hashtags blue
      .replace(/(\r\n|\n|\r)/gm, "<br>"); // Replace line breaks with HTML <br> tags for proper rendering

    const truncatedText = processedText.slice(0, size); // Truncated text based on size

    // If the text is already smaller than or equal to the size, no need for "Read more"
    if (processedText.length <= size) {
      return processedText;
    }

    if (showFullText) {
      return `${processedText}<span class="toggle-text" style="cursor: pointer; color: blue;"> Show less</span>`;
    }

    return `${truncatedText}<span class="toggle-text" style="cursor: pointer; color: blue;">...Read more</span>`;
  };

  const handleTextClick = (e) => {
    // Check if the clicked element has the `toggle-text` class
    if (e.target.classList.contains("toggle-text")) {
      e.stopPropagation(); // Prevent event propagation when clicking on "Read more" or "Show less"
      toggleText();
    }
  };

  return (
    <div
      onClick={(e) => {
        // Only stop propagation if the target is "Read more" or "Show less"
        handleTextClick(e); // Call the function
      }}
    >
      <div
        className="card-text"
        style={{
          fontWeight:"500",
          // textAlign: "justify", // Align text to both left and right
          wordWrap: "break-word",
          fontSize:'13px' // Ensure long words break properly
        }}
        dangerouslySetInnerHTML={{
          __html: renderText(post),
        }}
      ></div>
    </div>
  );
};

export default PostCard;
