
export const setCookie = (name: string, value: string, days: number = 1): void => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();

  if (!name) {
    console.error("Error in setCookie: name is empty!");
  }

  if (!value || typeof value !== "string") {
    console.error("Error in setCookie: value is empty or not valid type!", value + " => " + typeof value);
  }
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
};

export const getCookie = (name: string): string | null => {
  if (!name) {
    console.error("Error in getCookie: name is empty!");
    return;
  }
  const nameEQ = encodeURIComponent(name) + "=";
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    if (cookie.startsWith(nameEQ)) {
      return decodeURIComponent(cookie.substring(nameEQ.length));
    }
  }
  return null;
};

export const removeCookie = (name: string): void => {
  if (!name) {
    console.error("Error in removeCookie: name is empty!");
    return;
  }
  document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
};