# Static files meta scraping

This is a command line tool that can search for files in a specific directory and get a list of OGP and other settings based on the extraction tags you set.  
Currently, only `.html` extension is available.

## Install

```shell
# npm
$ npm i -g @io-arc/static-files-meta-scraping

# yarn
$ yarn global add @io-arc/static-files-meta-scraping
```

## Usage

```shell
Usage: static-meta-scraping [options]

Options:
  -V, --version             output the version number
  -i, --init [save]         Create a settings file.
                            If don't parameter is save in the current directory (choices: "global")
  -d, --dir <directory>     Search target output directory. (default: dist)
  -f, --find <directories>  Specify a directory to be further targeted from the target directories.
                            Comma separated if there are multiple directories. (default: undefined)
                            e.g. en,ja
  -r, --root <path>         When searching for images, specify if the output file is different from the actual root path. (default: /)
  -o, --output <directory>  Specifies the directory to output the result files. (default: /Users/xxxxx/Downloads)
  -h, --help                display help for command
```

## Create a settings file

```shell
$ static-meta-scraping -i

# global
$ static-meta-scraping -i global
```

[Example settings file](sample/.meta-scraping.json)

Create a file (`.meta-scraping.json`) with the defaults for tags to be searched.  
If you specify `global`, the configuration file will be created in the HOME directory.

The configuration file will be prioritized in the order of `current > global > library default`.  
Properties that do not exist in the configuration file will be applied to the library default settings.

If the configuration file exists in the current directory, the global configuration file will not be read.

Even if a configuration file exists, you can temporarily override the settings by specifying options in the command (except for search tags).

The key name of the configuration file is the same as the option name of the command.

## Search

### How to specify a search tag

Write the following in the configuration file.

```
{
  "search": [
    {
      "target": "html[lang]",
      "value": "lang"
    },
    {
      "target": "title"
    }
  ]
}
```

`target` is the tag to extract (required).
If `value` is omitted, the default setting is applied.

If `value` is omitted, the default setting will be applied.

#### Default

Except for the following, the contents of the tag will be retrieved.

| target        | property  |
| ------------- | --------- |
| `meta`        | `content` |
| `link`        | `href`    |
| `a`           | `href`    |
| `img[srcset]` | `srcset`  |
| `img`         | `src`     |
| `source`      | `src`     |
| `video`       | `src`     |

Images are converted to base64 and displayed in the result file.
Supported extensions: `jpg|jpeg|gif|png|webp|svg`.

※Note※
Because all detected images are converted to base64, the result file may be huge if `img` tags are set.

## Example

### If the path in the file is different from the actual directory structure

e.g.
directory: /dist/index.html
img tag: `src="/foo/assets/ogp.png`

**.meta-scraping.json**

```json
{
  "dir": "dist",
  "root": "/foo/"
}
```

**Command**

```shell
$ static-meta-scraping -d dist -r /foo/
```

### If you want to extract only a specific directory in the output destination

```
/dist
├── /en
│   └── index.html
├── /ja
│   └── index.html
└── /foo
    └── index.html
```

To extract only `en` and `ja` directories

**.meta-scraping.json**

```json
{
  "dir": "dist",
  "find": "en,ja"
}
```

**Command**

```shell
$ static-meta-scraping -d dist -f en,ja
```
