/**
 * Lesson 1.2: Multi-Agent Reinforcement Learning Overview
 *
 * Covers: How MARL combines RL with multi-agent interaction, cooperative vs
 * competitive vs mixed settings, why learning matters
 * Source sections: 1.2
 */

import type { LessonContentData } from '../../deep-learning-python/lessons/lesson-1-1';

const lesson: LessonContentData = {
  lessonId: 'marl-1.2',
  title: 'Multi-Agent Reinforcement Learning Overview',
  sections: [
    {
      id: 'marl-1.2.1',
      title: 'The MARL Training Loop',
      content: `
Now that we know what a multi-agent system looks like, how do we actually get agents to learn good behavior? The answer is **multi-agent reinforcement learning** (MARL) -- the extension of RL to settings with multiple simultaneously learning agents.

Recall the single-agent RL loop: an agent observes the state, picks an action, receives a reward, transitions to a new state, and repeats. MARL extends this loop to *n* agents. At each time step, every agent *i* receives its own observation and independently selects an action a_i. The collection of all individual actions (a_1, a_2, ..., a_n) is called the **joint action**. This joint action changes the environment state according to the environment's dynamics, and each agent receives its own scalar reward and a new observation. The loop continues until a terminal condition (like all items collected) or indefinitely.

In Level-Based Foraging, each agent *i* in {1, 2, 3} observes the full state and picks an action a_i from {up, down, left, right, collect, noop}. Given the joint action (a_1, a_2, a_3), the environment updates robot positions and item existence variables. Each agent then receives a reward -- for instance, +1 if any item was collected -- and sees the new state. A complete run from the initial grid configuration to all items collected (or a time limit) is called an **episode**. Data from many episodes is used to improve each agent's **policy** -- the function mapping observations to actions.

The key insight is that each agent starts with a random policy and, through trial and error across many episodes, gradually shifts toward actions that maximize its cumulative reward. But unlike single-agent RL, each agent's reward depends not just on its own actions but on *everyone's* actions. That interdependence is what makes MARL fundamentally different.
`,
      reviewCardIds: ['rc-marl-1.2-1', 'rc-marl-1.2-2'],
      illustrations: ['marl-training-loop'],
    },
    {
      id: 'marl-1.2.2',
      title: 'Cooperative, Competitive, and Mixed Settings',
      content: `
The nature of the agents' rewards defines the character of the multi-agent interaction. There are three broad categories, and understanding them is essential to choosing the right MARL approach.

In a **fully cooperative** (or **common-reward**) setting, all agents share the same reward function. When something good happens, everyone benefits equally. In Level-Based Foraging, a simple cooperative variant gives every agent +1 whenever *any* item is collected, regardless of who collected it. The agents are teammates working toward a shared objective: clear all the items as fast as possible. The main challenge here is **coordination** -- getting agents to work together effectively without stepping on each other's toes.

In a **fully competitive** (or **zero-sum**) setting, one agent's gain is another's loss. The classic example is two players in a chess match: the winner receives +1 and the loser receives -1 (with 0 for a draw). Because the rewards sum to zero, there is no room for cooperation -- every advantage for one player is a disadvantage for the other. The challenge here is developing strategies that exploit the opponent's weaknesses while minimizing your own vulnerabilities.

Most real-world problems live in the messy space between these extremes. This is the **mixed-motive** (or **general-sum**) setting, where agents' goals partially align and partially conflict. The version of Level-Based Foraging used throughout the book is actually mixed-motive: only agents *directly involved* in collecting an item get a reward. So agents want to maximize their own individual returns, which tempts them to grab items solo -- but some items require cooperation because a single agent's skill level isn't high enough.

These three categories -- common-reward, zero-sum, and general-sum -- form a spectrum. They show up as the **reward structure** dimension in Figure 1.4 of the textbook. Choosing the right MARL algorithm often starts with identifying where your problem falls on this spectrum.
`,
      reviewCardIds: ['rc-marl-1.2-3', 'rc-marl-1.2-4'],
      illustrations: ['reward-spectrum'],
    },
    {
      id: 'marl-1.2.3',
      title: 'Why Learning Matters: From Central Control to CTDE',
      content: `
So why not just hard-code good strategies instead of learning them? For simple problems you could, but multi-agent environments tend to be far too complex for hand-designed solutions. The number of possible situations grows combinatorially, and the optimal response often depends on subtle interactions between agents. Learning lets agents discover strategies that no human designer would think to write.

MARL algorithms can be organized along several dimensions. One of the most important is the degree of **centralization** during training and execution:

- **Centralized training and execution**: A single central controller has access to all agents' observations and dictates their actions during both learning and deployment. This is the strongest form of coordination, but it requires a communication link to every agent at all times -- impractical for autonomous vehicles or rescue robots.

- **Decentralized training and execution**: Each agent learns independently using only its own local observations and rewards. No information is shared. This is the most robust to communication failures but also the hardest setting for coordination -- agents must figure out how to cooperate without ever being told what the others are doing.

- **Centralized training with decentralized execution** (CTDE): The sweet spot that much of modern MARL research targets. During training, which typically happens in simulation, a central process can access all agents' data (observations, actions, rewards). It uses this global view to train agent policies that, once deployed, execute in a *fully decentralized* way -- each agent uses only its own observations to choose actions.

CTDE is powerful because training is a relatively controlled setting (a simulator, a lab) where centralization is cheap, while execution happens in the real world where agents must act on their own. This paradigm underlies many of the most successful deep MARL algorithms you will encounter later in the book.

MARL algorithms also differ along other dimensions summarized in the textbook's Figure 1.4: the *size* of the problem (number of agents, state/action spaces), *observability* (full vs. partial), *knowledge* (what agents know about each other), and the *objective* (which solution concept to target). These dimensions form the design space you will navigate throughout this course.
`,
      reviewCardIds: ['rc-marl-1.2-5'],
      illustrations: ['ctde-paradigm'],
    },
  ],
  summary: `**Key takeaways:**
- The MARL training loop extends single-agent RL to *n* agents choosing actions simultaneously; their combined actions form a joint action that drives state transitions.
- Multi-agent reward structures fall into three categories: cooperative (shared reward), competitive (zero-sum), and mixed-motive (general-sum).
- Centralized training with decentralized execution (CTDE) is the dominant modern paradigm: use global information during training, but deploy policies that act on local observations only.
- An episode is a complete run from initial state to terminal state; data from many episodes is used to improve agent policies.
- The key dimensions of MARL include reward structure, centralization, observability, and the number of agents.`,
};

export default lesson;
