import en_words from './words/en.json' with { type: 'json' };
import pl_words from './words/pl.json' with { type: 'json' };

const highSeverityWords = 
  en_words.filter(w => w.severity > 1).map(w => w.word) +
  pl_words.filter(w => w.severity > 1).map(w => w.word);
const lowSeverityWords = 
  en_words.filter(w => w.severity <= 1).map(w => w.word) +
  pl_words.filter(w => w.severity <= 1).map(w => w.word);

export function verifyMessage(message) {
  if (typeof message !== 'string' || !message.trim()) {
    return { valid: false, reason: 'Message must be a non-empty string.' };
  }

  const trimmedMessage = message.trim();

  // Wysoka
  if (highSeverityWords.length > 0) {
    // \b oznacza granice słowa, aby nie blokować np. "maskotka" dla słowa "kot"
    // Flaga 'i' ignoruje wielkość liter
    const highRegex = new RegExp(`\\b(${highSeverityWords.join('|')})\\b`, 'i');
    if (highRegex.test(trimmedMessage)) {
      return { valid: false, reason: 'Message contains inappropriate content.' };
    }
  }

  // Niska
  let censoredMessage = trimmedMessage;
  if (lowSeverityWords.length > 0) {
    const lowRegex = new RegExp(`\\b(${lowSeverityWords.join('|')})\\b`, 'gi');
    
    censoredMessage = trimmedMessage.replace(lowRegex, (match) => '*'.repeat(match.length));
  }

  return { valid: true, reason: null, message: censoredMessage };
}
