# Pulumi Initial Experiment

## Caveats
- The `nohoist: ["**/*"]` field in the root package.json instructs `yarn` to create
a `node_modules` directory in every directory with its' own `package.json` with a version field.
This is typically not necessary as `yarn` will resolve dependencies not in the local `node_modules`
to the workspace root, however, Pulumi has an outstanding issue where it doesn't properly resolve
packages via the package manager. Instead it assumes that all modules are in the `node_modules`
directory adjacent to the project's `package.json`
