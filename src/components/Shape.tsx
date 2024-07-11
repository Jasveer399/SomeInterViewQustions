import React, { useEffect, useMemo, useState } from "react";

function Shape(props) {
  const shapeType = props.BIG_DATA;
  const datas = useMemo(() => shapeType.flat(Infinity), [shapeType]);
  const [selected, setSelected] = useState(new Set());
  const [colorMap, setColorMap] = useState({});
  const [unloading, setUnloading] = useState(false);
  const row = shapeType[0].length;
  console.log(row);

  const randomColor = [
    "bg-red-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-blue-500",
    "bg-purple-500",
  ];

  const countOfVisibleValues = useMemo(
    () =>
      datas.reduce((acc, val) => {
        if (val === 1) {
          acc += 1;
        }
        return acc;
      }, 0),
    [datas]
  );

  const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * randomColor.length);
    return randomColor[randomIndex];
  };

  const unload = () => {
    setUnloading(true);
    const keys = Array.from(selected);
    const removeKeys = () => {
      if (keys.length) {
        const currentKey = keys.shift();
        setSelected((prev) => {
          const updatedSet = new Set(prev);
          updatedSet.delete(currentKey);
          return updatedSet;
        });
        setTimeout(removeKeys, 500);
      } else {
        setUnloading(false);
      }
    };
    setTimeout(removeKeys, 100);
  };

  useEffect(() => {
    if (selected.size >= countOfVisibleValues) {
      unload();
    }
  }, [selected, countOfVisibleValues]);

  const handleClick = (e) => {
    const { target } = e;
    const index = target.getAttribute("data-index");
    const status = target.getAttribute("data-status");
    const isSelected = selected.has(index);

    if (status === false || datas[index] === undefined || isSelected || unloading) {
      return;
    }

    const newColor = getRandomColor();
    setColorMap((prev) => ({ ...prev, [index]: newColor }));
    setSelected((prev) => new Set(prev.add(index)));
  };

  return (
    <div className={`grid`} style={{ gridTemplateColumns: `repeat(${row}, minmax(0, 1fr))` }} onClick={handleClick}>
      {datas.map((data, index) => {
        const isSelected = selected.has(index.toString());
        const color = colorMap[index] || "";
        return data === 1 ? (
          <div
            key={index}
            data-index={index}
            data-status={true}
            className={`w-12 h-12 border rounded-md transition duration-300 ease-in-out ${
              isSelected ? `cursor-not-allowed ${color}` : "cursor-pointer"
            }`}
          ></div>
        ) : (
          <div key={index} data-status={false} className="w-14 h-14"></div>
        );
      })}
    </div>
  );
}

export default Shape;
