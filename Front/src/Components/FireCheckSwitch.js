import * as React from "react";
import { alpha, styled } from "@mui/material/styles";
import { pink } from "@mui/material/colors";
import Switch from "@mui/material/Switch";

const PinkSwitch = styled(Switch)(({ theme }) => ({
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: pink[600],
    "&:hover": {
      backgroundColor: alpha(pink[600], theme.palette.action.hoverOpacity),
    },
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: pink[600],
  },
}));

const label = { inputProps: { "aria-label": "Color switch demo" } };
export default function FireCheckSwitch(props) {
  const { fireCheckTO, checkFire, videoUrl, switchFireButton } = props;
  let [switchState, setSwitchSate] = React.useState(false);

  async function handleSwitchClick() {
    console.log(" je suis dans handleSwitchClick =>>>> ", switchState);
    if (!switchState) {
      if (videoUrl) {
        console.log("Fire check activated");
        setSwitchSate(true);
        checkFire();
        console.log("check passed");
      } else {
        console.log(" No streamUrl set ");
      }
    } else {
      console.log("Fire check desactivated");
      setSwitchSate(false);
      clearTimeout(fireCheckTO);
    }
  }

  React.useEffect(() => {
    handleSwitchClick();
    console.log("called");
  }, [switchFireButton]);

  return (
    <div>
      <PinkSwitch
        sx={{ transform: "scale(1.5)" }}
        {...label}
        checked={switchState}
        onClick={() => handleSwitchClick()}
      />
    </div>
  );
}
