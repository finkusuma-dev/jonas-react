import { useState } from "react";
import PropTypes from 'prop-types';

// const containerStyle = {
//   display: "flex",
//   flexDirection: "column",  
//   gap: "16px",
//   borderRadius: "5px",
//   border: "1px solid #aaa",
//   padding: "10px",
//   backgroundColor: "#e0e0e0",
// };

const containerStyle = {
  display: "flex",
  gap: "16px",
  alignItems: "center"
  // border: '1px solid red'
};

const starsStyle = {
  display: "flex",
};

export default StarRating;

StarRating.propTypes = {
  maxRating: PropTypes.number,
  size: PropTypes.number,
  color: PropTypes.string,  
  className: PropTypes.string,
  messages: PropTypes.array,
  defaultRating: PropTypes.number,
  onSetRating: PropTypes.func
}

function StarRating({
  maxRating = 5,
  size = 48,
  color = "orange",  
  className = "",
  messages = [],
  defaultRating = 0,
  onSetRating,
}) {
  const [rating, setRating] = useState(defaultRating);
  const [tmpRating, setTmpRating] = useState(0);

  const textStyle = {
    lineHeight: 1,
    fontSize: `${size / 1.5}px`,
    color: color,
  };


  // console.log("tmpRating", tmpRating);
  // console.log("rating", rating);

  function handleRate(rating) {
    setRating(rating);
    onSetRating && onSetRating(rating);
  }

  return (    
      <div style={containerStyle} className={className}>
        <div style={starsStyle}>
          {Array.from({ length: maxRating }, (_, i) => (
            <Star
              key={i}
              size={size}
              color={color}
              fullStar={tmpRating ? i <= tmpRating - 1 : i <= rating - 1}
              onRate={() => handleRate(i + 1)}
              onHoverIn={() => setTmpRating(i + 1)}
              onHoverOut={() => setTmpRating(0)}
            />
          ))}
        </div>
        <div style={textStyle}>{
          messages.length === maxRating && (tmpRating > 0 || rating > 0)
          ? messages[tmpRating > 0 ? tmpRating - 1 : rating - 1] 
          : tmpRating || rating || ""}
        </div>
      </div>
  );
}

const starStyle = {
  width: "48px",
  height: "48px",
  cursor: "pointer",
  display: "block",
};

Star.propTypes = {
  onRate: PropTypes.func,
  onHoverIn: PropTypes.func,
  onHoverOut: PropTypes.func,
  size: PropTypes.string,
  fullStar: PropTypes.bool,
  color: PropTypes.string
}

function Star({
  onRate,
  onHoverIn,
  onHoverOut,
  size = "48px",
  fullStar = false,
  color,
}) {
  
  return (
    <div
      role="button"
      style={{ ...starStyle, width: size, height: size }}
      onClick={onRate}
      onMouseEnter={onHoverIn}
      onMouseLeave={onHoverOut}
    >
      {fullStar ? (
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill={color}
            stroke={color}
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </span>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke={color}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="{2}"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      )}
    </div>
  );
}

const buttonStyle = {
  // width: '260px',
  padding: "7px 0",
  borderRadius: "30px",
  border: "1px solid gray",
};

function ButtonAdd() {
  return <button style={buttonStyle}>Add to List</button>;
}
