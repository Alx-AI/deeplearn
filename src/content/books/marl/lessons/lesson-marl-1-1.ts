/**
 * Lesson 1.1: What Are Multi-Agent Systems?
 *
 * Covers: Definition of multi-agent systems, why single-agent methods fall short,
 * real-world examples of MAS
 * Source sections: 1.1
 */

import type { LessonContentData } from '../../deep-learning-python/lessons/lesson-1-1';

const lesson: LessonContentData = {
  lessonId: 'marl-1.1',
  title: 'What Are Multi-Agent Systems?',
  sections: [
    {
      id: 'marl-1.1.1',
      title: 'Defining Multi-Agent Systems',
      content: `
Imagine a fleet of mobile robots navigating a massive warehouse, picking items from shelves and delivering them to packing stations. Or picture a group of drones monitoring a power plant, each adjusting its patrol route based on what the others are doing. In both cases, we have multiple autonomous decision-makers sharing an environment and influencing each other's outcomes. This is the essence of a **multi-agent system** (MAS).

Formally, a multi-agent system consists of three core ingredients:

- An **environment** -- a physical or virtual world whose state evolves over time, influenced by the actions of the agents within it. The environment defines what actions are available and what observations each agent receives. States can be discrete (like grid positions), continuous (like angles in radians), or a mix of both.

- **Agents** -- entities that observe information about the environment and choose actions in order to influence its state. Agents are *goal-directed*: they have specified objectives and pick actions to achieve them. In MARL, these goals are encoded by **reward functions** that emit scalar signals after each action.

- **Goals and rewards** -- agents may share a common goal (collecting all items efficiently), have opposing goals (winning a chess match), or have goals that partially overlap and partially conflict. The nature of these goals fundamentally shapes how agents interact.

A critical detail: agents typically see only a *partial, imperfect* view of the environment. Different agents may receive different observations. Robot A might see the aisle it is in, while Robot B sees a completely different aisle. This **partial observability** is one of the features that makes multi-agent problems so much richer -- and harder -- than their single-agent cousins.

The term **policy** refers to the function an agent uses to select actions (or assign probabilities to actions) given what it currently observes. Learning good policies for all agents simultaneously is what MARL is all about.
`,
      reviewCardIds: ['rc-marl-1.1-1', 'rc-marl-1.1-2'],
      illustrations: ['mas-components'],
    },
    {
      id: 'marl-1.1.2',
      title: 'Why Single-Agent Methods Are Not Enough',
      content: `
You might wonder: why not just treat the entire multi-agent problem as a single, big reinforcement learning problem? Train one central brain that controls every robot, every drone, every car. Problem solved, right?

Not quite. Consider the **Level-Based Foraging** (LBF) example that appears throughout the MARL textbook. Three robots on a grid must collect items (shown as apples). Each robot and each item has a skill level. A group of robots can collect an item only if they stand next to it and the *sum* of their skill levels meets or exceeds the item's level. Each robot's action set is {up, down, left, right, collect, noop}.

If we try the single-agent approach, we need a central controller that chooses a joint action -- one action for *each* of the three robots at every time step. That means the action space is 6 x 6 x 6 = 216 possible joint actions. Even in this toy scenario, most standard single-agent RL algorithms struggle with action spaces that large. Scale up to 100 warehouse robots, and you get 6^100 possible joint actions -- a number with 78 digits. Clearly, centralized control does not scale.

Beyond the combinatorial explosion, centralized control also assumes you *can* coordinate everyone from a single point. In many real applications -- autonomous vehicles on a highway, search-and-rescue robots in disaster zones -- there is no reliable channel to a central coordinator. Each agent must act locally, using only its own observations. These agents need **decentralized policies**: functions that map each agent's local information to actions, without waiting for instructions from headquarters.

MARL addresses both problems. It *decomposes* the huge joint decision problem into smaller, per-agent problems. And it can produce policies that execute in a fully decentralized fashion. The price of this decomposition is a new challenge: the agents must learn to **coordinate** with each other, which is exactly what makes MARL both difficult and fascinating.
`,
      reviewCardIds: ['rc-marl-1.1-3', 'rc-marl-1.1-4'],
      illustrations: ['joint-action-explosion'],
    },
    {
      id: 'marl-1.1.3',
      title: 'The Level-Based Foraging Example',
      content: `
Let's look more closely at Level-Based Foraging, since it will be a running example throughout the book. The environment is a grid world containing three robots and several items. Each robot and item has a numeric skill level. An item can be collected when one or more robots are adjacent to it and the sum of those robots' levels is at least the item's level.

The **state** at any time step is fully described by the x/y-positions of all robots and items, plus a binary variable for each item indicating whether it still exists. The skill levels are treated as constants (not part of the state).

Each agent observes the complete state and selects from the action set {up, down, left, right, collect, noop}. The first four actions move the robot one cell in the given direction (unless it is already at the edge). The "collect" action attempts to pick up an adjacent item. The "noop" action does nothing.

An important subtlety: *robot* and *agent* are distinct concepts. A "robot" is an object in the environment, represented by position variables. An "agent" is an abstract decision-making entity that observes the state and chooses action values for its robot. When there is a clean one-to-one mapping, the book uses the terms interchangeably -- "the skill level of agent i" really means the skill level of the robot that agent i controls.

The **defining characteristic** of a multi-agent system is that agents must coordinate their actions with -- or against -- each other. In a **fully cooperative** scenario, every agent gets +1 whenever any item is collected. In a **competitive** scenario, think of two chess players: the winner gets +1, the loser gets -1. LBF sits in between: in the version used throughout the book, only those agents directly involved in collecting an item receive a positive reward. So agents are motivated to grab items before others (competitive pressure), yet they sometimes *need* partners to collect high-level items (cooperative pressure). This blend of cooperation and competition is what makes multi-agent interaction so rich.
`,
      reviewCardIds: ['rc-marl-1.1-5'],
      illustrations: ['lbf-grid'],
    },
  ],
  summary: `**Key takeaways:**
- A multi-agent system consists of an environment, multiple decision-making agents, and their goals (encoded as reward functions).
- Agents typically have only partial, imperfect observations of the environment.
- Single-agent RL cannot scale to multi-agent problems because the joint action space grows exponentially with the number of agents.
- Many real-world applications require decentralized policies where each agent acts on local observations alone.
- The Level-Based Foraging (LBF) example illustrates core MAS concepts: state, actions, rewards, and the interplay of cooperation and competition.`,
};

export default lesson;
