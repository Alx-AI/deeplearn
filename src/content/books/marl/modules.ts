/**
 * Module definitions for the Multi-Agent Reinforcement Learning book.
 *
 * 9 modules covering the complete "Multi-Agent Reinforcement Learning:
 * Foundations and Modern Approaches" curriculum, mapping the book's
 * 11 chapters (Ch 7+8 merged, Ch 10+11 merged).
 */

import type { Module } from '@/lib/db/schema';

export const modules: Module[] = [
  {
    id: 'marl-mod-1',
    title: 'Introduction to Multi-Agent Systems',
    description:
      'Understand what multi-agent systems are, why they matter, and how MARL combines reinforcement learning with multi-agent interaction — plus a tour of real-world applications.',
    order: 1,
    lessonIds: [
      'marl-1.1', 'marl-1.2', 'marl-1.3', 'marl-1.4',
    ],
  },
  {
    id: 'marl-mod-2',
    title: 'Single-Agent Reinforcement Learning',
    description:
      'Build the single-agent RL foundation: MDPs, value functions, Bellman equations, dynamic programming, and temporal-difference methods (Sarsa, Q-learning).',
    order: 2,
    lessonIds: [
      'marl-2.1', 'marl-2.2', 'marl-2.3', 'marl-2.4',
      'marl-2.5', 'marl-2.6', 'marl-2.7',
    ],
  },
  {
    id: 'marl-mod-3',
    title: 'Game Theory Foundations',
    description:
      'Master the formal models of multi-agent interaction: normal-form games, repeated games, stochastic games, partially observable stochastic games, and the bridge between RL and game theory.',
    order: 3,
    lessonIds: [
      'marl-3.1', 'marl-3.2', 'marl-3.3',
      'marl-3.4', 'marl-3.5', 'marl-3.6',
    ],
  },
  {
    id: 'marl-mod-4',
    title: 'Solution Concepts for Games',
    description:
      'Explore how rational agents should behave: best response, Nash equilibrium, correlated equilibrium, Pareto optimality, social welfare, no-regret learning, and the computational complexity of finding equilibria.',
    order: 4,
    lessonIds: [
      'marl-4.1', 'marl-4.2', 'marl-4.3', 'marl-4.4',
      'marl-4.5', 'marl-4.6', 'marl-4.7', 'marl-4.8',
    ],
  },
  {
    id: 'marl-mod-5',
    title: 'MARL First Steps and Challenges',
    description:
      'Understand the core challenges that make multi-agent learning harder than single-agent RL: non-stationarity, credit assignment, equilibrium selection, and the landscape of central vs. independent learning.',
    order: 5,
    lessonIds: [
      'marl-5.1', 'marl-5.2', 'marl-5.3', 'marl-5.4',
      'marl-5.5', 'marl-5.6', 'marl-5.7',
    ],
  },
  {
    id: 'marl-mod-6',
    title: 'Foundational MARL Algorithms',
    description:
      'Study the classic MARL algorithms: minimax-Q, Nash-Q, fictitious play, joint-action learners, policy gradient methods for games, WoLF, and regret matching.',
    order: 6,
    lessonIds: [
      'marl-6.1', 'marl-6.2', 'marl-6.3', 'marl-6.4', 'marl-6.5',
      'marl-6.6', 'marl-6.7', 'marl-6.8', 'marl-6.9', 'marl-6.10',
    ],
  },
  {
    id: 'marl-mod-7',
    title: 'Deep Learning and Deep RL',
    description:
      'Bridge to modern MARL by mastering function approximation, neural networks, DQN, policy gradient theorem, REINFORCE, and actor-critic methods (A2C, PPO).',
    order: 7,
    lessonIds: [
      'marl-7.1', 'marl-7.2', 'marl-7.3', 'marl-7.4', 'marl-7.5',
      'marl-7.6', 'marl-7.7', 'marl-7.8', 'marl-7.9',
    ],
  },
  {
    id: 'marl-mod-8',
    title: 'Multi-Agent Deep Reinforcement Learning',
    description:
      'Master modern deep MARL: centralised training with decentralised execution (CTDE), multi-agent policy gradients, value decomposition (VDN, QMIX), agent modelling, parameter sharing, self-play, and population-based training.',
    order: 8,
    lessonIds: [
      'marl-8.1', 'marl-8.2', 'marl-8.3', 'marl-8.4', 'marl-8.5',
      'marl-8.6', 'marl-8.7', 'marl-8.8', 'marl-8.9', 'marl-8.10',
    ],
  },
  {
    id: 'marl-mod-9',
    title: 'MARL in Practice and Environments',
    description:
      'Put it all together: implementing the agent-environment interface, practical tips for training and evaluation, presenting results, and a survey of multi-agent environments.',
    order: 9,
    lessonIds: [
      'marl-9.1', 'marl-9.2', 'marl-9.3', 'marl-9.4',
    ],
  },
];
