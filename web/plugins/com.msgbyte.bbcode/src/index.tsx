import React from 'react';
import {
  Loadable,
  regMessageRender,
  regMessageTextDecorators,
} from '@capital/common';

const BBCode = Loadable(() => import('./render'));

regMessageRender((message) => {
  return <BBCode plainText={message} />;
});

regMessageTextDecorators(() => ({
  url: (plain) => `[url]${plain}[/url]`,
  image: (plain, attrs) => {
    if (attrs.height && attrs.width) {
      return `[img height=${attrs.height} width=${attrs.width}]${plain}[/img]`;
    }

    return `[img]${plain}[/img]`;
  },
  mention: (userId, userName) => `[at=${userId}]${userName}[/at]`,
  emoji: (emojiCode) => `[emoji]${stripColons(emojiCode)}[/emoji]`,
}));

/**
 * Removes colons on either side
 * of the string if present
 */
function stripColons(str: string): string {
  const colonIndex = str.indexOf(':');
  if (colonIndex > -1) {
    // :emoji: (http://www.emoji-cheat-sheet.com/)
    if (colonIndex === str.length - 1) {
      str = str.substring(0, colonIndex);
      return stripColons(str);
    } else {
      str = str.substr(colonIndex + 1);
      return stripColons(str);
    }
  }

  return str;
}
