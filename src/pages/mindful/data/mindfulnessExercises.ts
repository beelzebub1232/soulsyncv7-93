
import { MindfulnessExerciseType } from "../types";

export const mindfulnessExercises: MindfulnessExerciseType[] = [
  {
    id: "body-scan",
    name: "Body Scan Meditation",
    description: "A progressive practice of bringing awareness to each part of the body to release tension.",
    duration: 10,
    focus: "Body awareness",
    color: "blue",
    steps: [
      {
        title: "Preparation",
        instruction: "Find a comfortable position lying down or sitting. Close your eyes and take a few deep breaths to settle in.",
        duration: 60
      },
      {
        title: "Feet & Legs",
        instruction: "Bring your attention to your feet. Notice any sensations - warmth, coolness, tingling, or pressure. There's no need to change anything, just observe. Then gradually move your attention up through your legs, noticing sensations in your calves, knees, and thighs.",
        duration: 120
      },
      {
        title: "Torso",
        instruction: "Shift your awareness to your abdomen, noticing the gentle rise and fall with each breath. Continue up to your chest, back, and shoulders. Are there areas of tension or relaxation? Simply observe without judgment.",
        duration: 120
      },
      {
        title: "Arms & Hands",
        instruction: "Move your attention down your arms to your hands. Notice any sensations in your shoulders, upper arms, elbows, forearms, wrists, and finally your hands and fingers.",
        duration: 90
      },
      {
        title: "Neck & Head",
        instruction: "Bring awareness to your neck, throat, and head. Notice your jaw, mouth, nose, eyes, ears, and scalp. If you find tension anywhere, acknowledge it with kindness.",
        duration: 90
      },
      {
        title: "Whole Body",
        instruction: "Now expand your awareness to sense your entire body as a whole. Feel the boundary between your body and the space around it. Notice the sense of your body as a complete, integrated whole.",
        duration: 60
      },
      {
        title: "Closing",
        instruction: "Slowly deepen your breath and gently wiggle your fingers and toes. When you feel ready, slowly open your eyes, carrying this sense of body awareness with you.",
        duration: 60
      }
    ]
  },
  {
    id: "progressive-muscle-relaxation",
    name: "Progressive Muscle Relaxation",
    description: "Systematically tense and release muscle groups to reduce physical tension and stress.",
    duration: 10,
    focus: "Tension release",
    color: "green",
    steps: [
      {
        title: "Preparation",
        instruction: "Find a comfortable position sitting or lying down. Take a few deep breaths to begin.",
        duration: 60
      },
      {
        title: "Hands & Arms",
        instruction: "Make a fist with both hands, squeezing tightly. Notice the tension in your hands and forearms. Hold for 5 seconds... and release. Feel the difference between tension and relaxation.",
        duration: 90
      },
      {
        title: "Upper Arms & Shoulders",
        instruction: "Bend your elbows and tense your biceps. Hold for 5 seconds... and release, letting your arms rest comfortably.",
        duration: 90
      },
      {
        title: "Shoulders & Neck",
        instruction: "Raise your shoulders toward your ears, creating tension. Hold... and release, letting your shoulders drop and relax completely.",
        duration: 90
      },
      {
        title: "Face",
        instruction: "Scrunch your facial muscles, squeezing your eyes shut and tensing your jaw. Hold... and release, feeling your face become smooth and relaxed.",
        duration: 90
      },
      {
        title: "Chest & Abdomen",
        instruction: "Take a deep breath, filling your lungs and tensing your chest and abdomen. Hold... and slowly exhale, releasing all tension.",
        duration: 90
      },
      {
        title: "Legs & Feet",
        instruction: "Extend your legs, point your toes, and tense all the muscles in your legs. Hold... and release, letting your legs fall gently back into place.",
        duration: 90
      },
      {
        title: "Full Body",
        instruction: "Now tense your entire body at once - hands, arms, shoulders, face, chest, abdomen, legs, and feet. Hold... and release everything, letting your body melt into complete relaxation.",
        duration: 90
      },
      {
        title: "Closing",
        instruction: "Lie or sit quietly, noticing how your body feels different now. Enjoy this state of relaxation before slowly returning to your day.",
        duration: 60
      }
    ]
  },
  {
    id: "mindful-breathing",
    name: "Mindful Breathing",
    description: "A foundational practice of bringing full attention to the physical sensations of breathing.",
    duration: 5,
    focus: "Breath",
    color: "purple",
    steps: [
      {
        title: "Getting Settled",
        instruction: "Find a comfortable seated position with your back straight but not rigid. Rest your hands on your legs and gently close your eyes.",
        duration: 60
      },
      {
        title: "Noticing Your Breath",
        instruction: "Bring your attention to your breathing. Don't try to change it - simply notice the natural rhythm. You might feel the air moving through your nostrils, the rise and fall of your chest, or the expansion of your abdomen.",
        duration: 120
      },
      {
        title: "Following the Breath",
        instruction: "Follow the complete cycle of each breath. The beginning of the inhale... the middle... and the end. Then the beginning of the exhale... the middle... and the end. Just riding the waves of your breath.",
        duration: 120
      },
      {
        title: "Returning to the Breath",
        instruction: "When your mind wanders, gently recognize that it has wandered, and kindly bring your attention back to your breathing. This is the essence of the practice - noticing when your attention has drifted and returning to the breath without judgment.",
        duration: 180
      },
      {
        title: "Expanding Awareness",
        instruction: "While maintaining awareness of your breath, expand your attention to include sensations in your whole body. Notice how your entire body subtly moves with each breath.",
        duration: 120
      },
      {
        title: "Closing the Practice",
        instruction: "Gradually broaden your awareness to include the sounds around you. When you're ready, gently open your eyes, carrying this mindful awareness with you.",
        duration: 60
      }
    ]
  },
  {
    id: "mindful-awareness",
    name: "Mindful Awareness",
    description: "Develop present-moment awareness through the methodical observation of sensory experiences.",
    duration: 5,
    focus: "Sensory awareness",
    color: "blue",
    steps: [
      {
        title: "Grounding",
        instruction: "Sit comfortably and take a few deep breaths. Feel the weight of your body against the chair or floor. Notice the points of contact where your body touches the surface beneath you.",
        duration: 60
      },
      {
        title: "Sound Awareness",
        instruction: "Open your awareness to sounds. Notice nearby sounds, distant sounds, and the quality of silence between sounds. There's no need to identify or name them, just experience them directly.",
        duration: 90
      },
      {
        title: "Body Sensations",
        instruction: "Shift your attention to physical sensations. Notice temperature, tingling, pulsing, pressure, or any other sensations present in your body right now.",
        duration: 90
      },
      {
        title: "Thought Observation",
        instruction: "Now notice your thoughts. Watch them arise, exist for a moment, and pass away, like clouds moving across the sky. Try not to get caught up in any particular thought - just observe them coming and going.",
        duration: 90
      },
      {
        title: "Emotional Awareness",
        instruction: "Become aware of any emotions present. What does this emotion feel like in your body? Is there tension, warmth, heaviness, or lightness? Notice without judgment.",
        duration: 90
      },
      {
        title: "Open Awareness",
        instruction: "Now expand to open awareness. Allow whatever is most prominent in your experience - sounds, sensations, thoughts, or emotions - to naturally enter and leave your awareness.",
        duration: 120
      },
      {
        title: "Closing",
        instruction: "Slowly bring your attention back to your breathing. Take a few deep breaths and, when you're ready, gently open your eyes.",
        duration: 60
      }
    ]
  },
  {
    id: "present-moment",
    name: "Present Moment Focus",
    description: "A short, accessible practice to anchor yourself in the present moment anytime, anywhere.",
    duration: 3,
    focus: "Present moment",
    color: "orange",
    steps: [
      {
        title: "Pause",
        instruction: "Wherever you are, whatever you're doing, just pause. Take a conscious break from autopilot.",
        duration: 30
      },
      {
        title: "Three Conscious Breaths",
        instruction: "Take three slow, deep breaths. Feel the full sensation of each inhale and exhale.",
        duration: 45
      },
      {
        title: "Five Senses Check-in",
        instruction: "Notice 5 things you can see, 4 things you can feel, 3 things you can hear, 2 things you can smell, and 1 thing you can taste. This grounds you in your direct sensory experience of the present moment.",
        duration: 120
      },
      {
        title: "Body Scan",
        instruction: "Quickly scan through your body from head to toe. Notice any areas of tension and allow them to soften with your awareness.",
        duration: 60
      },
      {
        title: "Integration",
        instruction: "Take one more deep breath and set an intention to carry this present-moment awareness into your next activity.",
        duration: 30
      }
    ]
  },
  {
    id: "loving-kindness",
    name: "Loving Kindness Meditation",
    description: "Cultivate positive emotions and compassion toward yourself and others.",
    duration: 8,
    focus: "Compassion",
    color: "purple",
    steps: [
      {
        title: "Preparation",
        instruction: "Find a comfortable position and take a few deep breaths to settle in. Place your hands over your heart if that feels comfortable.",
        duration: 60
      },
      {
        title: "Self-Kindness",
        instruction: "Bring to mind an image of yourself. Silently repeat these phrases, directing them to yourself: 'May I be safe. May I be healthy. May I be happy. May I live with ease.' Feel the intention behind the words.",
        duration: 120
      },
      {
        title: "Benefactor",
        instruction: "Now bring to mind someone who has been kind to you - someone who makes you smile just thinking about them. Direct the same wishes to them: 'May you be safe. May you be healthy. May you be happy. May you live with ease.'",
        duration: 120
      },
      {
        title: "Neutral Person",
        instruction: "Bring to mind someone you neither like nor dislike - perhaps someone you see regularly but don't know well, like a store clerk or neighbor. Send them the same wishes for well-being.",
        duration: 120
      },
      {
        title: "Difficult Person",
        instruction: "Now, if you feel ready, bring to mind someone difficult in your life. Remember they also wish to be happy and free from suffering. Send them the same wishes, even if it feels challenging.",
        duration: 120
      },
      {
        title: "All Beings",
        instruction: "Finally, expand your awareness to include all beings everywhere. 'May all beings be safe. May all beings be healthy. May all beings be happy. May all beings live with ease.'",
        duration: 120
      },
      {
        title: "Closing",
        instruction: "Return your awareness to your body and breath. Notice how you feel now compared to when you started. When you're ready, slowly open your eyes.",
        duration: 60
      }
    ]
  }
];
