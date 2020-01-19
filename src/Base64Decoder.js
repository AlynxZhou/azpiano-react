class Base64Decoder {
  constructor() {
    this.keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
  }

  removePaddingChars(input) {
    for (let i = input.length - 1; i >= 0; --i) {
      if (input.charAt(i) !== '=') {
        return input.substring(0, i + 1)
      }
    }
    // input.length === 0
    return input
  }

  decode(input) {
    input = input.replace(/[^A-Za-z0-9+/=]/g, '')
    input = this.removePaddingChars(input)
    const bytes = input.length / 4 * 3

    const buffer = new ArrayBuffer(bytes)
    const uarray = new Uint8Array(buffer)
    let chr1, chr2, chr3
    let enc1, enc2, enc3, enc4
    let j = 0

    for (let i = 0; i < bytes; i += 3) {
      enc1 = this.keyStr.indexOf(input.charAt(j++))
      enc2 = this.keyStr.indexOf(input.charAt(j++))
      enc3 = this.keyStr.indexOf(input.charAt(j++))
      enc4 = this.keyStr.indexOf(input.charAt(j++))

      chr1 = (enc1 << 2) | (enc2 >> 4)
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2)
      chr3 = ((enc3 & 3) << 6) | enc4

      uarray[i] = chr1;
      if (enc3 !== 64) {
        uarray[i + 1] = chr2
      }
      if (enc4 !== 64) {
        uarray[i + 2] = chr3
      }
    }

    return buffer
  }
}

export default Base64Decoder
