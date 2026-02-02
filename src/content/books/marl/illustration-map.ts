/**
 * Illustration map for Multi-Agent Reinforcement Learning.
 *
 * Maps string IDs (used in lesson content's `illustrations` arrays) to React
 * components that render the corresponding SVG diagram.
 */

import type { IllustrationMap } from '../deep-learning-python/illustration-map';

import MASComponentsDiagram from '@/components/illustrations/MASComponentsDiagram';
import JointActionExplosionDiagram from '@/components/illustrations/JointActionExplosionDiagram';
import LBFGridDiagram from '@/components/illustrations/LBFGridDiagram';
import MARLTrainingLoopDiagram from '@/components/illustrations/MARLTrainingLoopDiagram';
import RewardSpectrumDiagram from '@/components/illustrations/RewardSpectrumDiagram';
import CTDEParadigmDiagram from '@/components/illustrations/CTDEParadigmDiagram';
import WarehouseRobotsDiagram from '@/components/illustrations/WarehouseRobotsDiagram';
import GameAITimelineDiagram from '@/components/illustrations/GameAITimelineDiagram';
import MARLChallengesDiagram from '@/components/illustrations/MARLChallengesDiagram';
import BookRoadmapDiagram from '@/components/illustrations/BookRoadmapDiagram';

const illustrationMap: IllustrationMap = {
  // Module 1: Introduction to Multi-Agent Systems
  'mas-components': MASComponentsDiagram,
  'joint-action-explosion': JointActionExplosionDiagram,
  'lbf-grid': LBFGridDiagram,
  'marl-training-loop': MARLTrainingLoopDiagram,
  'reward-spectrum': RewardSpectrumDiagram,
  'ctde-paradigm': CTDEParadigmDiagram,
  'warehouse-robots': WarehouseRobotsDiagram,
  'game-ai-timeline': GameAITimelineDiagram,
  'marl-challenges': MARLChallengesDiagram,
  'book-roadmap': BookRoadmapDiagram,
};

export default illustrationMap;
