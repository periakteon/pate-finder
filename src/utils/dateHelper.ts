export const formatCreatedAt = (createdAt: string, onMouseEnter: () => void): string => {
  const date = new Date(createdAt);
  const currentDate = new Date();

  const diffInMilliseconds = currentDate.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) {
    return "az önce";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} dakika önce`;
  } else if (diffInHours < 24) {
    return `${diffInHours} saat önce`;
  } else {
    return `${diffInDays} gün önce`;
  }
};


export const formatFullDate = (createdAt: string): string => {
  const date = new Date(createdAt);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${day} ${month} ${hours}:${minutes}`;
};
