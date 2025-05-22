[![FINOS - Incubating](https://cdn.jsdelivr.net/gh/finos/contrib-toolbox@master/images/badge-incubating.svg)](https://community.finos.org/docs/governance/Software-Projects/stages/incubating) [![Contributors-Invited](https://img.shields.io/badge/Contributors-Wanted-blue)](./CONTRIBUTE.md)
# FIN-OCR-REST

This project contains code for an OCR REST-ful service which takes a bank check image as input and returns the translated MICR (routing, account, and check numbers) in JSON format.

## Prerequisites

Ensure you have the following installed on your system:

- Git
- [Node.js](https://nodejs.org/) (v20.x or higher, which includes npm)
- npm (comes with Node.js)

## Installation Steps

### 1. Clone the SDK and Web Repositories
Clone both the SDK and the web repositories:

```bash
git clone https://github.com/discoverfinancial/fin-ocr-sdk.git
git clone https://github.com/discoverfinancial/fin-ocr-rest.git
```

### 2. Build and Link the SDK
Navigate to the SDK directory, install dependencies, build it, and link it globally:

```bash
cd fin-ocr-sdk
npm run build
npm link
```

<details>
<summary><strong>Note for users with restricted npm global path</strong></summary>

If the normal global path for npm is restricted on your corporate machine, you can still use `npm link` by following these steps:

### For Unix-like Systems (Linux/macOS):

1. **Set up a local npm prefix:**
   - Configure npm to use a local directory for global installations. This allows you to use `npm link` without requiring access to the restricted global path.
   - Run the following command:
     ```bash
     npm config set prefix ~/.npm-global
     ```
   - This changes the global installation directory to `~/.npm-global`, which should be accessible even with corporate restrictions.

2. **Add the new npm global directory to your PATH:**
   - Add the following line to your `.bashrc`, `.zshrc`, or corresponding shell configuration file:
     ```bash
     export PATH=~/.npm-global/bin:$PATH
     ```
   - Then, source the file to update your current shell session:
     ```bash
     source ~/.bashrc  # or source ~/.zshrc
     ```

3. **Use `npm link` as usual:**

### For Windows Users:

1. **Set up a local npm prefix:**
   - Configure npm to use a local directory for global installations by running the following command in your terminal (Command Prompt or PowerShell):
     ```bash
     npm config set prefix "%USERPROFILE%\npm-global"
     ```
   - This changes the global installation directory to `%USERPROFILE%\npm-global`, which is within your user profile and should be accessible despite corporate restrictions.

2. **Add the new npm global directory to your PATH:**
   - Open the Environment Variables settings in Windows.
   - Add `%USERPROFILE%\npm-global\bin` to your `PATH` variable.

3. **Use `npm link` as usual:**

</details>

### 3. Install Dependencies and Build the Application
Next, navigate to the fin-ocr-rest directory and run the following commands to install the necessary dependencies and build the project:

```bash
cd ../fin-ocr-rest
npm link @discoverfinancial/fin-ocr-sdk
npm run build
```
#### 4 Running the Application

To start the server on the default port 3000:

```bash
npm run start
```

To start the server with debug:

```bash
OCR_LOG_LEVEL=debug npm run start
```

To start the server on a different port (e.g. port 3001):

```bash
PORT=3001 npm run start
```

## REST API

After starting the server as described above, you can see the swagger doc at `http://localhost:3000/swagger`.

## JSON API Example

### POST /check/scan
This endpoint is used to scan a check image and return the check's routing, account, and check numbers.

#### Example JSON Request Body
```json
{
  "id": "ANY ID",
  "image": {
    "format": "tif | jpg | png | gif | bmp | x_ms_bmp",
    "buffer": "BASE64 ENCODING OF CHECK IMAGE"
  }
}
```
#### Example JSON Response Body
```json
{
  "id": "ANY ID",
  "translators": {
    "tesseract": {
      "result": {
        "routingNumber": "123456789",
        "accountNumber": "123456890",
        "checkNumber": "12345678"
      }
    },
    "opencv": {
      "result": {
        "routingNumber": "123456789",
        "accountNumber": "123456890",
        "checkNumber": "123456789"
      }
    }
  }
}
```

### Example curl Script for JSON API
You can use the following script to send a JSON request to the `/check/scan` endpoint:
```bash
#!/bin/bash
IMAGE_FILE="check_sample_02.png"
BASE64_IMAGE=$(base64 -w 0 "$IMAGE_FILE")  # Stream heredoc payload directly from the command to avoid curl argument list too long
cat <<EOF | curl -X POST http://localhost:3000/check/scan \
-H "Content-Type: application/json" \
--data-binary @-
{
  "id": "check_sample_02.png",
  "image": {
    "buffer": "$BASE64_IMAGE",
    "format": "image/png"
  },
  "translators": ["tesseract", "opencv"]
}
EOF
```

## File Upload API Example

### POST /check/scanFile
This endpoint is utilized to scan a check image and return the check's routing, account, and check numbers.

#### Example Using curl:
```bash
curl http://localhost:3000/check/scanFile -F "image=@check_sample_02.png"
```

#### Example File Upload Response
A successful response will return a JSON object structured as follows:
```json
{
  "id": "default-id",
  "translators": {
    "tesseract": {
      "result": {
        "micrLine": "T011300142T12345678U01012\n",
        "routingNumber": "011300142",
        "accountNumber": "12345678",
        "checkNumber": "1012"
      }
    },
    "opencv": {
      "result": {
        "micrLine": "011300142T312345678U010111133357",
        "routingNumber": "312345678",
        "accountNumber": "010111133357",
        "checkNumber": ""
      }
    }
  },
  "overlap": true
}
```

## API Request and Response Fields

### Request
The fields of the request body are as follows:

| Field name   | type   | Optional | Default | Description          |
| ------------ | ------ | -------- | ------- | -------------------- |
| id           | string   | false    | none  | The check identifier which is returned with the response |
| image.buffer | string   | false    | none  | A base64 encoded image of the front of the check |
| image.format | string   | true     | "tiff" | The image format of the `image.base64` field after being base64 decoded |
| translators  | string array | true | ["tesseract","opencv"] | The translators whose responses are to be returned |
| debug        | string array | true | false | Debug category names including one or more of the following: "images", "check-details", "all-details", "*" |
| correct      | boolean | true | false | Whether or not to correct the response of `opencv` which also teaches the `opencv` translator for future translations |
| actual       | string | true | none | This is the actual MICR line in string format which is used when `correct` is true |

### Response
The required fields of the response body are as follows:

| Field name | type   | Optional | Default | Description          |
| ---------- | ------ | -------- | ------- | -------------------- |
| id         | string   | false    | none  | The check identifier from the request body |
| translators | map | false    | none  | The per-translator values (depending on the value of the request's `translators` field) for the check's routing, account, and check numbers |

### Additional Fields in Response with debug Enabled
The additional fields that are in the response body if the request's `debug` field was set to true are as follows:

| Field name | type   | Optional | Default | Description          |
| ---------- | ------ | -------- | ------- | -------------------- |
| match      | boolean | true | none  | True if any of the translator's results matched the value passed in the request's `actual` field |
| overlap    | boolean | true | none  | True if signature overlap of the MICR line was detected in the image |
| images     | map array | true | none  | An array of name, format, base64 encoding, width, and height of each image generated during OCR processing |

## Roadmap

TBD

## Contributing

This document provides guidance for how YOU can collaborate with our project community to improve this technology.

[FIN-OCR Contribution](https://github.com/finos/fin-ocr/blob/main/CONTRIBUTE.md)

## Scans
### Vulnerability Report

To generate a report containing any vulnerabilities in any dependency please use:

```bash
$npm run scan
```

### License Report

```bash
npm run scan-license
```

**Note:** Each of these scans should be run and problems addressed by a developer prior to submitting code that uses new packages.

## License

Copyright 2024 Capital One

Distributed under the [Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0).

SPDX-License-Identifier: [Apache-2.0](https://spdx.org/licenses/Apache-2.0)
