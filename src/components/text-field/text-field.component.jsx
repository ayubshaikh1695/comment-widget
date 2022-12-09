import { memo } from "react";
import PropTypes from "prop-types";
import Typography from "components/typography/typography.component";
import styles from "./text-field.module.css";

// supported states
const STATES = ["error"];

const TextField = (props) => {
  const {
    placeholder = "",
    value,
    error,
    errorMessage,
    disabled,
    autoFocus,
    onChange,
    onKeyUp,
  } = props;

  let inputCssClass = styles["text-field-base"];

  if (error && STATES.includes("error")) {
    inputCssClass += ` ${styles.error}`;
  }

  return (
    <div className={styles.wrapper}>
      <input
        className={inputCssClass}
        type="text"
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        autoFocus={autoFocus}
        onChange={onChange}
        onKeyUp={onKeyUp}
      />
      <div className={styles["error-message-container"]}>
        <Typography variant="caption-text">{errorMessage}</Typography>
      </div>
    </div>
  );
};

TextField.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string,
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  disabled: PropTypes.bool,
  autoFocus: PropTypes.bool,
  onChange: PropTypes.func,
  onKeyUp: PropTypes.func,
};

export default memo(TextField);
