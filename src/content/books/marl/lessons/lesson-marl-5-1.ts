/**
 * Lesson 5.1: The General Multi-Agent Learning Process
 *
 * Covers: The MARL learning loop, how transitions and rewards depend on all agents,
 * the moving target problem
 * Source sections: 5.1
 */

import type { LessonContentData } from '../../deep-learning-python/lessons/lesson-1-1';

const lesson: LessonContentData = {
  lessonId: 'marl-5.1',
  title: 'The General Multi-Agent Learning Process',
  sections: [
    {
      id: 'marl-5.1.1',
      title: 'The MARL Learning Loop',
      content: `
Having introduced game models (Chapter 3) and solution concepts (Chapter 4), we now turn to the core question: how do agents actually *learn* solutions for games? The answer lies in **reinforcement learning** (RL), where agents repeatedly try actions, observe outcomes, and receive rewards across multiple **episodes** -- independent runs of a game starting from some initial state.

The general MARL learning process has four elements, each playing a distinct role:

**Game model:** The multi-agent environment defining how agents interact. This could be a non-repeated normal-form game, a repeated normal-form game, a stochastic game, or a partially observable stochastic game (POSG). The choice of game model determines what agents observe and how their policies are conditioned -- on full states, action histories, or local observation histories.

**Data:** A set of **z histories**, written **D_z = {h^e_t | e = 1, ..., z}**. Each history h^e_t was produced by whatever joint policy pi^e the agents used during episode e. Histories may vary in length and may or may not end in terminal states. Typically D_z includes the history from the current ongoing episode plus all histories from previous episodes.

**Learning algorithm:** The algorithm **L** takes the current data D_z and the current joint policy pi^z and produces an updated joint policy: **pi^{z+1} = L(D_z, pi^z)**. The initial joint policy pi^0 is typically random.

**Learning goal:** A joint policy **pi*** that satisfies the properties of a chosen solution concept -- for example, a Nash equilibrium.

Think of this as a loop: the joint policy generates data, the learning algorithm uses that data to update the policy, and the process repeats. In the Level-Based Foraging (LBF) environment, this means the three robots explore the grid, collect items, and gradually refine their coordination strategy episode after episode.
`,
      reviewCardIds: ['rc-marl-5.1-1', 'rc-marl-5.1-2'],
      illustrations: [],
    },
    {
      id: 'marl-5.1.2',
      title: 'How Transitions and Rewards Depend on All Agents',
      content: `
A defining feature of MARL is that each agent's experience is shaped not only by its own actions but by the actions of *every* agent. This is what makes the learning process fundamentally different from single-agent RL.

Consider the state transition function in a stochastic game: **T(s' | s, a)**, where **a = (a_1, ..., a_n)** is the **joint action** of all n agents. The next state s' depends on what *all* agents do simultaneously. In Level-Based Foraging, whether an item gets collected depends on which agents are adjacent to it and whether they all choose the "collect" action at the same time step. Agent 1 deciding to collect is meaningless if Agent 2 wanders away.

Similarly, the reward function for each agent i is **R_i(s, a, s')** -- it depends on the full joint action, not just agent i's individual action. When the two LBF agents successfully collaborate to collect the level-2 item, they both receive a reward. But if only one attempts to collect while the other is absent, neither gets anything.

The learning algorithm L may itself consist of **multiple sub-algorithms**, one per agent: L_1, L_2, ..., L_n. Each sub-algorithm L_i may use different portions of the shared data D_z, or maintain its own private data D^z_i. This is especially relevant in **independent learning** (which we will explore in lesson 5.3), where each agent learns using only its own observations, actions, and rewards.

There is one more crucial nuance: because the learning agents are *actively exploring*, they influence the very data they learn from. Unlike supervised learning where a dataset is fixed, in RL the policies produced by the learning algorithm actively randomize over actions to generate useful data. In MARL, this exploration interacts across agents -- Agent 1's exploration changes the data Agent 2 sees, and vice versa. This circular dependency is at the heart of what makes MARL challenging.
`,
      reviewCardIds: ['rc-marl-5.1-3', 'rc-marl-5.1-4'],
      illustrations: [],
    },
    {
      id: 'marl-5.1.3',
      title: 'The Moving Target Problem',
      content: `
Even in single-agent RL, learning creates a subtle difficulty known as the **moving target problem**. When an agent uses temporal-difference methods to learn action values Q(s, a), the update target -- something like r + gamma * Q(s', a') -- depends on value estimates that are themselves changing as the policy improves. The target is literally moving as you try to hit it.

In MARL, this problem is dramatically **amplified**. From the perspective of any individual agent i, the other agents' policies pi_j (for all j != i) become part of the apparent environment dynamics. Specifically, the effective transition function that agent i perceives is:

**T_i(s' | s, a_i) proportional to SUM over a_{-i} of T(s' | s, <a_i, a_{-i}>) * PRODUCT of pi_j(a_j | s)**

This equation says that the transition probability agent i experiences depends on the policies of *all other agents*. And since those policies are continuously being updated through learning, the environment dynamics from agent i's perspective are **non-stationary**. The world appears to change its rules as the other agents learn.

This non-stationarity means the usual convergence guarantees from single-agent RL break down. In a standard MDP with a fixed policy, the state process is stationary -- the dynamics do not depend on time. But when every agent is simultaneously learning and updating its policy, each agent faces a fundamentally non-Markovian environment whose dynamics depend on the entire history of the interaction.

The moving target problem leads to **cyclic dynamics**: agent 1 adapts to agent 2's current policy, but by the time agent 1 has adapted, agent 2 has already changed. Agent 2 then adapts to agent 1's new policy, and so on. Whether this cycle converges to an equilibrium or spirals indefinitely depends on the specific game, the learning algorithms, and their parameters. This is a defining challenge of MARL that we will revisit throughout the coming lessons.
`,
      reviewCardIds: ['rc-marl-5.1-5'],
      illustrations: [],
    },
  ],
  summary: `**Key takeaways:**
- The MARL learning loop has four elements: a game model, collected history data D_z, a learning algorithm L that updates the joint policy, and a learning goal defined by a solution concept.
- Transitions and rewards depend on the joint action of all agents, not just any individual agent's action.
- The learning algorithm may consist of separate sub-algorithms per agent, each using different portions of the data.
- The moving target problem from single-agent RL is amplified in MARL because each agent's apparent environment dynamics depend on the changing policies of all other agents.
- Cyclic dynamics arise when agents continuously adapt to each other's evolving policies, making convergence to equilibrium uncertain.`,
};

export default lesson;
