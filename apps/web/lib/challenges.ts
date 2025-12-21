export type ChallengeType = 'physical' | 'mental' | 'hydration' | 'stretch';

export interface Challenge {
  id: string;
  type: ChallengeType;
  title: string;
  description: string;
  xpReward: number;
}

const challenges: Challenge[] = [
  {
    id: '1',
    type: 'physical',
    title: 'Série de Flexões',
    description: 'Faça 15 flexões para despertar seu corpo',
    xpReward: 50,
  },
  {
    id: '2',
    type: 'physical',
    title: 'Corrida Rápida',
    description: 'Caminhe ou corra por 5 minutos',
    xpReward: 50,
  },
  {
    id: '3',
    type: 'mental',
    title: 'Meditação Rápida',
    description: 'Faça 3 minutos de meditação ou respiração profunda',
    xpReward: 40,
  },
  {
    id: '4',
    type: 'mental',
    title: 'Puzzle Rápido',
    description: 'Resolva um quebra-cabeça ou jogo de lógica',
    xpReward: 45,
  },
  {
    id: '5',
    type: 'hydration',
    title: 'Beba Água',
    description: 'Beba um copo de água para se manter hidratado',
    xpReward: 30,
  },
  {
    id: '6',
    type: 'hydration',
    title: 'Chá Relaxante',
    description: 'Prepare uma xícara de chá para relaxar',
    xpReward: 35,
  },
  {
    id: '7',
    type: 'stretch',
    title: 'Alongamento Rápido',
    description: 'Faça 10 movimentos de alongamento leve',
    xpReward: 35,
  },
  {
    id: '8',
    type: 'stretch',
    title: 'Yoga Rápida',
    description: 'Faça 5 minutos de yoga ou pilates',
    xpReward: 45,
  },
];

export function getRandomChallenge(): Challenge {
  const randomIndex = Math.floor(Math.random() * challenges.length);
  return challenges[randomIndex]!;
}

export function getChallengeById(id: string): Challenge | undefined {
  return challenges.find((challenge) => challenge.id === id);
}
