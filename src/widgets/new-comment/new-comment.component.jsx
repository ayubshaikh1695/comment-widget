import { memo, useState } from "react";
import PropTypes from "prop-types";
import TextField from "components/text-field/text-field.component";
import Button from "components/button/button.component";
import { randomId } from "utils";
import styles from "./new-comment.module.css";

const NewComment = (props) => {
  const { onAddComment } = props;

  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(false);
  const [commentErrorMessage, setCommentErrorMessage] = useState("");

  // validates if comment string is either empty or not and updates the error state and
  // the error message of the comment field also returning the validation boolean value
  const validateForm = () => {
    let valid = true;

    if (!comment.trim().length) {
      setCommentError(true);
      setCommentErrorMessage("Please type your comment first");
      valid = false;
    } else {
      setCommentError(false);
      setCommentErrorMessage("");
    }

    return valid;
  };

  const generateNewComment = () => {
    const data = {
      id: randomId(),
      type: "comment",
      comment: comment.trim(),
      date: new Date(),
    };
    return data;
  };

  const validateAndAddComment = () => {
    if (comment.trim().length) {
      if (onAddComment) {
        const commentDetails = generateNewComment();
        onAddComment(commentDetails);
        setComment("");
      }
    } else {
      validateForm();
    }
  };

  const handleInput = (e) => {
    const value = e.target.value;
    setComment(value);
    if (commentError && value.length) {
      setCommentError(false);
      setCommentErrorMessage("");
    }
  };

  const handleKeyUp = (e) => {
    if (e.key === "Enter") {
      validateAndAddComment();
    }
  };

  const handleButtonClick = () => {
    validateAndAddComment();
  };

  return (
    <div className={styles.wrapper}>
      <TextField
        placeholder="Enter a comment"
        value={comment}
        error={commentError}
        errorMessage={commentErrorMessage}
        autoFocus
        onChange={handleInput}
        onKeyUp={handleKeyUp}
      />
      <Button
        label="Add Comment"
        variant="primary"
        onClick={handleButtonClick}
      />
    </div>
  );
};

NewComment.propTypes = {
  onAddComment: PropTypes.func,
};

export default memo(NewComment);
