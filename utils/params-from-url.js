/*
  Convert URLs from Wikipedia's API sandbox to a parameter object

  Usage: node params-from-url.js '/w/api.php?action=query&format=json&prop=links%7Clinkshere%7Ccategories&pageids=11263477&plnamespace=0&pllimit=100&pldir=ascending&lhprop=pageid%7Ctitle&lhnamespace=0&lhshow=!redirect&lhlimit=100&clshow=!hidden&cllimit=50'

  Returns:

    const params = {
      action: "query",
      format: "json",
      prop: "links|linkshere|categories",
      pageids: "11263477",
      plnamespace: "0",
      pllimit: "100",
      pldir: "ascending",
      lhprop: "pageid|title",
      lhnamespace: "0",
      lhshow: "!redirect",
      lhlimit: "100",
      clshow: "!hidden",
      cllimit: "50"
    };

*/

const input = process.argv[2];


function parseUrl(url) {
  const matched = url.match(/\api\.php\?(.+)$/);

  if (!matched) return nil;

  const parsedParams = matched[1]
    .replace(/\%7C/g, "|")
    .split("&");

  const paramObj = {};
  parsedParams.map((param) => {

    const [key, val] = param.match(/([^=]+)=([^=]+)/).slice(1);
    paramObj[key] = val;

  });

  return paramObj;

}

function parseParams(input) {

  const paramObj = parseUrl(input);

  const printableParams = [];
  Object.keys(paramObj).forEach((key) => printableParams.push(`  ${key}: "${paramObj[key]}"`));
  return printableParams;

}

function printParams(input) {

  const printableParams = parseParams(input);

  console.log("const params = {");
  console.log(printableParams.join(",\n"));
  console.log("};");

}

printParams(input);
