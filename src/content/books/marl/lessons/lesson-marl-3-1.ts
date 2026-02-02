/**
 * Lesson 3.1: Normal-Form Games
 *
 * Covers: Definition and components, payoff matrices with examples
 *         (Prisoner's Dilemma, Matching Pennies), game classifications
 * Source sections: 3.1
 */

import type { LessonContentData } from '../../deep-learning-python/lessons/lesson-1-1';

const lesson: LessonContentData = {
  lessonId: 'marl-3.1',
  title: 'Normal-Form Games',
  sections: [
    {
      id: 'marl-3.1.1',
      title: 'Definition and Components',
      content: `In single-agent RL, we model the world as a Markov decision process. But the moment you add a second agent, you need a richer framework -- one that accounts for the fact that each agent's outcome depends on what *everyone* does. Enter the **normal-form game**, the most basic building block in game theory and the foundation for every multi-agent model we will study.

A **normal-form game** (also called a "strategic-form" game) defines a single, simultaneous interaction among two or more agents. Formally, it consists of three components:

1. A finite set of **agents** I = {1, ..., n}.
2. For each agent i, a finite set of **actions** A_i. The set of all possible **joint actions** is A = A_1 x ... x A_n.
3. For each agent i, a **reward function** R_i : A -> R that maps every joint action to a scalar reward.

The game proceeds in one step. Each agent i independently selects a **policy** (also called a "strategy" in game-theory parlance) pi_i that assigns a probability to each of its available actions. The agents then simultaneously sample actions from their policies, producing a joint action a = (a_1, ..., a_n). Finally, each agent i receives a reward r_i = R_i(a) determined by the entire joint action -- not just its own choice.

This last point is the crux of multi-agent reasoning: your reward depends on what everyone else does, and you don't know their choices in advance. Even in this stripped-down, single-shot setting, fascinating strategic tensions emerge -- as we will see in the examples that follow.

Think of the normal-form game as the multi-agent analogue of the **multi-armed bandit** from single-agent RL: it captures the essence of the decision problem while stripping away the complexity of states and time.`,
      reviewCardIds: ['rc-marl-3.1-1', 'rc-marl-3.1-2'],
      illustrations: [],
    },
    {
      id: 'marl-3.1.2',
      title: 'Payoff Matrices and Classic Examples',
      content: `When a normal-form game has exactly two agents, we call it a **matrix game** because the reward functions can be written out as matrices (or a single matrix of tuples). Agent 1 picks a row, agent 2 picks a column, and the cell at their intersection contains both agents' rewards.

Here is the classic **Rock-Paper-Scissors** game:

|   | R | P | S |
|---|---|---|---|
| **R** | 0, 0 | -1, 1 | 1, -1 |
| **P** | 1, -1 | 0, 0 | -1, 1 |
| **S** | -1, 1 | 1, -1 | 0, 0 |

Each cell shows (r_1, r_2). Notice that one player's gain is always the other's loss -- the rewards always sum to zero.

Now consider the **Prisoner's Dilemma**, perhaps the most studied game in all of social science:

|   | C | D |
|---|---|---|
| **C** | -1, -1 | -5, 0 |
| **D** | 0, -5 | -3, -3 |

Each agent chooses to **cooperate** (C) or **defect** (D). Mutual cooperation yields the second-best outcome for both (-1, -1). But each agent is individually tempted to defect: if *you* defect while the other cooperates, you get 0 (the best possible) while they get -5 (the worst). The tragic result is that rational self-interest drives both agents to defect, landing them at (-3, -3) -- worse than mutual cooperation.

Finally, a simple **Coordination Game**:

|   | A | B |
|---|---|---|
| **A** | 1 | 0 |
| **B** | 0 | 1 |

Here both agents receive the same reward (it is a **common-reward** game), so a single number suffices per cell. The agents must coordinate to pick the same action.`,
      reviewCardIds: ['rc-marl-3.1-3'],
      illustrations: [],
    },
    {
      id: 'marl-3.1.3',
      title: 'Game Classifications',
      content: `Normal-form games can be classified by the relationship among the agents' reward functions. This classification is important because it determines which algorithms and solution concepts apply.

**Zero-sum games.** The agents' rewards always sum to zero for every joint action: for all a in A, the sum of R_i(a) over all agents i equals 0. In two-player zero-sum games this simplifies to R_1 = -R_2 -- one agent's gain is exactly the other's loss. Rock-Paper-Scissors is a classic example. Zero-sum games model purely competitive interactions, and they have especially clean mathematical properties (we will see this when we study minimax solutions in Chapter 4).

**Common-reward games.** All agents share the same reward function: R_i = R_j for every pair of agents i, j. The Coordination Game above is an example. Since everyone wants the same outcome, the challenge is not competition but *coordination* -- agents must align their actions without being able to communicate. Common-reward games model purely cooperative interactions.

**General-sum games.** There are no restrictions on how the reward functions relate to each other. The Prisoner's Dilemma is a general-sum game: the agents' interests are partially aligned (both prefer mutual cooperation over mutual defection) but also partially conflicting (each is tempted to defect). Most real-world multi-agent scenarios are general-sum, blending elements of competition and cooperation.

These classifications carry over to every game model higher in the hierarchy -- repeated games, stochastic games, and POSGs can all be zero-sum, common-reward, or general-sum, depending on their reward structure.

One additional note on terminology: some literature uses the term **constant-sum** for games where rewards always sum to some fixed constant c, which is a slight generalisation of zero-sum. Throughout this course, we follow the book's convention and use "zero-sum" as the primary label.`,
      reviewCardIds: ['rc-marl-3.1-4', 'rc-marl-3.1-5'],
      illustrations: [],
    },
  ],
  summary: `**Key takeaways:**
- A normal-form game defines a single simultaneous interaction: a set of agents, action sets, and reward functions that map joint actions to scalar rewards.
- Two-agent normal-form games are called matrix games because rewards can be laid out in a payoff matrix.
- The Prisoner's Dilemma illustrates how individual incentives can lead to collectively worse outcomes.
- Games are classified as zero-sum (purely competitive), common-reward (purely cooperative), or general-sum (mixed incentives).
- Normal-form games are the basic building block for all richer game models covered in this chapter.`,
};

export default lesson;
