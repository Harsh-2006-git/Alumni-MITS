// // utils/htmlCleaner.js
// // Utility for converting HTML to plain text - NO CHANGES TO JobScheduler

// class HTMLCleaner {
//   /**
//    * Converts HTML content to clean plain text
//    * Removes all HTML tags, decodes entities, and formats nicely
//    */
//   htmlToPlainText(html) {
//     if (!html || typeof html !== "string") return "";

//     let text = html;

//     // Remove script and style tags with their content
//     text = text.replace(
//       /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
//       ""
//     );
//     text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");

//     // Convert common block elements to newlines
//     text = text.replace(
//       /<\/(div|p|h[1-6]|li|tr|section|article|blockquote)>/gi,
//       "\n"
//     );
//     text = text.replace(/<br\s*\/?>/gi, "\n");
//     text = text.replace(/<\/li>/gi, "\n");

//     // Convert list items to bullets
//     text = text.replace(/<li[^>]*>/gi, "• ");

//     // Add spacing for headers
//     text = text.replace(/<h[1-6][^>]*>/gi, "\n\n");

//     // Remove all remaining HTML tags
//     text = text.replace(/<[^>]+>/g, "");

//     // Decode HTML entities
//     text = this.decodeHTMLEntities(text);

//     // Clean up whitespace
//     text = text.replace(/\n\s*\n\s*\n/g, "\n\n"); // Remove multiple blank lines
//     text = text.replace(/[ \t]+/g, " "); // Normalize spaces
//     text = text.replace(/^\s+|\s+$/gm, ""); // Trim each line
//     text = text.trim(); // Trim start and end

//     return text;
//   }

//   /**
//    * Decodes HTML entities to normal characters
//    */
//   decodeHTMLEntities(text) {
//     const entities = {
//       "&amp;": "&",
//       "&lt;": "<",
//       "&gt;": ">",
//       "&quot;": '"',
//       "&#39;": "'",
//       "&apos;": "'",
//       "&nbsp;": " ",
//       "&ndash;": "–",
//       "&mdash;": "—",
//       "&copy;": "©",
//       "&reg;": "®",
//       "&trade;": "™",
//       "&euro;": "€",
//       "&pound;": "£",
//       "&yen;": "¥",
//       "&cent;": "¢",
//       "&deg;": "°",
//       "&plusmn;": "±",
//       "&times;": "×",
//       "&divide;": "÷",
//       "&bull;": "•",
//       "&hellip;": "...",
//       "&ldquo;": '"',
//       "&rdquo;": '"',
//       "&Atilde;": "Ã",
//       "&atilde;": "ã",
//       "&Aacute;": "Á",
//       "&aacute;": "á",
//       "&Agrave;": "À",
//       "&agrave;": "à",
//       "&Acirc;": "Â",
//       "&acirc;": "â",
//       "&Ccedil;": "Ç",
//       "&ccedil;": "ç",
//       "&Eacute;": "É",
//       "&eacute;": "é",
//       "&Iacute;": "Í",
//       "&iacute;": "í",
//       "&Oacute;": "Ó",
//       "&oacute;": "ó",
//       "&Otilde;": "Õ",
//       "&otilde;": "õ",
//       "&Uacute;": "Ú",
//       "&uacute;": "ú",
//     };

//     // Replace named entities
//     Object.entries(entities).forEach(([entity, char]) => {
//       text = text.replace(new RegExp(entity, "gi"), char);
//     });

//     // Replace numeric entities (&#xxx; and &#xHH;)
//     text = text.replace(/&#(\d+);/g, (match, dec) => {
//       return String.fromCharCode(dec);
//     });
//     text = text.replace(/&#x([0-9A-Fa-f]+);/g, (match, hex) => {
//       return String.fromCharCode(parseInt(hex, 16));
//     });

//     // Fix common encoding issues
//     text = text.replace(/Ã§/g, "ç");
//     text = text.replace(/Ã£/g, "ã");
//     text = text.replace(/Ã©/g, "é");
//     text = text.replace(/Ã­/g, "í");
//     text = text.replace(/Ã³/g, "ó");
//     text = text.replace(/Ãº/g, "ú");
//     text = text.replace(/Ã /g, "à");
//     text = text.replace(/Ã¡/g, "á");
//     text = text.replace(/Ã´/g, "ô");
//     text = text.replace(/Ãª/g, "ê");

//     return text;
//   }

//   /**
//    * Extract clean text from job data object
//    */
//   cleanJobData(jobData) {
//     const cleanedData = { ...jobData };

//     // Fields that might contain HTML
//     const htmlFields = [
//       "description",
//       "requiredSkills",
//       "qualifications",
//       "responsibilities",
//       "benefits",
//       "title",
//       "company",
//       "location",
//       "salary",
//       "experience",
//     ];

//     htmlFields.forEach((field) => {
//       if (cleanedData[field]) {
//         if (Array.isArray(cleanedData[field])) {
//           // Handle arrays (like skills, qualifications)
//           cleanedData[field] = cleanedData[field].map((item) =>
//             this.htmlToPlainText(item)
//           );
//         } else if (typeof cleanedData[field] === "string") {
//           // Handle strings
//           cleanedData[field] = this.htmlToPlainText(cleanedData[field]);
//         }
//       }
//     });

//     return cleanedData;
//   }

//   /**
//    * Clean text from cheerio element
//    */
//   getCleanText($element) {
//     if (!$element) return "";
//     const html = $element.html() || $element.text() || "";
//     return this.htmlToPlainText(html);
//   }
// }

// export default new HTMLCleaner();
