const countryCodeToFlagEmoji = (code) => {
    const codePoints = [...code].map(char => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
};
  
module.exports = countryCodeToFlagEmoji;