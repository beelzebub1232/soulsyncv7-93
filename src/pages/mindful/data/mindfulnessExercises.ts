
import { MindfulnessExerciseType } from "../types";

export const mindfulnessExercises: MindfulnessExerciseType[] = [
  {
    id: "body-scan",
    name: "Progressive Body Scan",
    description: "A guided meditation that helps you develop awareness of your body, reducing tension and increasing relaxation.",
    level: "Beginner",
    duration: 10,
    focus: "Body Awareness",
    color: "blue",
    steps: [
      {
        title: "Preparation",
        instruction: "Find a comfortable position lying down on your back. Close your eyes and take a few deep breaths, feeling your body sink into the surface beneath you.",
        duration: 30
      },
      {
        title: "Focus on Breath",
        instruction: "Bring attention to your breath. Notice the natural rhythm of your inhales and exhales without trying to change them.",
        duration: 45
      },
      {
        title: "Feet & Ankles",
        instruction: "Bring awareness to your feet. Notice any sensations - warmth, coolness, pressure, tingling. Gently flex and relax your feet, then let go of any tension.",
        duration: 60
      },
      {
        title: "Legs",
        instruction: "Move your attention up to your calves, knees, and thighs. Notice any sensations without judgment. If you find tension, imagine it melting away as you exhale.",
        duration: 60
      },
      {
        title: "Hips & Lower Back",
        instruction: "Focus on your hips, pelvis, and lower back. These areas often hold stress. Notice any tightness and allow it to soften with each breath.",
        duration: 60
      },
      {
        title: "Abdomen & Chest",
        instruction: "Bring awareness to your stomach and chest. Feel your breath moving in this area. Notice how your abdomen rises and falls with each breath.",
        duration: 60
      },
      {
        title: "Upper Back & Shoulders",
        instruction: "Focus on your upper back, shoulders, and neck. These areas commonly accumulate tension. Allow any tightness to release as you exhale.",
        duration: 60
      },
      {
        title: "Arms & Hands",
        instruction: "Move your attention down your arms to your hands and fingers. Notice any sensations. Imagine tension flowing out through your fingertips.",
        duration: 60
      },
      {
        title: "Face & Head",
        instruction: "Bring awareness to your face and head. Relax your jaw, soften the space between your eyebrows, and release tension in your forehead and scalp.",
        duration: 60
      },
      {
        title: "Whole Body",
        instruction: "Now expand your awareness to your entire body as a whole. Feel the connection between all parts and the sense of completeness.",
        duration: 45
      },
      {
        title: "Completion",
        instruction: "Take a few deep breaths. As you're ready, gently wiggle your fingers and toes, stretch if you like, and slowly open your eyes, carrying this sense of relaxation with you.",
        duration: 30
      }
    ]
  },
  {
    id: "loving-kindness",
    name: "Loving-Kindness Meditation",
    description: "A practice to develop compassion for yourself and others, fostering feelings of goodwill and kindness.",
    level: "Intermediate",
    duration: 15,
    focus: "Compassion",
    color: "purple",
    steps: [
      {
        title: "Preparation",
        instruction: "Find a comfortable seated position with a straight back. Close your eyes and take several deep breaths to center yourself.",
        duration: 30
      },
      {
        title: "Self-Kindness",
        instruction: "Place your hands over your heart. Silently repeat these phrases to yourself: 'May I be happy. May I be healthy. May I be safe. May I live with ease.' Feel the warmth of these wishes.",
        duration: 120
      },
      {
        title: "Loved One",
        instruction: "Bring to mind someone you care about deeply. Picture them clearly and extend the same wishes: 'May you be happy. May you be healthy. May you be safe. May you live with ease.'",
        duration: 120
      },
      {
        title: "Neutral Person",
        instruction: "Think of someone you neither like nor dislike - perhaps a neighbor or colleague you don't know well. Extend the same wishes to them, recognizing their humanity.",
        duration: 120
      },
      {
        title: "Difficult Person",
        instruction: "If you feel ready, bring to mind someone with whom you have difficulty. With an open heart, offer them the same wishes, acknowledging that they too wish to be happy.",
        duration: 120
      },
      {
        title: "All Beings",
        instruction: "Expand your awareness to include all beings everywhere. 'May all beings be happy. May all beings be healthy. May all beings be safe. May all be at ease.'",
        duration: 120
      },
      {
        title: "Return to Self",
        instruction: "Finally, return to yourself. Notice how your heart feels after offering these wishes. Rest in the feeling of kindness you've generated.",
        duration: 60
      },
      {
        title: "Completion",
        instruction: "Gradually widen your awareness to the room around you. When you're ready, gently open your eyes, carrying this sense of kindness with you.",
        duration: 30
      }
    ]
  },
  {
    id: "mindful-listening",
    name: "Mindful Listening Practice",
    description: "A meditation focused on developing deep attention to sounds, helping to improve focus and present-moment awareness.",
    level: "Beginner",
    duration: 8,
    focus: "Sensory Awareness",
    color: "green",
    steps: [
      {
        title: "Preparation",
        instruction: "Find a comfortable position sitting up straight but relaxed. Close your eyes or lower your gaze to reduce visual distractions.",
        duration: 30
      },
      {
        title: "Initial Awareness",
        instruction: "Take a few deep breaths and begin to notice the ambient sounds around you. Don't try to identify every sound, just become aware of the soundscape.",
        duration: 60
      },
      {
        title: "Distant Sounds",
        instruction: "Focus your attention on the most distant sounds you can hear. Notice their qualities - are they continuous or intermittent? Loud or soft? Pleasant or unpleasant?",
        duration: 90
      },
      {
        title: "Middle-Distance Sounds",
        instruction: "Shift your attention to sounds in the middle distance - perhaps from another room or just outside. Listen with curiosity, as if hearing these common sounds for the first time.",
        duration: 90
      },
      {
        title: "Close Sounds",
        instruction: "Now bring your attention to the closest sounds - perhaps the sound of your own breathing, subtle movements of your body, or electronics in the room.",
        duration: 90
      },
      {
        title: "Whole Soundscape",
        instruction: "Expand your awareness to take in the entire soundscape - near, middle, and far sounds all at once. Notice how sounds arise and fade, creating an ever-changing symphony.",
        duration: 90
      },
      {
        title: "Sound and Silence",
        instruction: "Begin to notice the spaces between sounds - the moments of relative quiet. Pay attention to both sound and silence with equal interest.",
        duration: 60
      },
      {
        title: "Completion",
        instruction: "Gradually bring your awareness back to your body and breath. When you're ready, slowly open your eyes and carry this quality of attentive listening with you.",
        duration: 30
      }
    ]
  },
  {
    id: "mindful-walking",
    name: "Mindful Walking Meditation",
    description: "A practice that combines gentle walking with focused awareness, helping to ground you in the present moment through movement.",
    level: "Beginner",
    duration: 12,
    focus: "Movement",
    color: "blue",
    steps: [
      {
        title: "Preparation",
        instruction: "Find a quiet space where you can walk slowly for about 10-20 steps in one direction. Stand still at one end, with your feet hip-width apart.",
        duration: 30
      },
      {
        title: "Posture Awareness",
        instruction: "Feel your feet firmly connecting with the ground. Notice your posture - align your spine, relax your shoulders, and let your arms hang naturally at your sides.",
        duration: 45
      },
      {
        title: "Begin Walking",
        instruction: "Start walking very slowly, more slowly than your normal pace. Pay attention to the sensation of lifting your foot, moving it forward, and placing it back down.",
        duration: 90
      },
      {
        title: "Heel-to-Toe Awareness",
        instruction: "Feel each part of your foot as it contacts the ground - heel, ball, toes. Notice weight shifting from the back to the front of your foot with each step.",
        duration: 120
      },
      {
        title: "Full Movement",
        instruction: "Expand your awareness to include your entire legs, hips, and the subtle movements of your body as you walk. Notice how your arms naturally swing slightly.",
        duration: 120
      },
      {
        title: "Turning Point",
        instruction: "When you reach the end of your walking path, pause. Take a moment to be fully aware as you slowly turn around to walk in the opposite direction.",
        duration: 30
      },
      {
        title: "Continue Practice",
        instruction: "Continue walking back and forth, maintaining full awareness of each step. If your mind wanders, gently bring your attention back to the physical sensations of walking.",
        duration: 120
      },
      {
        title: "Environmental Awareness",
        instruction: "While maintaining awareness of your movement, also notice your surroundings - the space around you, any sounds, or the feeling of air on your skin.",
        duration: 60
      },
      {
        title: "Completion",
        instruction: "Gradually come to a stop. Stand still for a moment and notice how your body feels after this walking meditation. Carry this mindful awareness with you as you resume normal activities.",
        duration: 45
      }
    ]
  },
  {
    id: "breath-counting",
    name: "Breath Counting Meditation",
    description: "A simple but powerful concentration practice that uses counting to develop focus and present-moment awareness.",
    level: "Beginner",
    duration: 5,
    focus: "Concentration",
    color: "green",
    steps: [
      {
        title: "Preparation",
        instruction: "Find a comfortable seated position with your back straight but not rigid. Rest your hands in your lap or on your knees and close your eyes.",
        duration: 30
      },
      {
        title: "Initial Breath Awareness",
        instruction: "Take a few deep breaths to settle in. Then allow your breathing to return to its natural rhythm - not forced or controlled, just natural.",
        duration: 45
      },
      {
        title: "Begin Counting",
        instruction: "As you exhale, silently count 'one'. On the next exhale, count 'two', and so on up to 'five'. Then start over again at 'one'. Focus on the sensation of the breath and the counting.",
        duration: 60
      },
      {
        title: "Mind Wandering",
        instruction: "If you notice your mind has wandered and you've lost count, simply return to 'one' with your next exhale. Do this without judgment or frustration - mind wandering is normal.",
        duration: 60
      },
      {
        title: "Continue Practice",
        instruction: "Continue counting your exhalations from one to five, then starting over. Allow your breath to be natural and relaxed as you maintain the count.",
        duration: 60
      },
      {
        title: "Deepen Awareness",
        instruction: "As you continue, try to notice the subtle sensations of each breath - the feeling of air moving through your nostrils, the rise and fall of your abdomen or chest.",
        duration: 60
      },
      {
        title: "Completion",
        instruction: "Let go of the counting and simply rest in awareness of your breath for a few moments. When you're ready, slowly open your eyes and return your attention to your surroundings.",
        duration: 30
      }
    ]
  },
  {
    id: "gratitude-practice",
    name: "Mindful Gratitude Practice",
    description: "A meditation focused on developing appreciation and thankfulness, helping to shift perspective toward the positive aspects of life.",
    level: "Beginner",
    duration: 10,
    focus: "Positive Emotion",
    color: "purple",
    steps: [
      {
        title: "Preparation",
        instruction: "Find a comfortable position either sitting or lying down. Close your eyes and take several deep breaths to center yourself.",
        duration: 30
      },
      {
        title: "Heart Focus",
        instruction: "Bring your attention to the area around your heart. Place a hand on your heart if that helps. Take a few breaths into this area, feeling a sense of warmth developing.",
        duration: 45
      },
      {
        title: "Simple Gratitude",
        instruction: "Think of something simple in your life that you're grateful for - perhaps clean water, a comfortable bed, or the beauty of nature. Feel the appreciation in your heart.",
        duration: 60
      },
      {
        title: "People Gratitude",
        instruction: "Bring to mind someone who has helped you or shown you kindness. It could be a family member, friend, teacher, or even a stranger. Feel gratitude for their presence in your life.",
        duration: 90
      },
      {
        title: "Self Gratitude",
        instruction: "Consider something about yourself that you're grateful for - a personal quality, an accomplishment, or simply your own resilience. Extend appreciation toward yourself.",
        duration: 90
      },
      {
        title: "Challenges Gratitude",
        instruction: "If you feel ready, consider a challenge or difficulty that ultimately led to growth or learning. Can you find gratitude even within challenging experiences?",
        duration: 90
      },
      {
        title: "Open Gratitude",
        instruction: "Expand your awareness to a general sense of gratitude for life itself, for the opportunity to experience this moment. Rest in this open feeling of appreciation.",
        duration: 60
      },
      {
        title: "Carry Forward",
        instruction: "Consider how you might carry this feeling of gratitude into your day. Perhaps there's someone you could thank or a moment you could pause to appreciate.",
        duration: 45
      },
      {
        title: "Completion",
        instruction: "Take a few deep breaths, feeling the sense of gratitude in your body. When you're ready, slowly open your eyes, carrying this appreciation with you.",
        duration: 30
      }
    ]
  },
  {
    id: "mindful-eating",
    name: "Mindful Eating Practice",
    description: "A guided exercise to develop full awareness while eating, helping to improve your relationship with food and enhance enjoyment of meals.",
    level: "Intermediate",
    duration: 10,
    focus: "Sensory Awareness",
    color: "orange",
    steps: [
      {
        title: "Preparation",
        instruction: "Choose a small piece of food - perhaps a raisin, a piece of chocolate, or a slice of fruit. Sit comfortably at a table with your food item in front of you.",
        duration: 30
      },
      {
        title: "Visual Observation",
        instruction: "Look at the food as if you've never seen it before. Notice its colors, shapes, textures, and how light reflects off its surface. Observe with curiosity and interest.",
        duration: 45
      },
      {
        title: "Touch Exploration",
        instruction: "Pick up the food and explore it with your fingers. Notice its weight, temperature, and texture. Is it smooth, rough, soft, or firm? Be aware of all tactile sensations.",
        duration: 45
      },
      {
        title: "Smell Awareness",
        instruction: "Bring the food toward your nose and smell it carefully. Notice the aroma - is it strong or subtle? Pleasant or unpleasant? Does the smell trigger any memories or emotions?",
        duration: 45
      },
      {
        title: "First Taste",
        instruction: "Place the food on your tongue but don't chew yet. Notice how your body responds - salivation, mouth movements, anticipation. Be aware of the initial taste and texture.",
        duration: 45
      },
      {
        title: "Mindful Chewing",
        instruction: "Begin to chew slowly and deliberately. Notice how the taste changes and spreads throughout your mouth. Feel the texture transforming as you chew.",
        duration: 60
      },
      {
        title: "Swallowing Awareness",
        instruction: "When ready to swallow, do so consciously, following the sensation as the food moves down your throat. Notice how your body feels after swallowing.",
        duration: 45
      },
      {
        title: "After-Effects",
        instruction: "Sit quietly for a moment and notice any lingering tastes or sensations. Be aware of how your body feels after eating this small amount of food.",
        duration: 45
      },
      {
        title: "Reflection",
        instruction: "Reflect on this experience. How was it different from your usual way of eating? Did you notice anything new about this familiar food?",
        duration: 45
      },
      {
        title: "Completion",
        instruction: "Consider how you might bring elements of this practice into your daily meals, even if just for the first few bites. When ready, conclude the practice.",
        duration: 30
      }
    ]
  },
  {
    id: "mountain-meditation",
    name: "Mountain Meditation",
    description: "A visualization practice that cultivates inner stability and strength by connecting with the qualities of a mountain.",
    level: "Intermediate",
    duration: 15,
    focus: "Stability",
    color: "blue",
    steps: [
      {
        title: "Preparation",
        instruction: "Find a comfortable seated position with your back straight. Rest your hands in your lap or on your knees and close your eyes. Take several deep breaths to center yourself.",
        duration: 45
      },
      {
        title: "Body Awareness",
        instruction: "Feel your body sitting - the weight of your body on the chair or cushion, your feet on the floor. Notice the natural dignity of your upright posture.",
        duration: 60
      },
      {
        title: "Mountain Visualization",
        instruction: "Bring to mind an image of a majestic mountain - any mountain that feels right for you, whether real or imagined. See its solid base, rising slopes, and noble peak.",
        duration: 90
      },
      {
        title: "Mountain Qualities",
        instruction: "Consider the qualities of this mountain - its solidity, stability, grandeur, and unmoving nature. It remains steadfast regardless of what happens around it.",
        duration: 90
      },
      {
        title: "Changing Conditions",
        instruction: "Imagine the mountain throughout the changing seasons - snow in winter, flowers in spring, summer heat, autumn colors. Through all these changes, the mountain remains a mountain.",
        duration: 120
      },
      {
        title: "Weather Systems",
        instruction: "Visualize different weather systems moving over the mountain - sunshine, clouds, storms, fog, rain, snow. The mountain experiences all of these but remains unmoved at its core.",
        duration: 120
      },
      {
        title: "Becoming the Mountain",
        instruction: "Now begin to merge your awareness with the mountain. Feel yourself becoming the mountain - solid at your base, rising upward with dignity, your head like the mountain peak.",
        duration: 120
      },
      {
        title: "Inner Weather",
        instruction: "Notice how, like the mountain, you experience your own changing weather - thoughts, emotions, sensations, all passing through your awareness while your essential nature remains.",
        duration: 90
      },
      {
        title: "Mountain Strength",
        instruction: "Draw on the mountain's strength and stability. Know that you can weather any storm of thought or emotion while maintaining your fundamental steadiness.",
        duration: 90
      },
      {
        title: "Completion",
        instruction: "As you prepare to end the meditation, remember that you can connect with these mountain qualities anytime. Gradually return your awareness to the room and open your eyes when ready.",
        duration: 45
      }
    ]
  }
];
