import React from "react";
import { Answer } from "components/Post";

const Spiller: React.FC = () => {
  const [items, setItems] = React.useState<React.ReactElement[]>([
  ]);
  return <div>{items}</div>;
};

export default Spiller;
