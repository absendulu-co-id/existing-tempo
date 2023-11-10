String.prototype.toCapitalCase = function () {
  return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
};

String.prototype.toTitleCase = function (ignoreAllCaps: boolean = true) {
  if (ignoreAllCaps && this.toUpperCase() == this) {
    return this.toString();
  }

  return this.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
  });
};

String.prototype.toDecimal = function () {
  const parsed = parseFloat(this.toString());

  if (!Number.isNaN(parsed)) {
    return parseFloat(this.toString()) / 100;
  } else {
    return 0;
  }
};

String.prototype.toSnakeCase = function () {
  const str = this.toString();
  return (
    str
      .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
      ?.map((x) => x.toLowerCase())
      .join("_") ?? str
  );
};

export {};
