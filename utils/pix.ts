
// utils/pix.ts

/**
 * Formats a field for the EMV QR Code payload.
 * @param id The ID of the field (e.g., '00', '26').
 * @param value The value of the field.
 * @returns A formatted string 'IDLLVALUE', where LL is the two-digit length of the value.
 */
const formatField = (id: string, value: string): string => {
  const length = value.length.toString().padStart(2, '0');
  return `${id}${length}${value}`;
};

/**
 * Calculates the CRC16-CCITT checksum for a given string.
 * The polynomial is x^16 + x^12 + x^5 + 1 (0x1021).
 * @param data The input string for which to calculate the checksum.
 * @returns The CRC16 checksum as a 4-character uppercase hexadecimal string.
 */
const crc16 = (data: string): string => {
    let crc = 0xFFFF;
    for (let i = 0; i < data.length; i++) {
        crc ^= (data.charCodeAt(i) << 8);
        for (let j = 0; j < 8; j++) {
            if ((crc & 0x8000) !== 0) {
                crc = (crc << 1) ^ 0x1021;
            } else {
                crc <<= 1;
            }
        }
    }
    return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
};


/**
 * Generates a BR Code (PIX "Copia e Cola") payload for a valueless transaction.
 * @param key The PIX key (CPF, CNPJ, phone, email, or random).
 * @param name The beneficiary's name (up to 25 chars).
 * @param city The beneficiary's city (up to 15 chars).
 * @returns The complete BR Code payload as a string, or an empty string if inputs are invalid.
 */
export const generateValuelessPixPayload = (key: string, name: string, city: string): string => {
  if (!key || !name || !city) {
    return '';
  }

  // Sanitize and format inputs according to BACEN specifications.
  const sanitizedName = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .toUpperCase()
    .slice(0, 25);
    
  const sanitizedCity = city
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .toUpperCase()
    .slice(0, 15);

  const merchantAccountInformation = [
    formatField('00', 'BR.GOV.BCB.PIX'),
    formatField('01', key),
  ].join('');

  // Assemble the payload parts
  const payloadParts = [
    formatField('00', '01'),                                  // Payload Format Indicator
    formatField('26', merchantAccountInformation),             // Merchant Account Information
    formatField('52', '0000'),                                 // Merchant Category Code
    formatField('53', '986'),                                  // Transaction Currency (BRL)
    formatField('58', 'BR'),                                   // Country Code
    formatField('59', sanitizedName),                          // Beneficiary Name
    formatField('60', sanitizedCity),                          // Beneficiary City
    formatField('62', formatField('05', '***')),             // Transaction ID ('***' for user input)
  ];

  const payloadWithoutCrc = payloadParts.join('');
  const crcValue = crc16(payloadWithoutCrc + '6304'); // '6304' is the CRC ID and length

  return `${payloadWithoutCrc}6304${crcValue}`;
};
