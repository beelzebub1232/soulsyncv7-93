
// Quotes organized by mood type
export const moodQuotes = {
  amazing: [
    {
      text: "Keep riding this wave of positivity. Your amazing energy inspires those around you!",
      author: "Mindfulness Journal"
    },
    {
      text: "Today is a wonderful day to be alive. Celebrate your joy and share it with others!",
      author: "Louise Hay"
    },
    {
      text: "Your positive energy is infectious. Use this amazing mood to pursue your dreams!",
      author: "Tony Robbins"
    },
    {
      text: "What a wonderful feeling to be at your best. Remember this feeling in challenging times.",
      author: "SoulSync"
    },
    {
      text: "Your heart is full of joy today. Let it overflow into everything you do!",
      author: "Thich Nhat Hanh"
    }
  ],
  good: [
    {
      text: "Good days create great lives. Keep building on this positive momentum.",
      author: "Robin Sharma"
    },
    {
      text: "A positive attitude gives you power over your circumstances instead of your circumstances having power over you.",
      author: "Joyce Meyer"
    },
    {
      text: "Your good mood is a gift. Unwrap it fully and share pieces of it with others.",
      author: "SoulSync"
    },
    {
      text: "Happiness is not something ready-made. It comes from your own actions.",
      author: "Dalai Lama"
    },
    {
      text: "The more you praise and celebrate your life, the more there is in life to celebrate.",
      author: "Oprah Winfrey"
    }
  ],
  okay: [
    {
      text: "The middle ground is still solid ground. You're doing just fine.",
      author: "SoulSync"
    },
    {
      text: "Not every day needs to be extraordinary. Ordinary days build extraordinary lives.",
      author: "Brené Brown"
    },
    {
      text: "In the middle exists the space to breathe, reflect, and prepare for what's next.",
      author: "Unknown"
    },
    {
      text: "Today might be just okay, and that's perfectly fine. Tomorrow holds new possibilities.",
      author: "Mindfulness Journal"
    },
    {
      text: "The beauty of being okay is that you can move in any direction from here.",
      author: "SoulSync"
    }
  ],
  sad: [
    {
      text: "Sadness gives depth. Happiness gives height. Sadness gives roots. Happiness gives branches.",
      author: "Kahlil Gibran"
    },
    {
      text: "It's okay to not be okay. Take this moment to be gentle with yourself.",
      author: "SoulSync"
    },
    {
      text: "The wound is the place where the light enters you.",
      author: "Rumi"
    },
    {
      text: "Even the darkest night will end and the sun will rise.",
      author: "Victor Hugo"
    },
    {
      text: "Tears are words that need to be written. Let them flow when needed.",
      author: "Paulo Coelho"
    }
  ],
  awful: [
    {
      text: "In the midst of winter, I found there was, within me, an invincible summer.",
      author: "Albert Camus"
    },
    {
      text: "Rock bottom became the solid foundation on which I rebuilt my life.",
      author: "J.K. Rowling"
    },
    {
      text: "When everything seems to be going against you, remember that the airplane takes off against the wind, not with it.",
      author: "Henry Ford"
    },
    {
      text: "This difficult moment is not your destination, just part of your journey.",
      author: "SoulSync"
    },
    {
      text: "Sometimes the bravest thing you can do is simply make it through the day.",
      author: "SoulSync"
    }
  ],
  default: [
    {
      text: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
      author: "Nelson Mandela"
    },
    {
      text: "Your time is limited, so don't waste it living someone else's life.",
      author: "Steve Jobs"
    },
    {
      text: "The way to get started is to quit talking and begin doing.",
      author: "Walt Disney"
    },
    {
      text: "If life were predictable it would cease to be life, and be without flavor.",
      author: "Eleanor Roosevelt"
    },
    {
      text: "Spread love everywhere you go. Let no one ever come to you without leaving happier.",
      author: "Mother Teresa"
    }
  ]
};

export type MoodQuoteType = typeof moodQuotes.default[0];
export type MoodType = keyof typeof moodQuotes;
