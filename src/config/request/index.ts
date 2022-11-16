import Basic from "./module";

let instance;
export default (() => {
  if (instance) return instance;
  instance = new Basic();
  return instance;
})();
