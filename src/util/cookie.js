export function setCookie(name, value, days) {
  const cookie = { [name]: value, path: "/" };

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
  let cookie = {};

  document.cookie.split(";").forEach((el) => {
    let [k, v] = el.split("=");
    cookie[k.trim()] = v;
  });

  return cookie;
}

export function getCookie(name) {
  return getAllCookies()[name];
}

export function deleteCookie(name) {
  setCookie(name, "", -1);
}
