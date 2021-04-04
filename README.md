# vidstreaming-api-test

Api for downloading or watching anime videos from [gogo-stream.com](1)/[vidstreaming.io](2)

[1]: https://gogo-stream.com
[2]: https://vidstreaming.io

# CLI

Run `vidstreaming --help` to see more options

```
   vidstreaming <cmd>

Commands:
  vidstreaming search [name]  Search for anime

Options:
      --version     Show version number                     [boolean]

  -D, --download    Download Anime to specified directory
  -O, --output      Output urls to txt file
  -R, --resolution  Output resolution - 360, 480, 720, 1080
                    If none defaults to original quality

      --help        Show help                               [boolean]
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

- `-D`, `--download` - Download files in a specified path.
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

_Note: If the `-D` and `-R` options are omitted then it will log the urls to the console.
  ```
  vidstreaming search "jujutsu kaisen" --download "/path/to/download/dir/Jujutsu_Kaisen"
  ```
- `-O`, `--output` - Output urls into a .txt file.
  ```
  vidstreaming search "jujutsu kaisen" --output "jujutsu.txt"
  ```
- `-R`, `--resolution` - Set the quality of the video. (eg. 360, 480...)
  ```
  vidstreaming search "jujutsu kaisen" --resolution 720
  ```
- `-E`, `--episodes` - Get only the episodes specified. (eg. "1-10", "1 2 4")
  ```
  vidstreaming search "jujutsu kaisen" --episodes 1-10 17 21 -- [...options]
  ```

_Note: If the `-D` and `-R` options are omitted then it will log the urls to the console.
