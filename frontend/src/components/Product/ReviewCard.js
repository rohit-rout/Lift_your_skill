import { Rating } from "@material-ui/lab";
import React from "react";
import profilePng from "../../images/Profile.png";

const ReviewCard = (props) => {
  const options = {
    value: props.review.rating,
    readOnly: true,
    precision: 0.5,
  };

  return (
    <div className="reviewCard">
      <img src={profilePng} alt="User" />
      <p>{props.review.name}</p>
      <Rating {...options} />
      <span className="reviewCardComment">{props.review.comment}</span>
    </div>
  );
};

export default ReviewCard;