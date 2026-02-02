/**
 * Lesson 6.8: Win or Learn Fast (WoLF)
 *
 * Covers: WoLF principle, WoLF-IGA, WoLF-PHC
 * Source sections: 6.4.3, 6.4.4, 6.4.5
 */

import type { LessonContentData } from '../../deep-learning-python/lessons/lesson-1-1';

const lesson: LessonContentData = {
  lessonId: 'marl-6.8',
  title: 'Win or Learn Fast (WoLF)',
  sections: [
    {
      id: 'marl-6.8.1',
      title: 'The WoLF Principle and WoLF-IGA',
      content: `
IGA's cycling problem stems from a symmetric trap: both agents update at the same rate, so they perpetually chase each other around an ellipse. The **Win or Learn Fast** (WoLF) principle (Bowling and Veloso 2002) breaks this symmetry with an elegant idea: **learn quickly when losing, learn slowly when winning**.

The intuition is straightforward. If you are currently losing (your expected reward is below the equilibrium value), you should adapt rapidly to catch up. If you are winning, you should adapt slowly -- because your opponent is likely about to change their policy to catch up, and you do not want to overshoot.

Formally, we modify IGA's update rule with variable learning rates:

alpha_{k+1} = alpha_k + l^k_i * kappa * (dU_i/dalpha)
beta_{k+1} = beta_k + l^k_j * kappa * (dU_j/dbeta)

where l^k_i and l^k_j are chosen as:

l^k_i = l_min  if U_i(alpha_k, beta_k) > U_i(alpha_e, beta_k)  (winning)
l^k_i = l_max  otherwise  (losing)

Here alpha_e is a Nash equilibrium policy for agent i. "Winning" means agent i's current expected reward exceeds what the Nash equilibrium policy would achieve against the opponent's current policy. Note that alpha_e and beta_e need not come from the **same** equilibrium.

This modified algorithm is called **WoLF-IGA**. Its dynamical system has the same structure as IGA but with time-varying learning rates in the matrix F(t). The magic happens in the problematic Case 3 (imaginary eigenvalues, center in the unit square): the piecewise-elliptical trajectories now **spiral inward** toward the center point. In each of four quadrants around the center, the ellipse tightens by a factor of sqrt(l_min / l_max) < 1. Since l_min < l_max, this factor is strictly less than 1, guaranteeing convergence to the Nash equilibrium.
`,
      reviewCardIds: ['rc-marl-6.8-1', 'rc-marl-6.8-2'],
      illustrations: [],
    },
    {
      id: 'marl-6.8.2',
      title: 'WoLF with Policy Hill Climbing (WoLF-PHC)',
      content: `
WoLF-IGA is theoretically beautiful but limited: it only works for two-agent, two-action normal-form games, and it requires knowing the reward matrix and the other agent's policy. **WoLF-PHC** (Bowling and Veloso 2002) lifts all these restrictions.

WoLF-PHC works in **general-sum stochastic games** with any finite number of agents and actions. It does not require knowledge of reward functions or other agents' policies. The algorithm has three components:

**1. Q-learning.** Learn action values Q(s, a_i) using standard single-agent Q-learning (observing only agent i's own reward):

Q(s_t, a^t_i) <-- Q(s_t, a^t_i) + alpha * [r^t_i + gamma * max_{a'_i} Q(s_{t+1}, a'_i) - Q(s_t, a^t_i)]

**2. Average policy tracking.** Maintain an average policy pi_bar_i(a_i | s) that averages over all past policies:

C(s) <-- C(s) + 1
pi_bar_i(a_i | s) <-- pi_bar_i(a_i | s) + (1/C(s)) * [pi_i(a_i | s) - pi_bar_i(a_i | s)]

This average policy serves as a proxy for the Nash equilibrium policy (just as in fictitious play, average policies tend toward equilibria).

**3. WoLF policy update.** Move the policy pi_i toward the current greedy policy (the one that puts all mass on the best Q-value action), using a learning rate that depends on winning or losing:

delta = l_w  if sum_{a_i} pi_i(a_i|s) * Q(s, a_i) > sum_{a_i} pi_bar_i(a_i|s) * Q(s, a_i)  (winning)
delta = l_l  otherwise  (losing)

Probability mass is shifted from non-greedy actions to the greedy action, with l_l > l_w ensuring faster adaptation when losing.
`,
      reviewCardIds: ['rc-marl-6.8-3', 'rc-marl-6.8-4'],
      illustrations: [],
    },
    {
      id: 'marl-6.8.3',
      title: 'WoLF-PHC in Practice and GIGA',
      content: `
WoLF-PHC produces learning trajectories that are qualitatively similar to fictitious play but "smoother." In **Rock-Paper-Scissors**, both agents' policies spiral inward toward the Nash equilibrium (1/3, 1/3, 1/3), converging after about 100,000 episodes. The trajectories are circular rather than the triangular spirals of fictitious play, because WoLF-PHC adjusts action probabilities gradually rather than jumping to deterministic best responses.

A key design choice in WoLF-PHC: it replaces the Nash equilibrium policy (used in WoLF-IGA to determine winning/losing) with the **average policy** pi_bar_i. This is essential because in a general stochastic game, the Nash equilibrium is not known a priori. The average policy is a practical substitute that tends toward equilibrium over time.

While WoLF-PHC has strong empirical performance, formal convergence guarantees for the general case remain elusive. The proof for WoLF-IGA does not directly extend because WoLF-PHC uses Q-learning estimates (which are noisy) and the average policy proxy (which is only approximately an equilibrium policy).

**Generalized Infinitesimal Gradient Ascent (GIGA)** (Zinkevich 2003) takes a different path: it generalizes IGA to games with more than two agents and actions, and achieves **no-regret** guarantees. GIGA updates policies using the gradient of actual rewards (not expected rewards), then projects back onto the probability simplex. With step size kappa_k = 1/sqrt(k), GIGA guarantees that average regret goes to zero as k grows, satisfying no-regret. This implies the empirical action distributions converge to the set of **coarse correlated equilibria**.

GIGA is significant because it connects policy-gradient methods to the no-regret framework, which we will explore more deeply in the next lesson. The no-regret guarantee holds **regardless** of what other agents do -- a remarkably strong property.
`,
      reviewCardIds: ['rc-marl-6.8-5'],
      illustrations: [],
    },
  ],
  summary: `**Key takeaways:**
- The WoLF principle uses variable learning rates: learn fast when losing (l_max), learn slowly when winning (l_min), breaking the symmetric cycling of IGA.
- WoLF-IGA provably converges to Nash equilibrium in all two-agent, two-action games by spiraling inward with a tightening factor of sqrt(l_min/l_max).
- WoLF-PHC extends WoLF to general stochastic games using Q-learning and an average-policy proxy for the equilibrium, without requiring knowledge of reward functions or other agents' policies.
- GIGA generalizes IGA to n-agent games and achieves no-regret, connecting policy-gradient methods to the correlated equilibrium framework.
- WoLF-PHC produces smoother convergence trajectories than fictitious play, gradually adjusting action probabilities rather than jumping to deterministic best responses.`,
};

export default lesson;
