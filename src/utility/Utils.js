import { DefaultRoute } from "../router/routes";
import Avatar from "@components/avatar";

// ** Checks if an object is empty (returns boolean)
export const isObjEmpty = (obj) => Object.keys(obj).length === 0;

// ** Returns K format from a number
export const kFormatter = (num) =>
  num > 999 ? `${(num / 1000).toFixed(1)}k` : num;

// ** Converts HTML to string
export const htmlToString = (html) => html.replace(/<\/?[^>]+(>|$)/g, "");

// ** Checks if the passed date is today
const isToday = (date) => {
  const today = new Date();
  return (
    /* eslint-disable operator-linebreak */
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
    /* eslint-enable */
  );
};

export const isValidDate = (d) => {
  return d instanceof Date && !isNaN(d);
};

export const minDateOfBirth = () => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 110);

  return date;
};

/**
 ** Format and return date in Humanize format
 ** Intl docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/format
 ** Intl Constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
 * @param {String} value date to format
 * @param {Object} formatting Intl object to format with
 */
export const formatDate = (
  value,
  formatting = { month: "short", day: "numeric", year: "numeric" }
) => {
  if (!value) return value;
  return new Intl.DateTimeFormat("en-US", formatting).format(new Date(value));
};

// ** Returns short month of passed date
export const formatDateToMonthShort = (value, toTimeForCurrentDay = true) => {
  const date = new Date(value);
  let formatting = { month: "short", day: "numeric" };

  if (toTimeForCurrentDay && isToday(date)) {
    formatting = { hour: "numeric", minute: "numeric" };
  }

  return new Intl.DateTimeFormat("en-US", formatting).format(new Date(value));
};

/**
 ** Return if user is logged in
 ** This is completely up to you and how you want to store the token in your frontend application
 *  ? e.g. If you are using cookies to store the application please update this function
 */
export const isUserLoggedIn = () => localStorage.getItem("userData");
export const getUserData = () => JSON.parse(localStorage.getItem("userData"));

/**
 ** This function is used for demo purpose route navigation
 ** In real app you won't need this function because your app will navigate to same route for each users regardless of ability
 ** Please note role field is just for showing purpose it's not used by anything in frontend
 ** We are checking role just for ease
 * ? NOTE: If you have different pages to navigate based on user ability then this function can be useful. However, you need to update it.
 * @param {String} userRole Role of user
 */
export const getHomeRouteForLoggedInUser = (userRole) => {
  if (userRole === "admin") return "/home";
  if (userRole === "client") return "/access-control";
  return "/login";
};

// ** React Select Theme Colors
export const selectThemeColors = (theme) => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary25: "#7367f01a", // for option hover bg-color
    primary: "#7367f0", // for selected option bg-color
    neutral10: "#7367f0", // for tags bg-color
    neutral20: "#ededed", // for input border-color
    neutral30: "#ededed", // for input hover border-color
  },
});

export const PatientPicture = ({ url }) => {
  return (
    <div className="demo-inline-spacing">
      {url && url != "" ? (
        <Avatar img={url} size="xl" className="img-fluid rounded mt-3 mb-2" />
      ) : (
        <Avatar
          img="https://storage.googleapis.com/woundcharts/patients/a2d85b5d8b8c47388dcb10ae73ce2f8e.webp"
          size="xl"
          className="img-fluid rounded mt-3 mb-2"
        />
      )}
    </div>
  );
};

export const PatientPicture2 = ({ url, name }) => {
  return (
    <div className="position-relative">
      <div className="profile-img-container d-flex align-items-center">
        <div className="profile-img">
          {url && url != "" ? (
            <img
              className="rounded img-fluid"
              src={url}
              alt="Card image"
              height="110"
              width="110"
            />
          ) : (
            <img
              className="rounded img-fluid"
              height="110"
              width="110"
              src="https://storage.googleapis.com/woundcharts/patients/a2d85b5d8b8c47388dcb10ae73ce2f8e.webp"
              alt="Card image"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export function getFullName(firstName, middleName, lastName, secondLastName) {
  let value = firstName;

  if (middleName) {
    value = `${value} ${middleName}`;
  }
  if (lastName) {
    value = `${value} ${lastName}`;
  }

  if (secondLastName) {
    value = `${value} ${secondLastName}`;
  }

  return value;
}

export function getAge(dateString) {
  var today = new Date();
  var birthDate = new Date(dateString);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export function getFormatedDate(dateString) {
  var date = new Date(dateString);
  var options = { year: "numeric", month: "long", day: "numeric" };

  return date.toLocaleDateString("en-US", options);
}

export function getFormatedDateFromISODate(dateString) {
  if (dateString == "" || dateString == null) {
    return "";
  }

  var date = new Date(dateString.split("T")[0]);
  var formattedDate = `${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}/${date
    .getFullYear()
    .toString()
    .slice(-2)}`;

  return formattedDate;
}

export function getDateFromISODate(date) {
  return date.split("T")[0];
}

export function getFormatedDateAsyyyyMMdd(dateString) {
  var d = new Date(dateString);

  return (
    d.getFullYear() +
    "-" +
    ("0" + (d.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + d.getDate()).slice(-2)
  );
}

export function dateToISOString(dateString) {
  var d = new Date(dateString);

  return d.toISOString();
}

export function dateToLocalISO(dateString) {
  if (dateString == "" || dateString == null) {
    return "";
  }
  let date = new Date(dateString);

  const off = date.getTimezoneOffset();
  const absoff = Math.abs(off);
  return `${
    new Date(date.getTime() - off * 60 * 1000).toISOString().substr(0, 23) +
    (off > 0 ? "-" : "+") +
    Math.floor(absoff / 60)
      .toFixed(0)
      .padStart(2, "0")
  }:${(absoff % 60).toString().padStart(2, "0")}`;
}

export function getDateTimeLocal(isoStr) {
  if (isoStr == "" || isoStr == null) {
    return "";
  }
  const date = new Date(isoStr);
  return new Date(date.getTime() + new Date().getTimezoneOffset() * -60 * 1000)
    .toISOString()
    .slice(0, 19);
}

export const formattedDate = (dateTimeString) => {
  const dateTime = new Date(dateTimeString);
  const formattedDateTime = dateTime.toLocaleString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });

  return formattedDateTime;
};

export function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
};

export function DateFormat(inputDateStr) {
  const inputDate = new Date(inputDateStr);
  const day = inputDate.getUTCDate();
  const month = inputDate.getUTCMonth() + 1;
  const year = inputDate.getUTCFullYear();
  return `${month}/${day}/${year}`;
};

export function TimeFormat(inputDateStr) {
  const inputDate = new Date(inputDateStr);
  const hours = inputDate.getUTCHours();
  const minutes = inputDate.getUTCMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12; 
  const formattedMinutes = minutes.toString().padStart(2, '0');
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
};

export function parseInteger(value, defaultValue = 0) {
  const parsedValue = parseInt(value);
  return isNaN(parsedValue) ? defaultValue : parsedValue;
}

export const transformValue = (value) => {
  return isNaN(value) || value === null || value === undefined ? null : value;
};
