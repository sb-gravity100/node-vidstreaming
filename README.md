### ***Not working anymore... Still fixing things...***
[The Issue Here](docs/issue.md)

# vidstreaming-api-test

Api for downloading or watching anime videos from [gogo-stream.com](1)/[vidstreaming.io](2)

[1]: https://gogo-stream.com
[2]: https://vidstreaming.io

# CLI

Run `vidstreaming --help` to see more options

```
Usage: vidstreaming -S <name> [...options]

Options:
      --help        Show help                                                              [boolean]

      --version     Show version number                                                    [boolean]

  -S, --search      Anime to search for                                          [string] [required]

  -D, --download    Download Anime to directory.
                    (eg. "C:/Users/userXXX/Downloads")                                      [string]

  -O, --output      Output urls to txt.
                    (eg. "C:/Users/userXXX/Downloads/jujutsu.txt")                          [string]

  -R, --resolution  Output resolution - 360, 480, 720, 1080.
                    If none defaults to original quality.             [choices: 360, 480, 720, 1080]

  -E, --episodes    Values separated by commas.                                              [array]

  -A, --async       If true it will fetch the links one by one and print it.
                    Otherwise it will get all the links first and print it.                [boolean]
```

This will output the urls in a text file.  
Example:

```sh
vidstreaming search "jujutsu kaisen" --resolution 1080 --output "jujutsu.txt"
```

Output:

```
/dir/to/txtfile/jujutsu.txt
```

## Options

- `-D`, `--download` - Download files in a specified path. (Downloading urls is not yet supported.)
  ```sh
  vidstreaming search "jujutsu kaisen" --download "/path/to/download/dir/Jujutsu_Kaisen"
  ```
- `-O`, `--output` - Output urls into a .txt file.
  ```sh
  vidstreaming search "jujutsu kaisen" --output "jujutsu.txt"
  ```
- `-R`, `--resolution` - Set the quality of the video. (eg. 360, 480...)
  ```sh
  vidstreaming search "jujutsu kaisen" --resolution 720
  ```
- `-E`, `--episodes` - Get only the episodes specified. (eg. "1-10", "1 2 4")
  ```sh
  vidstreaming search "jujutsu kaisen" --episodes 1-10 17 21 -- [...options]
  ```
- `-A`, `--async` - If true then it will fetch the links one by one and print it. Otherwise it will get all the links first and print it.
  ```sh
  vidstreaming search "jujutsu kaisen" --async
  ```
  _Note: If the `-D` and `-R` options are omitted then it will log the urls to the console._  
  _Note: Urls order are not guaranteed in async mode._
