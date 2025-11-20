#!/bin/bash
IMAGE_FILE="check-2.png"
BASE64_IMAGE=$(base64 -w 0 "$IMAGE_FILE")  # Stream heredoc payload directly from the command to avoid curl argument list too long
cat <<EOF | curl -X POST http://localhost:3000/check/scan \
-H "Content-Type: application/json" \
--data-binary @-
{
  "id": "check-2.png",
  "image": {
    "buffer": "$BASE64_IMAGE",
    "format": "image/png"
  },
  "translators": ["tesseract", "opencv"]
}
EOF
