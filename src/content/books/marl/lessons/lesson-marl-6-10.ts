/**
 * Lesson 6.10: Chapter Integration: Algorithm Landscape
 *
 * Covers: Algorithm taxonomy, convergence landscape, motivation for deep MARL
 * Source sections: 6.6
 */

import type { LessonContentData } from '../../deep-learning-python/lessons/lesson-1-1';

const lesson: LessonContentData = {
  lessonId: 'marl-6.10',
  title: 'Chapter Integration: Algorithm Landscape',
  sections: [
    {
      id: 'marl-6.10.1',
      title: 'A Taxonomy of Foundational MARL Algorithms',
      content: `
Chapter 6 has introduced four major families of foundational MARL algorithms. Let us step back and organize them into a coherent picture.

**1. Joint-Action Learning with Game Theory (JAL-GT).** These algorithms learn joint-action Q-values $Q_i(s, a_1, \\ldots, a_n)$ and solve stage games using game-theoretic solution concepts. Three instantiations differ in their choice of solver:
- **Minimax-Q**: Uses minimax, applies to zero-sum games, converges under standard conditions.
- **Nash-Q**: Uses Nash equilibrium, applies to general-sum games, but requires very restrictive conditions (global optima or saddle points in all stage games).
- **Correlated-Q**: Uses correlated equilibrium (LP-solvable), but has no formal convergence guarantees.

**2. Joint-Action Learning with Agent Modeling (JAL-AM).** These algorithms learn models of other agents' policies and compute best responses. Key variants:
- **Fictitious play**: Empirical frequency models, best-response actions, convergence in several game classes.
- **JAL-AM**: Extends fictitious play to stochastic games via TD learning.
- **Bayesian/VI methods**: Maintain uncertainty over agent models, optimally trade off exploration and exploitation.

**3. Policy-Based Learning.** These algorithms directly optimize parameterized policies via gradient ascent:
- **IGA**: Infinitesimal gradient ascent; guarantees average-reward convergence but policies may cycle.
- **WoLF-IGA**: Variable learning rates; guarantees policy convergence in 2x2 games.
- **WoLF-PHC**: Practical extension to general stochastic games using Q-learning and average policies.
- **GIGA**: Generalized IGA achieving no-regret for $n$ agents and actions.

**4. No-Regret Learning.** These algorithms minimize different notions of regret:
- **Unconditional regret matching**: Converges to coarse correlated equilibrium.
- **Conditional regret matching**: Converges to correlated equilibrium.
- **CFR**: Extends regret matching to extensive-form games (used in poker solvers).
`,
      reviewCardIds: ['rc-marl-6.10-1', 'rc-marl-6.10-2'],
      illustrations: [],
    },
    {
      id: 'marl-6.10.2',
      title: 'The Convergence Landscape',
      content: `
Each algorithm family targets different solution concepts and offers different convergence guarantees. Understanding these tradeoffs is essential for choosing the right algorithm.

**Convergence type matters.** We have seen three types of convergence (from Chapter 5):
- **Policy convergence** (strongest): The actual policies converge to an equilibrium. Achieved by WoLF-IGA (in 2x2 games) and fictitious play (in certain game classes).
- **Empirical convergence**: The empirical distribution of actions converges to an equilibrium set. Achieved by regret matching and fictitious play.
- **Average reward convergence** (weakest): The time-averaged rewards converge to equilibrium values. Achieved by IGA.

**Game class matters.** No single algorithm works well everywhere:
- Zero-sum games are "easiest": Minimax-Q converges, fictitious play converges, and regret matching converges. The minimax value is unique, eliminating equilibrium selection.
- General-sum games are hard: Nash-Q needs unrealistic assumptions, correlated-Q has no guarantees, and JAL-GT fundamentally cannot solve NoSDE games.
- For normal-form games, fictitious play and regret matching are often sufficient. For stochastic games, TD-based methods (JAL-GT, JAL-AM, WoLF-PHC) are needed.

**Information requirements vary.** JAL-GT needs all agents' rewards and actions. JAL-AM needs only agent $i$'s reward but all agents' actions. WoLF-PHC needs only agent $i$'s reward and does not need to observe actions (it uses its own Q-values). Independent Q-learning needs the least information but has the weakest guarantees.

A recurring theme: **stronger guarantees require stronger assumptions.** Minimax-Q has the strongest convergence guarantee but only applies to zero-sum games. WoLF-PHC applies broadly but lacks formal guarantees in the general case. This tension between generality and guaranteed performance is a fundamental challenge in MARL.
`,
      reviewCardIds: ['rc-marl-6.10-3', 'rc-marl-6.10-4'],
      illustrations: [],
    },
    {
      id: 'marl-6.10.3',
      title: 'Motivation for Deep MARL',
      content: `
The foundational algorithms in this chapter have laid the intellectual groundwork for MARL, but they face serious scalability challenges that motivate the deep learning approaches in Part II of the book.

**The curse of dimensionality.** All the tabular algorithms we have studied -- JAL-GT, JAL-AM, WoLF-PHC, regret matching -- maintain tables indexed by states, actions, or state-action pairs. Real-world problems have continuous state spaces (robot joint angles, pixel observations), continuous action spaces (motor torques), and potentially thousands of agents. Tabular methods cannot scale to these settings.

**Partial observability.** We assumed throughout this chapter that agents can fully observe the environment state and (in many cases) other agents' actions. Real-world agents typically have **partial observations** -- a camera image, a local sensor reading. The algorithms in this chapter do not handle the POSG (Partially Observable Stochastic Game) model.

**Function approximation.** Deep learning provides a natural solution to both problems. Neural networks can approximate Q-functions, policies, and agent models over continuous, high-dimensional spaces. This is the same insight that transformed single-agent RL (from tabular Q-learning to DQN, from REINFORCE to PPO), now applied to the multi-agent setting.

**The bridge.** The foundational concepts from this chapter -- joint-action values, agent modeling, policy gradients, regret minimization -- all reappear in deep MARL but implemented with neural networks. Deep JAL-GT becomes multi-agent deep Q-networks. Deep agent modeling uses recurrent networks to predict opponent behavior. Deep policy gradients become multi-agent PPO and MAPPO. Deep CFR uses neural networks to scale counterfactual regret minimization.

Part I of the textbook is now complete. We have established the mathematical foundations (game models, solution concepts) and the algorithmic foundations (JAL-GT, JAL-AM, policy gradients, no-regret learning). Part II will show how these ideas combine with deep learning to tackle problems of extraordinary scale and complexity -- from StarCraft to autonomous driving to language model alignment.
`,
      reviewCardIds: ['rc-marl-6.10-5'],
      illustrations: [],
    },
  ],
  summary: `**Key takeaways:**
- Four foundational algorithm families: JAL-GT (game-theoretic solvers), JAL-AM (agent modeling + best response), policy-based learning (gradient ascent with WoLF), and no-regret learning (regret matching and CFR).
- Stronger convergence guarantees require stronger assumptions: Minimax-Q converges but only in zero-sum; WoLF-PHC is general but lacks formal guarantees.
- Three convergence types (policy, empirical, average-reward) describe increasingly weaker forms of convergence to equilibria.
- Tabular methods face the curse of dimensionality and cannot handle partial observability, motivating deep MARL.
- The foundational concepts from this chapter -- joint-action values, agent modeling, policy gradients, regret minimization -- all reappear in deep MARL implemented with neural networks.`,
};

export default lesson;
