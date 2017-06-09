open Types;

let defaultOptions: renderOptions = {"padMonth": false, "padDays": false, "padHours": false};

let parse template::template options::options => {
  let template = Parser.parse template;
  let optionsWithDefault = switch options {
  | None => defaultOptions
  | Some o => o
};
  let render date => Compiler.compiler template date optionsWithDefault;
  render
};