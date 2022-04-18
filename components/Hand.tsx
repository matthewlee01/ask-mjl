import React, { useEffect } from "react";
import { useRive, useStateMachineInput } from "rive-react";

const keyMap = {
  KeyA: "pinky",
  KeyS: "ring",
  KeyD: "middle",
  KeyF: "index",
  KeyH: "index",
  KeyG: "index",
  KeyZ: "pinky",
  KeyX: "ring",
  KeyC: "middle",
  KeyV: "index",
  IntlBackslash: "pinky",
  KeyB: "index",
  KeyQ: "pinky",
  KeyW: "ring",
  KeyE: "middle",
  KeyR: "index",
  KeyY: "index",
  KeyT: "index",
  Digit1: "pinky",
  Digit2: "ring",
  Digit3: "middle",
  Digit4: "index",
  Digit5: "index",
  Equal: "pinky",
  Digit9: "ring",
  Digit7: "index",
  Minus: "pinky",
  Digit8: "middle",
  Digit0: "pinky",
  BracketRight: "pinky",
  KeyO: "ring",
  KeyU: "index",
  BracketLeft: "pinky",
  KeyI: "middle",
  KeyP: "pinky",
  Enter: "pinky",
  KeyL: "ring",
  KeyJ: "index",
  Quote: "pinky",
  KeyK: "middle",
  Semicolon: "pinky",
  Backslash: "pinky",
  Comma: "middle",
  Slash: "pinky",
  KeyN: "index",
  KeyM: "index",
  Period: "ring",
  Tab: "pinky",
  Space: "thumb",
  Backquote: "pinky",
  Backspace: "pinky",
};

const Hand = () => {
  const { rive, RiveComponent } = useRive({
    src: "hand.riv",
    artboard: "hand",
    autoplay: true,
    stateMachines: "taps",
  });

  const thumbPressed = useStateMachineInput(rive, "taps", "thumbPressed");
  const indexPressed = useStateMachineInput(rive, "taps", "indexPressed");
  const middlePressed = useStateMachineInput(rive, "taps", "middlePressed");
  const ringPressed = useStateMachineInput(rive, "taps", "ringPressed");
  const pinkyPressed = useStateMachineInput(rive, "taps", "pinkyPressed");

  useEffect(() => {
    document.body.addEventListener("keydown", onPress);
    document.body.addEventListener("keyup", onRelease);
  });
  const onPress = (event: KeyboardEvent) => {
    const finger = keyMap[event.code];
    switch (finger) {
      case "thumb":
        if (thumbPressed) thumbPressed.value = true;
        break;
      case "index":
        if (indexPressed) indexPressed.value = true;
        break;
      case "middle":
        if (middlePressed) middlePressed.value = true;
        break;
      case "ring":
        if (ringPressed) ringPressed.value = true;
        break;
      case "pinky":
        if (pinkyPressed) pinkyPressed.value = true;
        break;
    }
  };

  const onRelease = (event: KeyboardEvent) => {
    const finger = keyMap[event.code];
    switch (finger) {
      case "thumb":
        if (thumbPressed) thumbPressed.value = false;
        break;
      case "index":
        if (indexPressed) indexPressed.value = false;
        break;
      case "middle":
        if (middlePressed) middlePressed.value = false;
        break;
      case "ring":
        if (ringPressed) ringPressed.value = false;
        break;
      case "pinky":
        if (pinkyPressed) pinkyPressed.value = false;
        break;
    }
  };

  return <RiveComponent />;
};

export default Hand;
