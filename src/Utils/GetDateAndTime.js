export const getCurrentTime = () => {
  const time =
    (new Date().getHours() ? new Date().getHours() % 12 : 12) +
    ":" +
    new Date().getMinutes() +
    " " +
    (new Date().getHours() > 12 ? "pm" : "am");

  return time;
};

export function getCurrentDate() {
  const currentDate = new Date();
  const day = String(currentDate.getDate()).padStart(2, "0");
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const year = currentDate.getFullYear();

  return `${day}/${month}/${year}`;
}
