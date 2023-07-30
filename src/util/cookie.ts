export function setCookie(name: string, value: string, days?: number) {
  const cookie: {
    [name: string]: string | undefined;
    path: string;
    expires: string | undefined;
  } = { [name]: value, path: "/", expires: undefined };

  if (days) {
    let date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    cookie.expires = date.toUTCString();
  }

  let arr = [];
  for (let key in cookie) {
    arr.push(`${key}=${cookie[key]}`);
  }

  document.cookie = arr.join("; ");

  return getCookie(name);
}

export function getAllCookies() {
  let cookie: { [name: string]: string } = {};

  document.cookie.split(";").forEach((el) => {
    let [k, v] = el.split("=");
    cookie[k.trim()] = v;
  });

  return cookie;
}

export function getCookie(name: string) {
  return getAllCookies()[name];
}

export function deleteCookie(name: string) {
  setCookie(name, "", -1);
}
