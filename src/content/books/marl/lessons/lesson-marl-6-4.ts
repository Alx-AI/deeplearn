/**
 * Lesson 6.4: Agent Modeling and Fictitious Play
 *
 * Covers: Agent modelling concept, fictitious play algorithm, convergence properties
 * Source sections: 6.3, 6.3.1
 */

import type { LessonContentData } from '../../deep-learning-python/lessons/lesson-1-1';

const lesson: LessonContentData = {
  lessonId: 'marl-6.4',
  title: 'Agent Modeling and Fictitious Play',
  sections: [
    {
      id: 'marl-6.4.1',
      title: 'The Agent Modeling Concept',
      content: `
The JAL-GT algorithms from the previous lesson use game-theoretic solution concepts -- minimax, Nash, correlated equilibrium -- to decide how other agents will behave. These are **normative** assumptions: they prescribe how rational agents *should* behave. But what if other agents deviate from these norms?

Consider Minimax Q-learning, which assumes the opponent plays optimally (worst-case). We saw that it learns robust policies, but at a cost: it won 53.7% against a hand-built opponent, while independent Q-learning won 76.3%. The hand-built opponent had exploitable weaknesses, but Minimax-Q's hard-wired worst-case assumption prevented it from capitalizing on them.

**Agent modeling** (also called **opponent modeling**) takes a different approach: instead of assuming how other agents behave, we **observe** their actions and build predictive models. An agent model takes past observations as input -- histories of states, actions, rewards -- and outputs **predictions** about the modeled agent's future behavior, such as the probability of each action.

The most common form is **policy reconstruction**: learning a model pi_hat_j of agent j's policy based on observed state-action pairs {(s_tau, a^tau_j)}. This is essentially a **supervised learning** problem. We observe what agent j does in each state, and we fit a model to predict those choices. The model could be a lookup table, a finite state automaton, or a neural network.

Given models pi_hat_{-i} = {pi_hat_j} for all other agents j != i, the modeling agent i can compute a **best-response policy**:

pi_i in BR_i(pi_hat_{-i})

This is how best response -- previously a theoretical device for defining equilibria -- becomes an operational tool in reinforcement learning. Rather than solving a game-theoretic equilibrium, agent i simply optimizes against its learned predictions of others.
`,
      reviewCardIds: ['rc-marl-6.4-1', 'rc-marl-6.4-2'],
      illustrations: [],
    },
    {
      id: 'marl-6.4.2',
      title: 'The Fictitious Play Algorithm',
      content: `
**Fictitious play** (Brown 1951; Robinson 1951) is one of the earliest and most elegant algorithms for learning in games. Each agent i models every other agent j as a stationary probability distribution pi_hat_j, estimated by the **empirical frequency** of agent j's past actions.

Let C(a_j) be the count of how many times agent j chose action a_j. Then the model is:

pi_hat_j(a_j) = C(a_j) / (sum over all a'_j of C(a'_j))

Before any actions are observed, the model is initialized to a uniform distribution: pi_hat_j(a_j) = 1/|A_j|.

In each episode, agent i picks a **best-response action** against the current models:

BR_i(pi_hat_{-i}) = argmax_{a_i} sum_{a_{-i}} R_i(a_i, a_{-i}) * product_{j != i} pi_hat_j(a_j)

This is a deterministic best response -- it outputs a single action, not a probability distribution. This means fictitious play **cannot learn** equilibria that require randomization directly through its action choices. However, something remarkable happens with the **empirical distribution** of actions over time.

Consider Rock-Paper-Scissors. Both agents start by choosing Rock (with uniform models, all actions have equal value, so the first action is chosen by a tie-breaking rule). After seeing Rock, each agent's model predicts the opponent will play Rock, so the best response is Paper. Both switch to Paper. After several rounds of Paper, Scissors becomes optimal. This cycle continues, tracing a spiral pattern through the probability simplex.

The key: while the *actual actions* cycle deterministically, the **empirical distributions** of those actions -- the fraction of time each action was played -- converge smoothly to the Nash equilibrium (1/3, 1/3, 1/3). The spiral tightens with each revolution because the growing history dampens each new observation's effect.
`,
      reviewCardIds: ['rc-marl-6.4-3', 'rc-marl-6.4-4'],
      illustrations: [],
    },
    {
      id: 'marl-6.4.3',
      title: 'Convergence Properties of Fictitious Play',
      content: `
Fictitious play has several elegant convergence properties, first established by Fudenberg and Levine (1998):

1. **If actions converge, they form a Nash equilibrium.** If both agents eventually settle on fixed actions, those actions must be mutual best responses -- otherwise one agent would switch.

2. **Nash equilibria are absorbing.** If the agents' actions happen to form a Nash equilibrium in any episode, they will remain there forever. Once both agents are playing best responses, neither has any reason to change.

3. **Empirical convergence implies Nash equilibrium.** If the empirical distribution of each agent's actions converges, it converges to a Nash equilibrium.

4. **Guaranteed empirical convergence in key game classes.** The empirical distributions converge in:
   - Two-agent zero-sum games with finite actions (Robinson 1951)
   - Games solvable by iterated strict dominance
   - Certain potential games and generic 2x2 games

An important caveat: fictitious play does **not** guarantee convergence in all games. Shapley (1964) constructed a 3x3 general-sum game where the empirical distributions cycle indefinitely without converging. Nevertheless, for the game classes listed above, fictitious play is a surprisingly effective and simple learning algorithm.

Note that fictitious play, as defined here, is for **non-repeated** (one-shot) normal-form games. In this setting, the best response in each round is **myopic** -- it maximizes the immediate expected reward without considering future rounds. In stochastic games, where future actions depend on the history, a myopic best response is insufficient. We need to combine agent modeling with temporal-difference learning to compute **non-myopic** best responses that account for long-term consequences. That combination is exactly what JAL with agent modeling provides, as we will see in the next lesson.

Numerous extensions of fictitious play have been proposed, including **smoothed** fictitious play (Fudenberg and Levine 1995), which adds noise to break ties, and **generalized weakened** fictitious play (Leslie and Collins 2006), which relaxes the exact best-response requirement.
`,
      reviewCardIds: ['rc-marl-6.4-5'],
      illustrations: [],
    },
  ],
  summary: `**Key takeaways:**
- Agent modeling builds predictive models of other agents' policies from observed actions, then computes best responses against those models.
- Fictitious play estimates each opponent's policy as the empirical frequency of their past actions and plays a best response at each round.
- Fictitious play uses deterministic best responses, so it cannot directly play probabilistic equilibria -- but the empirical distributions of actions can converge to Nash equilibria.
- Convergence is guaranteed in two-agent zero-sum games and several other game classes, but not in all games.
- Fictitious play is defined for non-repeated games with myopic best responses; extending it to stochastic games requires combining agent models with temporal-difference learning.`,
};

export default lesson;
