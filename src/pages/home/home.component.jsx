import { useMemo, useState, useEffect } from "react";
import Typography from "components/typography/typography.component";
import NewComment from "widgets/new-comment/new-comment.component";
import Button from "components/button/button.component";
import Comment from "widgets/comment/comment.component";
import {
  getFromLocalStorage,
  isObjectEmpty,
  saveToLocalStorage,
  sortCommentsByRecentDate,
} from "utils";
import styles from "./home.module.css";

const Home = () => {
  const [comments, setComments] = useState({});
  const [replies, setReplies] = useState({});

  useEffect(() => {
    const persistedComments = getFromLocalStorage("comments");
    const persistedReplies = getFromLocalStorage("replies");

    if (!isObjectEmpty(persistedComments)) {
      setComments(persistedComments);
    }
    if (!isObjectEmpty(persistedReplies)) {
      setReplies(persistedReplies);
    }
  }, []);

  useEffect(() => {
    saveToLocalStorage("comments", comments);
  }, [comments]);

  useEffect(() => {
    saveToLocalStorage("replies", replies);
  }, [replies]);

  const addNewComment = (comment) => {
    setComments({ ...comments, [comment.id]: comment });
  };

  const updateComment = (obj) => {
    if (comments[obj.id]) {
      setComments({ ...comments, [obj.id]: obj });
    } else if (replies[obj.id]) {
      setReplies({ ...replies, [obj.id]: obj });
    }
  };

  const deleteComment = (id) => {
    // shallow copies of comment and replies from state
    const commentsCopy = { ...comments };
    const repliesCopy = { ...replies };

    // function to delete the comment or reply object from either the
    // comments state or replies state
    const deleteHelper = (obj) => {
      try {
        if (obj.type === "comment") {
          delete commentsCopy[obj.id];
        } else if (obj.type === "reply") {
          // checking if the parent object (on which the reply has been made)
          // is available in the top level comments state or replies state and
          // setting the value of parentObj constant to its reference
          const parentObj =
            repliesCopy[obj.parentId] || commentsCopy[obj.parentId];

          if (parentObj) {
            // filter out the replyId from the parent object replyIds array
            // as the reply object is being deleted
            parentObj.replyIds = parentObj.replyIds.filter(
              (replyId) => replyId !== obj.id
            );
            // if parent objects's replyIds array is empty then delete that property
            // from the parent object
            if (!parentObj.replyIds.length) {
              delete parentObj.replyIds;
            }
            delete repliesCopy[obj.id];
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    const deleteObj = (obj) => {
      try {
        // check if the object (top level comment or a sub level reply) has
        // replyIds and if so, recursively call deleteObj function for
        // every replyId from replyIds by passing its object as argument
        if (obj.replyIds) {
          obj.replyIds.forEach((replyId) => {
            deleteObj(replies[replyId]); // getting replyId object from replies state as a reply can't be in comments state (top level)
            // once control returns back to the above line, call deleteHelper
            // function with the object that was waiting for the nested objects to be deleted
            deleteHelper(obj);
          });
        } else {
          // if the object does not have any replyIds then this else block
          // is executed calling deleteHelper function with the same object
          deleteHelper(obj);
        }
      } catch (err) {
        console.error(err);
      }
    };

    // check if the id is of a top level comment or a sub level reply
    // and call deleteObj function with that object
    if (comments[id]) {
      deleteObj(comments[id]);
    } else if (replies[id]) {
      deleteObj(replies[id]);
    }

    // finally set the comments and replies with the updated data in
    // commentsCopy and repliesCopy
    setComments(commentsCopy);
    setReplies(repliesCopy);
  };

  const addNewReply = (reply) => {
    const { id, parentId } = reply;

    if (comments[parentId]) {
      const commentsCopy = { ...comments };

      if (commentsCopy[parentId].replyIds) {
        commentsCopy[parentId].replyIds.unshift(id);
      } else {
        commentsCopy[parentId].replyIds = [id];
      }

      setComments(commentsCopy);
      setReplies({ ...replies, [id]: reply });
    } else if (replies[parentId]) {
      const parentObj = { ...replies[parentId] };

      if (parentObj.replyIds) {
        parentObj.replyIds.unshift(id);
      } else {
        parentObj.replyIds = [id];
      }

      setReplies({
        ...replies,
        [parentId]: parentObj,
        [id]: reply,
      });
    }
  };

  const commentsList = useMemo(() => {
    let commentsArray = Object.keys(comments).map(
      (commentId) => comments[commentId]
    );
    commentsArray = sortCommentsByRecentDate(commentsArray);
    return commentsArray;
  }, [comments]);

  const handleDeleteAll = () => {
    setComments({});
    setReplies({});
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.jumbotron}>
        <Typography variant="h2">Comment Widget</Typography>
        <div className={styles.mainContent}>
          <NewComment onAddComment={addNewComment} />
          {commentsList.length > 0 ? (
            <div className={styles.commentsContainer}>
              <div className={styles.deleteAllContainer}>
                <Button
                  label="Delete All"
                  variant="secondary"
                  size="small"
                  onClick={handleDeleteAll}
                />
              </div>
              <ul>
                {commentsList.map((comment) => (
                  <li key={comment.id} className={styles.listItem}>
                    <Comment
                      replies={replies}
                      commentDetails={comment}
                      onUpdate={updateComment}
                      onDelete={deleteComment}
                      onAddReply={addNewReply}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <Typography variant="caption-text" cssClass={styles.noCommentsText}>
              No comments added
            </Typography>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
