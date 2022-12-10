import { memo, useState } from "react";
import PropTypes from "prop-types";
import Typography from "components/typography/typography.component";
import Button from "components/button/button.component";
import TextField from "components/text-field/text-field.component";
import { getFormattedDateAndTime, randomId } from "utils";
import styles from "./comment.module.css";

const Comment = (props) => {
  const { replies, commentDetails, onUpdate, onDelete, onAddReply } = props;

  const [isEditing, setIsEditing] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [disabledActions, setDisabledActions] = useState({
    edit: false,
    delete: false,
    reply: false,
  });
  const [reply, setReply] = useState("");
  const [replyError, setReplyError] = useState(false);
  const [replyErrorMessage, setReplyErrorMessage] = useState("");

  const reset = () => {
    setIsEditing(false);
    setShowInput(false);
    setDisabledActions({ edit: false, delete: false, reply: false });
    setReply("");
    setReplyError(false);
    setReplyErrorMessage("");
  };

  // validates if reply string is either empty or not and updates the error state and
  // the error message of the reply field also returning the validation boolean value
  const validateForm = () => {
    let valid = true;

    if (!reply.trim().length) {
      setReplyError(true);
      setReplyErrorMessage("Please type your reply first");
      valid = false;
    } else {
      setReplyError(false);
      setReplyErrorMessage("");
    }

    return valid;
  };

  const generateNewReply = () => {
    const data = {
      id: randomId(),
      parentId: commentDetails.id,
      type: "reply",
      comment: reply.trim(),
      date: new Date(),
    };
    return data;
  };

  const validateAndUpdateComment = () => {
    if (reply.trim().length) {
      if (onUpdate) {
        const updatedComment = { ...commentDetails, comment: reply.trim() };
        onUpdate(updatedComment);
        reset();
      }
    } else {
      validateForm();
    }
  };

  const validateAndAddReply = () => {
    if (reply.trim().length) {
      if (onAddReply) {
        const replyDetails = generateNewReply();
        onAddReply(replyDetails);
        reset();
      }
    } else {
      validateForm();
    }
  };

  const handleEdit = () => {
    setDisabledActions({ edit: true, delete: true, reply: true });
    setReply(commentDetails.comment);
    setIsEditing(true);
    setShowInput(true);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(commentDetails.id);
    }
  };

  const handleReply = () => {
    setDisabledActions({ edit: true, delete: true, reply: true });
    setShowInput(true);
  };

  const handleInput = (e) => {
    const value = e.target.value;
    setReply(value);
    if (replyError && value.length) {
      setReplyError(false);
      setReplyErrorMessage("");
    }
  };

  const handleKeyUp = (e) => {
    if (e.key === "Enter") {
      if (isEditing) {
        validateAndUpdateComment();
      } else {
        validateAndAddReply();
      }
    }
  };

  const handleSave = () => {
    if (isEditing) {
      validateAndUpdateComment();
    } else {
      validateAndAddReply();
    }
  };

  const handleCancel = () => {
    reset();
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.flexWrap}>
        <div className={styles.textContent}>
          <Typography variant="body2">{commentDetails.comment}</Typography>
          <Typography variant="caption-text" cssClass={styles.dateText}>
            {getFormattedDateAndTime(commentDetails.date)}
          </Typography>
        </div>
        <div className={styles.actionsContainer}>
          <Button
            label="Edit"
            size="small"
            outlined
            disabled={disabledActions.edit}
            onClick={handleEdit}
          />
          <Button
            label="Delete"
            variant="secondary"
            size="small"
            outlined
            disabled={disabledActions.delete}
            onClick={handleDelete}
          />
          <Button
            label="Reply"
            variant="primary"
            size="small"
            outlined
            disabled={disabledActions.reply}
            onClick={handleReply}
          />
        </div>
      </div>
      {showInput && (
        <div>
          <div className={styles.textFieldContainer}>
            <TextField
              placeholder="Enter your reply"
              value={reply}
              error={replyError}
              errorMessage={replyErrorMessage}
              autoFocus
              onChange={handleInput}
              onKeyUp={handleKeyUp}
            />
          </div>
          <div className={styles.actionsContainer}>
            <Button
              label="Save"
              variant="primary"
              size="small"
              onClick={handleSave}
            />
            <Button
              label="Cancel"
              variant="secondary"
              size="small"
              outlined
              onClick={handleCancel}
            />
          </div>
        </div>
      )}
      {commentDetails?.replyIds?.length > 0 && (
        <ul>
          {commentDetails.replyIds.map((replyId) =>
            replies[replyId] ? (
              <li key={replyId} className={styles.listItem}>
                <Comment
                  replies={replies}
                  commentDetails={replies[replyId]}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                  onAddReply={onAddReply}
                />
              </li>
            ) : null
          )}
        </ul>
      )}
    </div>
  );
};

Comment.propTypes = {
  replies: PropTypes.any,
  commentDetails: PropTypes.any,
  onUpdate: PropTypes.func,
  onDelete: PropTypes.func,
  onAddReply: PropTypes.func,
};

export default memo(Comment);
