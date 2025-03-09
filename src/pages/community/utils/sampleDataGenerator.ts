
import { ForumCategory, ForumPost } from "@/types/community";

export const generateSamplePosts = (categories: ForumCategory[]): ForumPost[] => {
  const samplePosts: ForumPost[] = [];
  
  // Sample content for different categories
  const sampleContent = {
    anxiety: [
      {
        title: "Techniques for managing panic attacks",
        content: "I've been struggling with panic attacks recently. What techniques have helped you manage them in the moment?"
      },
      {
        title: "Social anxiety at work",
        content: "Does anyone have tips for managing social anxiety in workplace meetings? I find myself freezing up when I need to speak."
      },
      {
        title: "Physical symptoms of anxiety",
        content: "Lately I've been experiencing heart palpitations and shortness of breath. Does anyone else have physical symptoms with their anxiety?"
      }
    ],
    depression: [
      {
        title: "Getting out of bed on bad days",
        content: "Some days I can barely get out of bed. What small steps help you when depression is overwhelming?"
      },
      {
        title: "Depression and losing interest in hobbies",
        content: "I used to love painting but now I feel nothing when I try. Has anyone found a way to reconnect with their passions?"
      },
      {
        title: "Supporting a partner with depression",
        content: "My partner was recently diagnosed with depression. How can I best support them through this?"
      }
    ],
    mindfulness: [
      {
        title: "Beginning meditation practice",
        content: "I'm new to meditation and finding it difficult to quiet my mind. Any tips for beginners?"
      },
      {
        title: "Mindfulness exercises for work breaks",
        content: "Looking for quick mindfulness exercises I can do during short breaks at work. What works for you?"
      },
      {
        title: "Connecting mindfulness to daily activities",
        content: "How do you incorporate mindfulness into everyday tasks like cooking or cleaning?"
      }
    ],
    general: [
      {
        title: "Sleep hygiene tips",
        content: "I've been having trouble sleeping. What sleep hygiene practices have helped improve your sleep quality?"
      },
      {
        title: "Finding a therapist",
        content: "I'm ready to start therapy but unsure how to find the right therapist. What should I look for?"
      },
      {
        title: "Managing stress during major life changes",
        content: "I'm going through several big life changes at once. How do you manage stress during transitions?"
      }
    ]
  };
  
  // Generate 3 sample posts for each category
  const now = new Date();
  let postId = 1;
  
  categories.forEach(category => {
    const categorySamples = sampleContent[category.id as keyof typeof sampleContent] || [];
    
    categorySamples.forEach((sample, index) => {
      // Create post with varying dates (some recent, some older)
      const daysAgo = Math.floor(Math.random() * 14); // Random between 0-14 days ago
      const postDate = new Date(now);
      postDate.setDate(postDate.getDate() - daysAgo);
      
      const isAnonymous = index % 3 === 0; // Make some posts anonymous
      const replies = Math.floor(Math.random() * 15); // Random number of replies
      
      samplePosts.push({
        id: `sample-${postId++}`,
        title: sample.title,
        content: sample.content,
        categoryId: category.id,
        categoryName: category.name,
        author: isAnonymous ? "Anonymous" : `Community Member ${postId % 5 + 1}`,
        date: postDate,
        replies: replies,
        isAnonymous: isAnonymous
      });
    });
  });
  
  // Sort by date (newest first)
  return samplePosts.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};
