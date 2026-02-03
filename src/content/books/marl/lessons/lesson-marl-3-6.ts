/**
 * Lesson 3.6: From RL to Game Theory: A Dictionary
 *
 * Covers: Mapping RL concepts to game theory, model hierarchy,
 *         key modelling choices
 * Source sections: 3.7, 3.8
 */

import type { LessonContentData } from '../../deep-learning-python/lessons/lesson-1-1';

const lesson: LessonContentData = {
  lessonId: 'marl-3.6',
  title: 'From RL to Game Theory: A Dictionary',
  sections: [
    {
      id: 'marl-3.6.1',
      title: 'Translating Between Two Vocabularies',
      content: `Multi-agent reinforcement learning sits at the intersection of two mature fields -- reinforcement learning and game theory -- that developed independently and use different terminology for overlapping concepts. Since this course uses RL terminology as its primary language, it is important to build a mental "dictionary" so you can read game-theory papers without getting lost.

Here are the key correspondences:

| RL term (this course) | Game theory term | Meaning |
|---|---|---|
| **environment** | game | The model specifying actions, observations, rewards, and dynamics |
| **agent** | player | An entity that makes decisions |
| **reward** | payoff / utility | Scalar value received after acting |
| **policy** | strategy | Function assigning probabilities to actions |
| **deterministic** X | **pure** X | X assigns probability 1 to a single option (e.g., deterministic policy = pure strategy) |
| **probabilistic** X | **mixed** X | X assigns probabilities across multiple options (e.g., probabilistic policy = mixed strategy) |
| **joint** X | X **profile** | A tuple with one element per agent (e.g., joint policy = strategy profile) |

A few subtleties are worth noting. In game theory, "strategy" sometimes refers to what we call an action (a specific choice), not a policy (a distribution over choices). The phrase "pure strategy" often means a single action, whereas "mixed strategy" means a probability distribution. In RL, we keep these separate: an action is a concrete choice, a policy maps states (or histories) to distributions over actions, and a deterministic policy always selects one action with certainty.

Keeping this dictionary in mind will make the transition between the two literatures much smoother. When you see "Nash equilibrium in mixed strategies," you can mentally translate it to "Nash equilibrium in probabilistic policies."`,
      reviewCardIds: ['rc-marl-3.6-1', 'rc-marl-3.6-2'],
      illustrations: [],
    },
    {
      id: 'marl-3.6.2',
      title: 'The Game Model Hierarchy',
      content: `Chapter 3 has introduced a hierarchy of game models, each one generalising the last. Let us consolidate the full picture.

At the base sits the **normal-form game**: $n$ agents, one simultaneous interaction, no state. Moving up, the **repeated normal-form game** replays the same one-shot game over $T$ time steps, adding history-dependent policies but still no evolving state.

The **stochastic game** introduces a finite state space $S$ with probabilistic transitions $T(s' \\mid s, a)$, reward functions that depend on states, and full observability. It subsumes both repeated normal-form games (set $|S| = 1$) and MDPs (set $|I| = 1$).

At the top sits the **POSG**, which adds per-agent observation functions and removes the assumption that agents can see the full state. It subsumes stochastic games (set observations equal to $(s_t, a^{t-1})$), POMDPs (set $|I| = 1$), and Dec-POMDPs (POSG with common rewards).

This hierarchy is not just a taxonomy -- it is a practical guide for modelling. When you face a new multi-agent problem, ask yourself:

- **How many agents?** One agent gives an MDP or POMDP. Multiple agents require a game model.
- **Is there state?** If the interaction is a single simultaneous move, a normal-form game suffices. If the environment evolves over time, use a stochastic game or POSG.
- **Is the state fully observed?** If yes, a stochastic game works. If agents have limited or noisy perception, you need a POSG.
- **What is the reward structure?** Zero-sum, common-reward, or general-sum? This determines which solution concepts and algorithms apply.`,
      reviewCardIds: ['rc-marl-3.6-3', 'rc-marl-3.6-4'],
      illustrations: [],
    },
    {
      id: 'marl-3.6.3',
      title: 'Key Modelling Choices and Looking Ahead',
      content: `Choosing the right game model is just the first step. Several additional modelling decisions shape how a MARL problem is formulated and solved.

**Simultaneous vs. sequential moves.** All game models in this chapter assume agents choose actions simultaneously. An alternative family called **extensive-form games** models agents taking turns (as in chess or poker). We focus on simultaneous-move games because most MARL research uses them and they are a more natural extension of MDP-based RL. Transformations between the two formulations are possible.

**Finite vs. infinite horizon.** Games can run for a fixed number of steps, terminate upon reaching certain states, or continue indefinitely with a discount factor. The choice affects which equilibria exist and how agents value future rewards.

**Knowledge assumptions.** As discussed in Section 3.5, most MARL algorithms assume agents know very little about the game. But some algorithms for zero-sum or common-reward settings do exploit knowledge of the reward structure. The degree of knowledge is a design parameter, not a fixed rule.

**Communication.** Including communication actions in the model lets agents exchange information, but also increases the action space and the complexity of learning. Whether to include communication -- and how to structure it -- is an important modelling choice.

This chapter has focused on *defining* multi-agent interaction models. Notably, we have not yet said what it means for agents to act **optimally** in these settings. That is the subject of Chapter 4, where we will introduce **solution concepts** -- formal definitions of desirable outcomes in games. The most famous is the Nash equilibrium, but there are many others, each capturing a different notion of "good" behaviour for the agents.

Many of the key dimensions of MARL -- number of agents, observability, reward structure, communication -- are determined by the game specification. A complete MARL learning problem is given by the combination of a game model and a learning objective (solution concept), and the algorithms in Part II of this course will show how to solve such problems.`,
      reviewCardIds: ['rc-marl-3.6-5'],
      illustrations: [],
    },
  ],
  summary: `**Key takeaways:**
- RL and game theory share many concepts but use different terms: environment/game, agent/player, reward/payoff, policy/strategy, deterministic/pure, probabilistic/mixed, joint/profile.
- The game-model hierarchy runs from normal-form games (simplest) through repeated games and stochastic games up to POSGs (most general).
- Key modelling choices include simultaneous vs. sequential moves, finite vs. infinite horizon, knowledge assumptions, and whether to include communication.
- This chapter defined models of interaction but not what it means to solve them -- Chapter 4 will introduce solution concepts like Nash equilibrium.
- A complete MARL problem combines a game model with a learning objective; the algorithms in later chapters show how to find good policies.`,
};

export default lesson;
