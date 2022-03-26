const moment = require('moment');

const formatMessage = (displayName, message, hexColor, media) => {
  let theme;
  let textTheme;
  let mentionName;
  let photoURL = '';
  let text = message || '';
  let role = 'user';
  let photoGif = '';
  // if text true
  //add effect function
  const addEffect = (value, effect) => {
    theme = effect || value;
    text = message.replace(`!${value}`, '');
  };

  //add effect function
  if (text.startsWith('!rc')) {
    addEffect('rc');
    textTheme = '#' + Math.floor(Math.random() * 16777215).toString(16);
  }

  //Mention
  if (text.startsWith('@')) {
    theme = 'mention';
    mentionName = message.split(' ')[0];
    text = message.replace(mentionName, '');
  }

  if (text.startsWith('!rainbow')) {
    addEffect('rainbow', 'rainbow-text');
  }

  if (text.startsWith('!console')) {
    addEffect('console', 'console-text');
  }

  if (text.startsWith('!love')) {
    addEffect('love', 'love-text');
  }

  if (text.startsWith('!ls')) {
    addEffect('ls');
  }

  if (text.startsWith('!hacker')) {
    addEffect('hacker', 'hacker-theme-1');
  }

  if (text.startsWith('!admin')) {
    addEffect('admin');
  }

  if (text.startsWith('!soon')) {
    addEffect('soon');
  }

  // add image to admin (aminbenz)
  switch (displayName.toLowerCase()) {
    case 'aminbenz':
    case 'amin benz':
      role = 'admin';
      photoURL = './images/avatar/nft2.jpg';
      photoGif = './images/avatar/nft2.gif';
      break;
    case 'pt':
      role = 'bot';
      photoURL =
        'https://preview.redd.it/e3q5jovld7p61.png?width=1920&format=png&auto=webp&s=9cd2ac452037c9a6d346279cd14ead25a58ad971';
      break;
    default:
      photoURL = '';
      break;
  }

  return {
    displayName,
    username: displayName.split(' ').join(''),
    message: text.trim(),
    timestamp: moment().format('h:mm a'),
    media,
    photoURL,
    textTheme,
    theme,
    mentionName,
    bgColor: hexColor,
    id: new Date().getTime(),
    role,
    photoGif,
  };
};

module.exports = formatMessage;
