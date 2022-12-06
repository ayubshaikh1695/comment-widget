import { memo } from "react";
import PropTypes from "prop-types";
import Typography from "components/typography/typography.component";
import styles from "./button.module.css";

// supported variants
const VARIANTS = ["primary", "secondary"];

const Button = (props) => {
  const { label, variant, disabled, onClick } = props;

  let buttonClass = styles["button-base"];

  if (variant && VARIANTS.includes(variant)) {
    buttonClass += " " + styles[variant];
  }

  return (
    <button className={buttonClass} disabled={disabled} onClick={onClick}>
      <Typography variant="button-text">{label || "Button"}</Typography>
    </button>
  );
};

Button.propTypes = {
  label: PropTypes.string,
  variant: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

export default memo(Button);
