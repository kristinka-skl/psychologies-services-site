import { Psychologist } from '@/app/types/psychologist';

export const psychologists: Psychologist[] = [
  {
    id: 'sarah-davis',
    name: 'Dr. Sarah Davis',
    avatar_url: 'https://i.pravatar.cc/200?img=47',
    experience: '12 years',
    reviews: [
      {
        reviewer: 'Michael Brown',
        rating: 4.5,
        comment:
          'Dr. Davis has been a great help in managing my depression.',
      },
      {
        reviewer: 'Linda Johnson',
        rating: 5,
        comment:
          "I'm very satisfied with Dr. Davis's therapy approach and empathy.",
      },
    ],
    price_per_hour: 120,
    rating: 4.75,
    license: 'Licensed Psychologist (License #67890)',
    specialization: 'Depression and Mood Disorders',
    initial_consultation: 'Free 45-minute initial consultation',
    about:
      'Dr. Sarah Davis is a highly experienced and licensed psychologist specializing in Depression and Mood Disorders. She helps clients build practical routines and emotional regulation tools for long-term stability.',
  },
  {
    id: 'mark-thompson',
    name: 'Dr. Mark Thompson',
    avatar_url: 'https://i.pravatar.cc/200?img=12',
    experience: '20 years',
    reviews: [
      {
        reviewer: 'Emma Collins',
        rating: 4.8,
        comment:
          'Dr. Thompson helped me improve communication in my relationship.',
      },
    ],
    price_per_hour: 180,
    rating: 4.7,
    license: 'Licensed Psychologist (License #54321)',
    specialization: 'Relationship Counseling',
    initial_consultation: 'Free 60-minute initial consultation',
    about:
      'Dr. Mark Thompson specializes in relationship counseling and conflict resolution. His sessions focus on practical, respectful communication and healthy boundary setting.',
  },
  {
    id: 'lisa-anderson',
    name: 'Dr. Lisa Anderson',
    avatar_url: 'https://i.pravatar.cc/200?img=5',
    experience: '18 years',
    reviews: [
      {
        reviewer: 'Sophia Reed',
        rating: 4.9,
        comment: 'A very calm and structured trauma-informed approach.',
      },
    ],
    price_per_hour: 160,
    rating: 4.8,
    license: 'Licensed Psychologist (License #98765)',
    specialization: 'Trauma and PTSD',
    initial_consultation: 'Free 30-minute initial consultation',
    about:
      'Dr. Lisa Anderson works with trauma and PTSD using evidence-based therapeutic methods. She creates a safe, predictable environment where clients can process difficult experiences.',
  },
  {
    id: 'oliver-nguyen',
    name: 'Dr. Oliver Nguyen',
    avatar_url: 'https://i.pravatar.cc/200?img=14',
    experience: '9 years',
    reviews: [
      {
        reviewer: 'Chris Walker',
        rating: 4.6,
        comment: 'Very practical sessions with clear weekly goals.',
      },
    ],
    price_per_hour: 95,
    rating: 4.6,
    license: 'Licensed Psychologist (License #55213)',
    specialization: 'Stress Management',
    initial_consultation: 'Free 30-minute initial consultation',
    about:
      'Dr. Oliver Nguyen helps clients manage stress and burnout. His style combines emotional support and skill-based techniques for daily resilience.',
  },
  {
    id: 'amanda-lopez',
    name: 'Dr. Amanda Lopez',
    avatar_url: 'https://i.pravatar.cc/200?img=32',
    experience: '11 years',
    reviews: [
      {
        reviewer: 'Nina Foster',
        rating: 4.7,
        comment: 'Great support with anxiety and panic triggers.',
      },
    ],
    price_per_hour: 140,
    rating: 4.72,
    license: 'Licensed Psychologist (License #66104)',
    specialization: 'Anxiety Disorders',
    initial_consultation: 'Free 40-minute initial consultation',
    about:
      'Dr. Amanda Lopez supports clients with anxiety and panic symptoms. She emphasizes clear psychoeducation, coping plans, and steady confidence building.',
  },
  {
    id: 'daniel-cole',
    name: 'Dr. Daniel Cole',
    avatar_url: 'https://i.pravatar.cc/200?img=64',
    experience: '15 years',
    reviews: [
      {
        reviewer: 'Jason Hall',
        rating: 4.8,
        comment: 'Insightful and very focused on practical outcomes.',
      },
    ],
    price_per_hour: 130,
    rating: 4.68,
    license: 'Licensed Psychologist (License #32981)',
    specialization: 'Career and Life Transitions',
    initial_consultation: 'Free 45-minute initial consultation',
    about:
      'Dr. Daniel Cole focuses on major life and career transitions. He guides clients through uncertainty with structured planning and self-awareness techniques.',
  },
];

