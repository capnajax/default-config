# default-config
Per-env config with defaults

## Installation

```sh
npm install --save @capnajax/default-config
```

## Usage

Upon startup, this module obtain a config file from one of these places, in order of priority:

1) A location specified by a `--config=<filename>` parameter,
1) A location specified by a `CONFIG` environment variable,
1) If the `NODE_ENV` environment variable is specified, A file called `config-[env].yaml` in the entry point module's directory, or
1) A file called `config.yaml` in the entry point module's directory.

Also, it will load a `default-config.yaml` from the entry point module's directory. This file specifies default configurations. Other config files will override the configs in this one.

This will also get an environment name from one of these places, also in order of priority:

1) As specified by a `--env=<envname>` parameter,
2) As specified by a `CONFIG_ENV` environment variable,
3) As specified bt a `NODE_ENV` environment variable, or
4) Default value of `local`.

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

