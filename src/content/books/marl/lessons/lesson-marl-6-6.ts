/**
 * Lesson 6.6: Bayesian Learning and Value of Information
 *
 * Covers: Bayesian agent modelling, type-based reasoning, value of information
 * Source sections: 6.3.3
 */

import type { LessonContentData } from '../../deep-learning-python/lessons/lesson-1-1';

const lesson: LessonContentData = {
  lessonId: 'marl-6.6',
  title: 'Bayesian Learning and Value of Information',
  sections: [
    {
      id: 'marl-6.6.1',
      title: 'Bayesian Agent Modeling',
      content: `
Fictitious play and JAL-AM learn a **single** model for each other agent. What they lack is an explicit representation of **uncertainty** about those models. Maybe agent j follows a cooperative strategy, or maybe a retaliatory one -- and right now, we're not sure which. Bayesian learning maintains beliefs over a space of possible models, allowing the agent to reason about this uncertainty.

Assume we control agent i. Let Pi_hat_j be the space of possible models for agent j. Each model pi_hat_j can choose actions based on the interaction history. Agent i starts with a **prior belief** Pr(pi_hat_j | h_0) assigning probabilities to each model. After observing agent j's action a^t_j in state s_t, agent i updates its belief via **Bayes' rule**:

Pr(pi_hat_j | h_{t+1}) = [pi_hat_j(a^t_j | h_t) * Pr(pi_hat_j | h_t)] / [sum over pi'_j of pi'_j(a^t_j | h_t) * Pr(pi'_j | h_t)]

Models that predicted the observed action well get higher posterior probability; models that predicted it poorly get downweighted.

For **continuous** model spaces -- where Pi_hat_j contains all possible state-conditioned policies -- beliefs can be represented using **Dirichlet distributions**. A Dirichlet over |A_j| actions is parameterized by pseudocounts (beta_1, ..., beta_{|A_j|}). Starting from beta_k = 1 for all k (a uniform prior), each observation of action a_j in state s simply increments the corresponding pseudocount by 1.

The mean of the Dirichlet is pi_hat_j(a_{j,k} | s) = beta_k / (sum_l beta_l), which is exactly the empirical frequency used in fictitious play and JAL-AM. But the Dirichlet carries more information: it also quantifies **how confident** we are. After 3 observations, beta = (2, 1, 1) says "probably action 1, but we're quite unsure." After 300 observations, beta = (200, 50, 50) says "very likely action 1, and we're confident."
`,
      reviewCardIds: ['rc-marl-6.6-1', 'rc-marl-6.6-2'],
      illustrations: [],
    },
    {
      id: 'marl-6.6.2',
      title: 'Type-Based Reasoning',
      content: `
A powerful variant of Bayesian agent modeling uses a **finite set of agent types** -- discrete, interpretable models of how an agent might behave. This is sometimes called **type-based reasoning** (Albrecht, Crandall, and Ramamoorthy 2016).

Consider two agents playing the repeated **Prisoner's Dilemma** for 10 time steps. Agent 1 believes agent 2 could be one of two types:

| | C | D |
|---|---|---|
| **C** | -1, -1 | -5, 0 |
| **D** | 0, -5 | -3, -3 |

- **Coop**: Always cooperates, regardless of what the other agent does.
- **Grim**: Cooperates initially, but if the other agent ever defects, switches to permanent defection.

Agent 1 starts with a uniform prior: Pr(Coop) = 0.5, Pr(Grim) = 0.5. Now, which first action should agent 1 choose?

**If agent 1 cooperates first**: Both Coop and Grim would cooperate in response (since neither has been provoked). So cooperation reveals **no information** about agent 2's type. Agent 1 learns nothing and gets reward -1 each step. Over 10 steps, total return = -10.

**If agent 1 defects first and agent 2 is Coop**: Agent 2 continues to cooperate (it always does). Agent 1 immediately learns agent 2 is Coop (because Grim would retaliate), and can exploit by defecting for the remaining steps. Total return = 10 * 0 = 0.

**If agent 1 defects first and agent 2 is Grim**: Agent 2 switches to permanent defection. Agent 1 learns agent 2 is Grim, but now both are stuck defecting. Total return = 0 + 9 * (-3) = -27.

This example illustrates that actions have **informational value** -- they can reveal the type of the other agent. But that information may come at a cost. Defecting is informative but risky. This tradeoff is formalized by the **value of information**.
`,
      reviewCardIds: ['rc-marl-6.6-3', 'rc-marl-6.6-4'],
      illustrations: [],
    },
    {
      id: 'marl-6.6.3',
      title: 'Value of Information',
      content: `
The **value of information** (VI) formalizes the idea that an agent should choose actions not only to maximize immediate reward, but also to **learn about other agents** in a way that improves future decisions. VI explicitly evaluates how each action might change the agent's beliefs and how those changed beliefs affect future returns.

VI is defined recursively via two interlocking functions:

**VI_i(a_i | h)** = sum over pi_hat_{-i} of Pr(pi_hat_{-i} | h) * sum over a_{-i} of Q_i(h, (a_i, a_{-i})) * product_{j != i} pi_hat_j(a_j | h)

**Q_i(h, a)** = sum over s' of T(s'|s(h),a) * [R_i(s(h),a,s') + gamma * max_{a'_i} VI_i(a'_i | (h, a, s'))]

The crucial difference from standard Bellman equations: Q_i extends the history h to (h, a, s') and recurses back into VI with the updated history. Since VI uses the **posterior** belief Pr(pi_hat_{-i} | h), this means VI accounts for how beliefs will change in the future under different histories. The recursion depth determines how far ahead VI evaluates the informational impact.

In our Prisoner's Dilemma example with uniform priors, gamma = 1, and recursion depth 10:

VI_1(Cooperate) = -9
VI_1(Defect) = -13.5

Cooperation has higher VI because the expected cost of triggering Grim's retaliation outweighs the benefit of identifying agent 2's type. If both agents use VI, they cooperate for 9 steps and defect only on the **last** step (where there is no future to protect).

This is a key result: VI can produce **cooperation** in the Prisoner's Dilemma -- not through altruism, but through rational cost-benefit analysis of information acquisition. The choice of **prior belief** matters significantly. With Pr(Coop) = 0.8 instead of 0.5, the VI values flip and both agents defect initially -- the expected cost of provoking Grim is lower when Grim is less likely. This sensitivity to priors connects to the rational learning literature in game theory (Kalai and Lehrer 1993).
`,
      reviewCardIds: ['rc-marl-6.6-5'],
      illustrations: [],
    },
  ],
  summary: `**Key takeaways:**
- Bayesian agent modeling maintains probability distributions (beliefs) over possible models of other agents, updated via Bayes' rule after each observation.
- Dirichlet distributions provide a natural continuous belief representation; their mean equals the empirical frequency, but they also capture uncertainty.
- Type-based reasoning uses a finite set of interpretable agent types (e.g., Coop and Grim), with beliefs tracking which type is most likely.
- Value of information (VI) recursively evaluates how actions reveal information about other agents and how that information affects future returns.
- VI can produce emergent cooperation in the Prisoner's Dilemma, not through altruism but through rational tradeoff between exploration cost and information gain.`,
};

export default lesson;
