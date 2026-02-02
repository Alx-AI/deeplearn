/**
 * Lesson 3.2: Repeated Normal-Form Games
 *
 * Covers: Repeated games definition, history-dependent strategies
 *         (tit-for-tat), folk theorem
 * Source sections: 3.2
 */

import type { LessonContentData } from '../../deep-learning-python/lessons/lesson-1-1';

const lesson: LessonContentData = {
  lessonId: 'marl-3.2',
  title: 'Repeated Normal-Form Games',
  sections: [
    {
      id: 'marl-3.2.1',
      title: 'From One Shot to Many Rounds',
      content: `A normal-form game captures a single interaction. But most real situations involve the *same* agents meeting again and again -- business partners negotiating quarter after quarter, drivers sharing the same intersection every morning, or nations engaged in ongoing diplomacy. The simplest way to model such sustained interaction is the **repeated normal-form game**.

Given a normal-form game Gamma = (I, {A_i}, {R_i}), a repeated normal-form game plays the same game Gamma over T time steps t = 0, 1, ..., T-1, where T can be finite or infinite. At each time step t, every agent i samples an action a_i^t from its policy pi_i(a_i^t | h^t), which is now conditioned on the **joint-action history** h^t = (a^0, a^1, ..., a^{t-1}) -- the record of all joint actions from every previous round. (At t = 0 the history is empty.) After all agents act, each agent i receives reward r_i^t = R_i(a^t), identical to the per-round reward defined by the underlying normal-form game.

The critical addition is history dependence. In the one-shot game, policies are just probability distributions over actions. In the repeated game, policies can condition on the *entire* sequence of past joint actions. This dramatically expands the space of available strategies and makes cooperation, punishment, and reputation possible.

We distinguish between **non-repeated** normal-form games (T = 1) and **repeated** normal-form games (T > 1). This distinction matters: the set of reasonable outcomes in a repeated game is much richer than in its one-shot counterpart, as we will see with the folk theorem.`,
      reviewCardIds: ['rc-marl-3.2-1', 'rc-marl-3.2-2'],
      illustrations: [],
    },
    {
      id: 'marl-3.2.2',
      title: 'History-Dependent Strategies and Tit-for-Tat',
      content: `Because policies in a repeated game can see the entire history, agents can implement sophisticated conditional strategies. In practice, policies typically condition on some compressed representation of the history -- for example, just the most recent joint action, or running counts of each action.

The most famous history-dependent strategy is **Tit-for-Tat** (TFT), designed for the repeated Prisoner's Dilemma. It works as follows:

1. In the first round, **cooperate**.
2. In every subsequent round, **copy whatever the other agent did last round**. If they cooperated, cooperate. If they defected, defect.

TFT is elegant in its simplicity. It is "nice" (starts cooperative), "retaliatory" (punishes defection immediately), "forgiving" (returns to cooperation as soon as the other agent does), and "clear" (its pattern is easy for the other agent to recognise). In Robert Axelrod's celebrated computer tournaments (1984), Tit-for-Tat consistently outperformed far more complex strategies.

Tit-for-Tat illustrates a profound point: **repetition enables cooperation** even among self-interested agents. In the one-shot Prisoner's Dilemma, defection dominates. But in the repeated version, the threat of future punishment (and the promise of future cooperation) can sustain mutual cooperation.

Other well-known strategies include **Grim Trigger** (cooperate until the opponent defects once, then defect forever) and **Win-Stay-Lose-Shift** (repeat your action if it gave a good payoff, switch otherwise). Each makes a different trade-off between forgiveness and deterrence. The richness of this strategy space is what makes repeated games so interesting -- and so central to multi-agent RL research.`,
      reviewCardIds: ['rc-marl-3.2-3', 'rc-marl-3.2-4'],
      illustrations: [],
    },
    {
      id: 'marl-3.2.3',
      title: 'Finite vs. Infinite Repetition and the Folk Theorem',
      content: `Whether a repeated game has finite or infinite repetitions has deep consequences for what outcomes are achievable.

In a **finitely repeated** game, agents know the game ends after T rounds. This creates **end-game effects**: in the final round, no future punishment is possible, so each agent may defect. But if defection is expected in round T, there is no deterrent in round T-1 either -- and by backward induction, cooperation can unravel all the way back to round 1. This reasoning suggests that in a finitely repeated Prisoner's Dilemma with rational agents, the unique equilibrium is to defect in every round -- just as in the one-shot game.

**Infinitely repeated** games avoid this unraveling. One common formulation is to assign a probability (1 - gamma) of the game ending after each time step, where gamma is a **discount factor** in [0, 1]. For gamma < 1, any finite horizon T > 0 has nonzero probability, so the game still qualifies as "infinite." The discount factor gamma connects directly to the discounted-return objective used in RL: agents weight future rewards by gamma^t, making nearby rewards more valuable than distant ones.

The **folk theorem** is one of the most celebrated results in game theory. Informally, it states that in an infinitely repeated game (with sufficiently high gamma), *any* outcome that gives each agent at least their "minmax" payoff -- the worst reward an agent can guarantee regardless of what others do -- can be sustained as an equilibrium. In other words, if the agents are patient enough, a vast range of cooperative and semi-cooperative outcomes become achievable through appropriately designed strategies.

The folk theorem is powerful but also a double-edged sword: it tells us many outcomes *can* be sustained, but it does not tell us which one the agents will converge to. This multiplicity of equilibria is one of the central challenges in MARL, and much of the research we will study later attempts to address it.`,
      reviewCardIds: ['rc-marl-3.2-5'],
      illustrations: [],
    },
  ],
  summary: `**Key takeaways:**
- A repeated normal-form game plays the same one-shot game over multiple time steps, allowing policies to condition on the history of past joint actions.
- History dependence enables cooperation strategies like Tit-for-Tat, which sustains mutual cooperation through simple reciprocity.
- Finitely repeated games suffer end-game effects that can unravel cooperation via backward induction.
- Infinitely repeated games (with discount factor gamma) avoid unraveling; the folk theorem shows that a wide range of outcomes can be sustained as equilibria when agents are sufficiently patient.
- The multiplicity of equilibria guaranteed by the folk theorem is a central challenge in MARL.`,
};

export default lesson;
