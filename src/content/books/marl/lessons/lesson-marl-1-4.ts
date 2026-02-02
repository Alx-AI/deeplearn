/**
 * Lesson 1.4: Challenges, Agendas, and Book Roadmap
 *
 * Covers: Core MARL challenges (non-stationarity, credit assignment,
 * equilibrium selection, scalability), MARL research agendas (computational,
 * prescriptive, descriptive), and the book's two-part structure
 * Source sections: 1.4, 1.5, 1.6
 */

import type { LessonContentData } from '../../deep-learning-python/lessons/lesson-1-1';

const lesson: LessonContentData = {
  lessonId: 'marl-1.4',
  title: 'Challenges, Agendas, and Book Roadmap',
  sections: [
    {
      id: 'marl-1.4.1',
      title: 'Core Challenges of MARL',
      content: `
MARL inherits all the difficulties of single-agent RL and adds a set of challenges unique to the multi-agent setting. Understanding these challenges up front will help you appreciate *why* the algorithms you encounter later are designed the way they are.

**Non-stationarity caused by learning agents** is arguably the most fundamental challenge. In single-agent RL, the environment is typically stationary -- it behaves the same way tomorrow as today. But in MARL, the other agents *are* part of the environment, and they are constantly changing their policies as they learn. From any single agent's perspective, the world appears to shift under its feet. Agent A adapts to Agent B's behavior, but B is simultaneously adapting to A, which causes A's world to change again. This can create a **moving target problem** with cyclic, unstable learning dynamics. Handling this non-stationarity robustly is a central theme of MARL research.

**Equilibrium selection** is the second major challenge. In single-agent RL, there is a clear notion of an optimal policy -- one that maximizes expected return from every state. In MARL, the returns of one agent's policy depend on what the others do, so optimality must be defined relative to the other agents' strategies. This leads to the concept of **equilibrium** -- a collection of policies where no single agent can improve by changing its own policy alone. The catch: there may be *multiple* equilibria, each assigning different returns to different agents. How do the agents "negotiate" during learning which equilibrium to converge to? This is the equilibrium selection problem.

**Multi-agent credit assignment** compounds the temporal credit assignment problem familiar from single-agent RL. Not only must an agent figure out *which past actions* led to a reward, it must figure out *whose actions* mattered. In Level-Based Foraging, if all three agents choose "collect" and the team gets +1, it is not obvious that the agent on the left contributed nothing (its level was too low). Disentangling individual contributions from a shared outcome remains an open problem.

**Scaling in the number of agents** is the fourth challenge. The total number of possible joint actions grows exponentially: with *n* agents each having *k* actions, there are k^n combinations. Even today's deep MARL algorithms are typically tested with 2 to 10 agents. How to efficiently and robustly handle many more agents is an active research frontier.
`,
      reviewCardIds: ['rc-marl-1.4-1', 'rc-marl-1.4-2'],
      illustrations: ['marl-challenges'],
    },
    {
      id: 'marl-1.4.2',
      title: 'Research Agendas in MARL',
      content: `
An influential article by Shoham, Powers, and Grenager (2007), titled "If multi-agent learning is the answer, what is the question?", identified several distinct *agendas* that MARL researchers pursue. These agendas differ in their motivations, goals, and the criteria by which success is measured. Being clear about which agenda you are pursuing avoids a lot of confusion.

The **computational agenda** treats MARL as a method to *compute solutions for game models*. A solution is a collection of agent policies satisfying certain properties -- for instance, a Nash equilibrium. Once computed, the solution can be deployed in an application or used for further analysis. In this view, MARL algorithms compete with other methods for computing game solutions (like linear programming for certain game types). The key advantage of MARL is that it can learn solutions *without* full knowledge of the game -- without knowing all agents' reward functions or the environment's dynamics.

The **prescriptive agenda** focuses on the *behavior of agents during learning*. It asks: how *should* agents learn, given specific performance criteria? For example, a criterion might require that an agent's average reward never drops below a certain threshold during training, regardless of how other agents behave. Another criterion might demand that the agent learns optimal actions against certain classes of opponents (like non-learning ones) while still performing acceptably against arbitrary opponents. Importantly, convergence to a particular equilibrium is not necessarily the goal -- the quality of behavior *during* learning is what matters.

The **descriptive agenda** uses MARL to study the behaviors of *natural agents* -- humans, animals, or other populations -- when they learn in interactive settings. Researchers propose a MARL algorithm as an idealized model of how agents adapt based on past interactions, then test (via controlled experiments) how well the model matches real behavior. The analysis often draws on evolutionary game theory to predict whether a population of such agents will converge to a particular equilibrium.

The textbook primarily covers the **computational** and **prescriptive** agendas. The computational perspective shapes the book's structure: it starts with game models and solution concepts, then presents algorithms designed to learn those solutions.
`,
      reviewCardIds: ['rc-marl-1.4-3', 'rc-marl-1.4-4'],
      illustrations: [],
    },
    {
      id: 'marl-1.4.3',
      title: 'Book Roadmap: From RL to Deep MARL',
      content: `
The textbook is divided into two parts, and understanding the roadmap will help you see how each piece fits into the larger puzzle.

**Part I: Foundations.** This part provides all the background you need before diving into modern MARL algorithms. Chapter 2 covers single-agent RL: Markov decision processes, value functions, the Bellman equation, dynamic programming (policy iteration, value iteration), and model-free methods (Sarsa, Q-learning). You need this foundation because MARL algorithms build directly on single-agent RL concepts.

Chapter 3 introduces the **game models** that formalize multi-agent interaction: normal-form games, stochastic games, and partially observable stochastic games. Chapter 4 then presents **solution concepts** -- the multi-agent equivalents of "optimal policy" -- including Nash equilibrium, correlated equilibrium, Pareto optimality, and no-regret learning. Chapters 5 and 6 bring it together with MARL-specific ideas: central versus independent learning, the challenges we discussed earlier, and foundational algorithms like minimax-Q, Nash-Q, fictitious play, WoLF, and regret matching.

**Part II: Deep MARL.** This part covers the modern, deep learning-powered algorithms that have produced the headline results. Chapters 7 and 8 provide introductions to deep learning and deep RL (DQN, policy gradients, actor-critic methods like PPO). Chapter 9 is the heart of the book: it presents the most important recent MARL algorithms, including centralized training with decentralized execution (CTDE), value decomposition (VDN, QMIX), parameter sharing, and population-based training. Chapter 10 gives practical implementation guidance, and Chapter 11 surveys multi-agent environments used in research.

The logical progression is: **single-agent RL** (learn one optimal policy) -> **game theory** (formalize multi-agent interaction) -> **solution concepts** (define what "optimal" means for multiple agents) -> **foundational MARL algorithms** (tabular methods) -> **deep MARL** (scale to complex problems) -> **practice** (implement and evaluate). Each step builds on the previous one, and by the end you will have the tools to both understand the research literature and build your own MARL systems.
`,
      reviewCardIds: ['rc-marl-1.4-5'],
      illustrations: ['book-roadmap'],
    },
  ],
  summary: `**Key takeaways:**
- The four core challenges of MARL are: non-stationarity (other agents change the environment as they learn), equilibrium selection (multiple equilibria, unclear which to converge to), multi-agent credit assignment (whose action caused the reward?), and scalability (joint action space grows exponentially).
- MARL research has three agendas: computational (compute game solutions), prescriptive (ensure good behavior during learning), and descriptive (model how natural agents learn).
- The textbook follows a logical progression: single-agent RL -> game models -> solution concepts -> foundational MARL -> deep MARL -> practice.
- Part I builds foundations (RL, game theory, solution concepts, tabular MARL); Part II covers modern deep MARL algorithms and practical implementation.`,
};

export default lesson;
