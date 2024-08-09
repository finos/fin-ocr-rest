# FIN-OCR-WEB

This project contains code for an OCR REST-ful service which takes a bank check image as input and returns the translated MICR (routing, account, and check numbers) in JSON format.

## Getting Started

After cloning this repository, build the project:

```
npm run build
```

To start the server on the default port 3000:

```
npm run start
```

To start the server with debug:

```
OCR_LOG_LEVEL=debug npm run start
```

To start the server on a different port (e.g. port 3001):

```
PORT=3001 npm run start
```

## REST API

After starting the server as described above, you can see the swagger doc at `http://localhost:3000/swagger`.

The `POST /check/scan` API is used to scan a check image and return the checks routing, account, and check numbers.

The following is a sample request body, where the default format is "tif".

```
{
   "id": "ANY ID",
   "image": {
        "format": "tif | jpg | png | gif | bmp | x_ms_bmp",
        "base64": "BASE64 ENCODING OF CHECK IMAGE"
   }
}
```

And a sample response body:
```
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

The fields of the request body:

| Field name   | type   | Optional | Default | Description          |
| ------------ | ------ | -------- | ------- | -------------------- |
| id           | string   | false    | none  | The check identifier which is returned with the response |
| image.base64 | string   | false    | none  | A base64 encoded image of the front of the check |
| image.format | string   | true     | "tiff" | The image format of the `image.base64` field after being base64 decoded |
| translators  | string array | true | ["tesseract","opencv"] | The translators whose responses are to be returned |
| debug        | string array | true | false | Debug category names including one or more of the following: "images", "check-details", "all-details", "*" |
| correct      | boolean | true | false | Whether or not to correct the response of `opencv` which also teaches the `opencv` translator for future translations |
| actual       | string | true | none | This is the actual MICR line in string format which is used when `correct` is true |

The required fields of the response body:

| Field name | type   | Optional | Default | Description          |
| ---------- | ------ | -------- | ------- | -------------------- |
| id         | string   | false    | none  | The check identifier from the request body |
| translators | map | false    | none  | The per-translator values (depending on the value of the request's `translators` field) for the check's routing, account, and check numbers |

The additional fields in the response body which are set if the request's `debug` field was set to true:

| Field name | type   | Optional | Default | Description          |
| ---------- | ------ | -------- | ------- | -------------------- |
| match      | boolean | true | none  | True if any of the translator's results matched the value passed in the request's `actual` field |
| overlap    | boolean | true | none  | True if signature overlap of the MICR line was detected in the image |
| images     | map array | true | none  | An array of name, format, base64 encoding, width, and height of each image generated during OCR processing |