import { ButtonExtendedProps, Button } from "grommet";

const IconButton = (props: ButtonExtendedProps) => {
  return (
    <Button
      primary
      style={{
        width: "70px",
        height: "70px",
        borderRadius: "100%",
        textAlign: "center",
      }}
      {...props}
    />
  );
};
export default IconButton;
