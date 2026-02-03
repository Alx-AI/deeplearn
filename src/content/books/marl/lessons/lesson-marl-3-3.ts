/**
 * Lesson 3.3: Stochastic Games
 *
 * Covers: Stochastic game definition, MDPs and repeated games as
 *         special cases, joint actions and transitions
 * Source sections: 3.3
 */

import type { LessonContentData } from '../../deep-learning-python/lessons/lesson-1-1';

const lesson: LessonContentData = {
  lessonId: 'marl-3.3',
  title: 'Stochastic Games',
  sections: [
    {
      id: 'marl-3.3.1',
      title: 'Adding State to Multi-Agent Interaction',
      content: `Normal-form games -- even repeated ones -- lack a notion of evolving environment state. In reality, agents act *within* an environment that changes as a result of their actions: robots navigate a warehouse, autonomous vehicles share a highway, or traders influence market prices. **Stochastic games** (also called **Markov games**) extend repeated games by introducing states and probabilistic transitions, bringing us much closer to the full multi-agent systems described in Chapter 1.

A stochastic game is defined by the following components:

1. A finite set of **agents** $I = \\{1, \\ldots, n\\}$.
2. A finite set of **states** $S$, with a subset of **terminal states** $\\bar{S}$ that end the game.
3. For each agent $i$, a finite set of **actions** $A_i$, with joint action space $A = A_1 \\times \\cdots \\times A_n$.
4. For each agent $i$, a **reward function** $R_i : S \\times A \\times S \\to \\mathbb{R}$.
5. A **state transition function** $T : S \\times A \\times S \\to [0,1]$ giving the probability $T(s' \\mid s, a)$ of transitioning to state $s'$ given current state $s$ and joint action $a$.
6. An **initial state distribution** $\\mu$ over $S$ (with zero probability on terminal states).

The game starts in an initial state $s_0$ sampled from $\\mu$. At each time step $t$, every agent observes the current state $s_t$ and independently selects an action. The resulting joint action $a_t = (a_1^t, \\ldots, a_n^t)$ determines both the rewards and the next state $s_{t+1}$, sampled from $T(s_{t+1} \\mid s_t, a_t)$. The game continues until a terminal state is reached, a maximum horizon $T$ is exceeded, or indefinitely in non-terminating settings.`,
      reviewCardIds: ['rc-marl-3.3-1', 'rc-marl-3.3-2'],
      illustrations: [],
    },
    {
      id: 'marl-3.3.2',
      title: 'The Markov Property and Full Observability',
      content: `Like MDPs, stochastic games satisfy the **Markov property**: the probability of the next state and reward depends only on the current state and joint action, not on earlier history. Formally:

$$\\Pr(s_{t+1}, r^t \\mid s_t, a_t, s_{t-1}, a_{t-1}, \\ldots, s_0, a_0) = \\Pr(s_{t+1}, r^t \\mid s_t, a_t)$$

This is what makes "stochastic game" and "Markov game" synonymous terms. The Markov property is a powerful simplification: agents do not need the full history to make optimal decisions -- the current state contains all relevant information.

Stochastic games also assume **full observability**: every agent can see the current state $s_t$ and the previous joint action $a_{t-1}$. In practice, policies are conditioned on the full **state-action history** $h_t = (s_0, a_0, s_1, a_1, \\ldots, s_t)$. Because of the Markov property, the current state $s_t$ is in principle sufficient for decision-making, but conditioning on the full history can still be useful in practice -- for example, to model the behaviour of other agents.

To make this concrete, consider the **level-based foraging** environment. The state is a vector encoding the grid positions of all agents and items, plus binary flags indicating which items have been collected. Actions include moving in the four compass directions, collecting an item, or doing nothing. When two agents jointly collect an item, the transition function flips the item's flag. In a common-reward version, every agent gets +1 whenever any item is collected; in a general-sum version, only the agents who participated in the collection receive the reward.`,
      reviewCardIds: ['rc-marl-3.3-3'],
      illustrations: [],
    },
    {
      id: 'marl-3.3.3',
      title: 'Special Cases: MDPs and Repeated Games',
      content: `One of the most elegant aspects of the stochastic game framework is that it **unifies** several models we have already seen as special cases.

**Repeated normal-form games** are stochastic games with exactly one state. When $|S| = 1$ and there are no terminal states, the transition function is trivial (the single state always transitions to itself), and the reward depends only on the joint action. We recover the repeated normal-form game. Each state in a general stochastic game can be viewed as hosting its own normal-form game with rewards $R_i(s, \\cdot)$, and the transition function links these one-shot games together into a sequential process. This is why normal-form games are called the "basic building block" of stochastic games.

**Markov decision processes (MDPs)** are stochastic games with exactly one agent. When $|I| = 1$, the joint action reduces to a single action, and we recover the standard MDP from single-agent RL. Everything we learned about value functions, Bellman equations, and policy optimization in Chapter 2 applies directly as a special case.

This hierarchy is clean and powerful:

- Normal-form game: $n$ agents, 1 state, 1 time step
- Repeated normal-form game: $n$ agents, 1 state, $T$ time steps
- MDP: 1 agent, $m$ states, $T$ time steps
- Stochastic game: $n$ agents, $m$ states, $T$ time steps

The classification of reward structures -- zero-sum, common-reward, and general-sum -- carries over from normal-form games to stochastic games without modification. A stochastic game is zero-sum if the agents' rewards sum to zero at every state and joint action; it is common-reward if all agents share the same reward function.

Finally, while our formal definition assumes finite states and actions (following Shapley's 1953 original formulation), stochastic games can be extended analogously to continuous state and action spaces, just as MDPs can.`,
      reviewCardIds: ['rc-marl-3.3-4', 'rc-marl-3.3-5'],
      illustrations: [],
    },
  ],
  summary: `**Key takeaways:**
- Stochastic games extend normal-form games with states, probabilistic transitions, and multi-step interaction -- bridging the gap between game theory and RL.
- They satisfy the Markov property: the next state depends only on the current state and joint action, not on earlier history.
- Full observability means every agent sees the complete state and previous joint action.
- MDPs are stochastic games with one agent; repeated normal-form games are stochastic games with one state.
- The zero-sum / common-reward / general-sum classification applies to stochastic games just as it does to normal-form games.`,
};

export default lesson;
