import { memo } from "react";
import PropTypes from "prop-types";
import styles from "./typography.module.css";

const Typography = (props) => {
  const { variant, cssClass } = props;

  const otherClass = cssClass || "";

  switch (variant) {
    case "h1":
    case "h2":
      return (
        <h2
          className={`${styles["typography-base"]} ${styles[variant]} ${otherClass}`}
        >
          {props.children}
        </h2>
      );

    case "h3":
      return (
        <h3
          className={`${styles["typography-base"]} ${styles[variant]} ${otherClass}`}
        >
          {props.children}
        </h3>
      );

    case "h4":
      return (
        <h4
          className={`${styles["typography-base"]} ${styles[variant]} ${otherClass}`}
        >
          {props.children}
        </h4>
      );

    case "h5":
      return (
        <h5
          className={`${styles["typography-base"]} ${styles[variant]} ${otherClass}`}
        >
          {props.children}
        </h5>
      );

    case "h6":
    case "subtitle1":
    case "subtitle2":
      return (
        <h6
          className={`${styles["typography-base"]} ${styles[variant]} ${otherClass}`}
        >
          {props.children}
        </h6>
      );

    case "body1":
    case "body2":
      return (
        <p
          className={`${styles["typography-base"]} ${styles[variant]} ${otherClass}`}
        >
          {props.children}
        </p>
      );

    case "button-text":
    case "caption-text":
    case "overline-text":
      return (
        <span
          className={`${styles["typography-base"]} ${styles[variant]} ${otherClass}`}
        >
          {props.children}
        </span>
      );

    default:
      return (
        <h2
          className={`${styles["typography-base"]} ${styles.h1} ${otherClass}`}
        >
          {props.children}
        </h2>
      );
  }
};

Typography.propTypes = {
  variant: PropTypes.string,
  cssClass: PropTypes.string,
};

export default memo(Typography);
