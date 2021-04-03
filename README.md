# vidstreaming-api-test

Api for downloading or watching anime videos from gogo-stream.com/vidstreaming.io

# CLI

Run `vidstreaming --help` to see more options

```
   vidstreaming <cmd>

Commands:
  vidstreaming search [name]  Search for anime

Options:
      --version     Show version number                     [boolean]

  -D, --download    Download Anime to Dir
  -O, --output      Output urls to txt
  -R, --resolution  Output resolution - 360, 480, 720, 1080.
                    If none defaults to original quality

      --help        Show help                               [boolean]
```

This will output multiple lines of urls.  
Example:  
```sh
vidstreaming search "jujutsu kaisen" --resolution 1080 --output "jujutsu.txt"
```
Output:
```
/dir/to/txtfile/jujutsu.txt
```

## Options

- `-D`, `--download`. Download files in  a specified path.
    ```
    vidstreaming search "jujutsu kaisen" --download "/path/to/download/dir/Jujutsu_Kaisen"
    ```
- `-O`, `--output`. Output urls into a .txt file.
    ```
    vidstreaming search "jujutsu kaisen" --output "jujutsu.txt"
    ```
- `-R`, `--resolution`. Set the quality of the video. (eg. 360, 480...)
    ```
    vidstreaming search "jujutsu kaisen" --resolution 720
    ```
