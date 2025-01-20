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

    if (showFullText) {
      return `${processedText}<span class="toggle-text" style="cursor: pointer; color: blue;"> Show less</span>`;
    }

    const truncatedText = processedText.slice(0, size);
    return `${truncatedText}<span class="toggle-text" style="cursor: pointer; color: blue;">...Read more</span>`;
  };

  const handleTextClick = (e) => {
    // Check if the clicked element has the `toggle-text` class
    if (e.target.classList.contains("toggle-text")) {
      toggleText();
    }
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation(); // Prevent propagation to parent
        handleTextClick(e); // Call the function
      }}
    >
      <div
        className="card-text fs-6"
        dangerouslySetInnerHTML={{
          __html: renderText(post),
        }}
      ></div>
    </div>
  );
};

export default PostCard;
