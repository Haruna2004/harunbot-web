import { useRouter } from "next/navigation";

export function makeDisplayName(profile) {
  if (profile.first_name && profile.last_name) {
    return `${profile.first_name} ${profile.last_name}`;
  } else {
    return profile.first_name;
  }
}

export function isJson(myVar) {
  if (typeof myVar === "object" && myVar !== null) {
    return true;
  } else {
    return false;
  }
}

export function fillTemplate(string, data = {}) {
  return Object.entries(data).reduce((res, [key, value]) => {
    // lookbehind expression, only replaces if mustache was not preceded by a backslash
    const mainRe = new RegExp(`(?<!\\\\){{\\s*${key}\\s*}}`, "g");
    // this regex is actually (?<!\\){{\s*<key>\s*}} but because of escaping it looks like that...
    const escapeRe = new RegExp(`\\\\({{\\s*${key}\\s*}})`, "g");
    // the second regex now handles the cases that were skipped in the first case.
    return res.replace(mainRe, value.toString()).replace(escapeRe, "$1");
  }, string);
}

export function useLoginDialog() {
  const router = useRouter();
  const { action } = router.query;
  const isLoginOpen = action === "login";
  const setLoginOpen = (open) => {
    const query = { ...router.query };

    if (!open && query.action === "login") {
      delete query.action;
    }
    if (open) {
      query.action === "login";
    }

    router.push({
      pathname: router.pathname,
      query,
    });
  };
  return { isLoginOpen, setLoginOpen };
}
