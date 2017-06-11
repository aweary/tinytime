open Types;

let defaultOptions: renderOptions = {"padMonth": false, "padDays": false, "padHours": false};

let parse template::template options::options => {
  let template = Parser.parse template;
  let optionsWithDefault =
    if (Js.Undefined.testAny options) {
      defaultOptions
    } else {
      options
    };
  let render date => Compiler.compiler template date optionsWithDefault;
  {"render": render}
};