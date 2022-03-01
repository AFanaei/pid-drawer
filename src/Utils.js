const convertToPos = (points, variant) => {
  const res = {
    l: points[0][0] < points[1][0] ? points[0][0] : points[1][0],
    t: points[0][1] < points[1][1] ? points[0][1] : points[1][1],
    w: Math.abs(points[1][0] - points[0][0]),
    h: Math.abs(points[1][1] - points[0][1]),
  };
  if (variant === "valve" || variant === "bps") {
    res.w = 24;
    res.h = 24;
  } else if (variant === "pump") {
    res.w = 28;
    res.h = 28;
  } else if (variant === "indicator") {
    res.h = 20;
  } else if (variant === "alarm") {
    res.w = 76;
    res.h = 24;
  }
  return res;
};
const exportData = (filename, data) => {
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(JSON.stringify(data))
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
};

const exportList = { exportData, convertToPos };
export default exportList;
export { exportData, convertToPos };
