/**
 * Lesson 3.4: Partially Observable Stochastic Games
 *
 * Covers: POSG definition and observation function, belief states,
 *         Dec-POMDP as special case
 * Source sections: 3.4, 3.4.1
 */

import type { LessonContentData } from '../../deep-learning-python/lessons/lesson-1-1';

const lesson: LessonContentData = {
  lessonId: 'marl-3.4',
  title: 'Partially Observable Stochastic Games',
  sections: [
    {
      id: 'marl-3.4.1',
      title: 'The POSG Model',
      content: `In a stochastic game, every agent observes the full state and the previous joint action. That is a generous assumption. In reality, a soccer-playing robot cannot see the entire field; a stock trader cannot observe every other participant's order; a card player cannot see opponents' hands. The **partially observable stochastic game (POSG)** sits at the top of the game-model hierarchy and drops the full-observability assumption.

A POSG is defined by all the same components as a stochastic game (agents, states, actions, rewards, transitions, initial state distribution) *plus* two additional elements for each agent $i$:

1. A finite set of **observations** $O_i$.
2. An **observation function** $\\mathcal{O}_i : A \\times S \\times O_i \\to [0,1]$ that assigns, for each joint action $a$ and resulting state $s$, a probability distribution over agent $i$'s possible observations.

At each time step $t$, the game is in state $s_t$. Each agent $i$ receives an observation $o_i^t$ drawn from $\\mathcal{O}_i(o_i^t \\mid a^{t-1}, s_t)$. The agent then selects an action $a_i^t$ according to its policy $\\pi_i(a_i^t \\mid h_i^t)$, where $h_i^t = (o_i^0, \\ldots, o_i^t)$ is agent $i$'s **observation history** -- the only information it has access to. Note that different agents generally have different observation histories, meaning they reason from *different information*.

The observation function is extremely flexible. It can model a limited vision field (the agent only sees nearby grid cells), unobserved actions of other agents (a robot does not directly know what action a teammate chose), noisy sensors (adding Gaussian noise to readings), or even communication (a received message is simply an observation component). This generality is what makes POSGs the most expressive model in the hierarchy.`,
      reviewCardIds: ['rc-marl-3.4-1', 'rc-marl-3.4-2'],
      illustrations: [],
    },
    {
      id: 'marl-3.4.2',
      title: 'Belief States and Filtering',
      content: `When the state is only partially observed, the current observation alone is usually not enough to choose a good action. Consider a foraging agent whose vision field does not include a valuable item to its left. It saw that item three time steps ago, but the item is not in its current observation. To act well, the agent must *remember* -- it must maintain some estimate of the unobserved parts of the state.

A **belief state** $b_i^t$ formalises this idea as a probability distribution over the possible states $s \\in S$. For a single agent (i.e., a POMDP), the initial belief equals the initial state distribution: $b_i^0 = \\mu$. After taking action $a_i^t$ and receiving observation $o_i^{t+1}$, the belief is updated via a **Bayesian posterior**:

$$b_i^{t+1}(s') \\propto \\sum_{s} b_i^t(s) \\cdot T(s' \\mid s, a_i^t) \\cdot \\mathcal{O}_i(o_i^{t+1} \\mid a_i^t, s')$$

This updated belief is an **exact sufficient statistic**: it retains all the information from the observation history that is relevant for choosing optimal actions and predicting the future. The process of updating belief states over time is called **(belief state) filtering**.

Unfortunately, maintaining exact belief states is computationally expensive. The space required to store the belief and the time required to compute each Bayesian update grow exponentially in the number of state variables. In practice, deep RL algorithms sidestep this by using **recurrent neural networks** (such as LSTMs or GRUs) to process the observation sequence. The network's hidden state learns an *approximate* compressed belief that captures relevant information about the unobserved state.`,
      reviewCardIds: ['rc-marl-3.4-3', 'rc-marl-3.4-4'],
      illustrations: [],
    },
    {
      id: 'marl-3.4.3',
      title: 'Special Cases: Stochastic Games, POMDPs, and Dec-POMDPs',
      content: `Just as stochastic games subsume repeated games and MDPs, POSGs subsume stochastic games -- and several other important models.

**Stochastic games** are the special case where each agent's observation reveals the full state and the previous joint action: $o_i^t = (s_t, a^{t-1})$. In this case the observation function is deterministic and trivial, and we recover full observability.

**POMDPs** (partially observable MDPs) are the special case of a POSG with a single agent. All the machinery of belief states, filtering, and approximate inference carries over directly.

**Dec-POMDPs** (decentralised POMDPs) are POSGs with **common rewards** -- every agent shares the same reward function $R_i = R_j$ for all $i, j$. Dec-POMDPs model purely cooperative teams that must coordinate under partial observability, such as a group of search-and-rescue robots with limited communication. They have been widely studied in the multi-agent planning literature.

The observation function in a POSG can encode a variety of information structures:

- **Unobserved actions of other agents:** $o_i^t = (s_t, a_i^{t-1})$. The agent sees the state but not what others did -- common in robot soccer, where you can see the field but not your opponents' intended moves.
- **Limited view region:** $o_i^t = (\\bar{s}_t, \\bar{a}_t)$, where $\\bar{s}$ and $\\bar{a}$ are subsets of the state and joint action within the agent's local vision field.
- **Noisy observations:** $\\mathcal{O}_i$ assigns nonzero probability to multiple observations for a given state, modelling sensor noise or unreliable communication channels.

Belief-state maintenance in multi-agent POSGs is significantly harder than in the single-agent case. Because agents cannot observe each other's observations and actions, they must also reason about *what the other agents believe and intend* -- leading to nested layers of uncertainty. In MARL, we typically bypass exact belief computation and let learned representations (such as recurrent network hidden states) serve as approximate beliefs.`,
      reviewCardIds: ['rc-marl-3.4-5'],
      illustrations: [],
    },
  ],
  summary: `**Key takeaways:**
- A POSG adds observation functions to the stochastic game model, letting each agent receive partial, noisy information about the state and other agents' actions.
- Agents condition policies on their individual observation histories, which generally differ across agents.
- Belief states provide a principled (but computationally expensive) way to estimate the hidden state; in practice, recurrent neural networks learn approximate beliefs.
- Stochastic games, POMDPs, and Dec-POMDPs are all special cases of the POSG framework.
- The POSG is the most general game model in the hierarchy and can represent limited vision, unobserved actions, noisy sensors, and unreliable communication.`,
};

export default lesson;
