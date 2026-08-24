// Tell TypeScript that CSS files imported as side effects are valid modules.
// This silences ts(2882) "Cannot find module or type declarations for side-effect import"
// which fires in VS Code when moduleResolution is set to "bundler".
declare module "*.css" {
  const styles: { [className: string]: string };
  export default styles;
}
