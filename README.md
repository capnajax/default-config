# default-config

Per-env config with defaults

## Installation

```sh
npm install --save @capnajax/default-config
```

```javascript
import c from '@capnajax/default-config';

c('config.path');
```

## Usage

Upon startup, this module obtain a config file from one of these places, in order of priority:

1) A location specified by a `--config=<filename>` parameter,
1) A location specified by a `CONFIG_PATH` environment variable,
1) `${PWD}/config-${CONFIG_ENV}.yaml`
1) `${PWD}/config-${NODE_ENV}.yaml`
1) `${PWD}/config.yaml`

Multiple config files can be used by separating them with the system path delimiter (e.g. on POSIX `--config=./config.yaml:./secrets/secret-config.yaml`). When there are multiple files in the path have values for the same key, the last one takes precedent.

Also, it will load a `default-config.yaml` from the entry point module's directory. This file specifies default configurations. Other config files will override the configs in this one.

This will also get an environment name from one of these places, also in order of priority:

1) As specified by a `--env=<envname>` parameter,
1) As specified by a `CONFIG_ENV` environment variable,
1) As specified bt a `NODE_ENV` environment variable, or
1) Default value of `local`.

Note that when configs are loaded, they are loaded using syncronous methods.

## The config file(s)

A config file is a YAML file with two sections, `default` and `environments`. The `envornments` section has a section for each environment name.

The `default-config.yaml` file does not have an `environments` section. Anything in an `environments` section in the `default-config.yaml` will be ignored.

Configs are loaded in this order of priority:

1) The config file's `environments.<environment name>` section,
2) The config file's `default` section, or
3) The default config file's `default` section.

### Example config file

`config.yaml`:

```yaml
default:
  // overrides configs in the default-config.yaml below.
  animal: wildebeest
  plural: wildebeests
  // collective-noun inherited from default-config.yaml
environment:
  // because local is not specified, if env is not specified, it'll use the default.
  dev:
    // overrides the default configs.
    animal: moose
    plural: moose
    // collective-noun inherited from default 
  qa:
    animal: octopus
    plural: octopodes
    collective-noun: shoal
  prod:
    animal: goose
    plural: geese
    collective-noun: flock
```

`default-config.yaml`

```yaml
default:
  animal: bison
  plural: bisons
  collective-noun: herd
// note there is only a default section, no evironments section
```

## Changes from v2.x to v3.x

* Support for multiple config files.
* There is no automatic checking for `default-config.yaml`.

## Changes from v1.x to v2.x

* Converted from a CommonJS to an ES6 module
* The default config file is now in the current working directory, not the directory of the entry point module.
