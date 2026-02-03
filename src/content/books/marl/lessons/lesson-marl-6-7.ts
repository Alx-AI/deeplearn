/**
 * Lesson 6.7: Policy Gradient Methods for MARL
 *
 * Covers: Policy gradients for multi-agent, IGA, gradient dynamics and cycling
 * Source sections: 6.4.1, 6.4.2
 */

import type { LessonContentData } from '../../deep-learning-python/lessons/lesson-1-1';

const lesson: LessonContentData = {
  lessonId: 'marl-6.7',
  title: 'Policy Gradient Methods for MARL',
  sections: [
    {
      id: 'marl-6.7.1',
      title: 'Gradient Ascent in Expected Reward',
      content: `
All the algorithms we have seen so far are **value-based**: they estimate Q-values and derive policies from them. But we saw that joint-action Q-values have fundamental limitations -- in NoSDE games, they cannot represent the correct equilibrium. An alternative is **policy-based learning**: directly parameterize and optimize the agents' policies using gradient ascent.

We begin with the simplest possible setting: a **two-agent, two-action** general-sum normal-form game. Agent $i$'s policy is a single number $\\alpha \\in [0, 1]$ -- the probability of choosing action 1. Agent $j$'s policy is $\\beta \\in [0, 1]$. The reward matrices are:

$$R_i = \\begin{pmatrix} r_{1,1} & r_{1,2} \\\\ r_{2,1} & r_{2,2} \\end{pmatrix} \\quad R_j = \\begin{pmatrix} c_{1,1} & c_{1,2} \\\\ c_{2,1} & c_{2,2} \\end{pmatrix}$$

The expected rewards are bilinear functions of $\\alpha$ and $\\beta$:

$$U_i(\\alpha, \\beta) = \\alpha \\beta \\, r_{1,1} + \\alpha(1-\\beta) \\, r_{1,2} + (1-\\alpha)\\beta \\, r_{2,1} + (1-\\alpha)(1-\\beta) \\, r_{2,2}$$

Each agent updates its policy in the direction of the gradient of its own expected reward:

$$\\alpha_{k+1} = \\alpha_k + \\kappa \\, \\frac{\\partial U_i}{\\partial \\alpha}$$
$$\\beta_{k+1} = \\beta_k + \\kappa \\, \\frac{\\partial U_j}{\\partial \\beta}$$

where the partial derivatives have clean closed forms:

$$\\frac{\\partial U_i}{\\partial \\alpha} = \\beta \\, u + (r_{1,2} - r_{2,2})$$
$$\\frac{\\partial U_j}{\\partial \\beta} = \\alpha \\, u' + (c_{2,1} - c_{2,2})$$

Here $u = r_{1,1} - r_{1,2} - r_{2,1} + r_{2,2}$ and $u' = c_{1,1} - c_{1,2} - c_{2,1} + c_{2,2}$ capture the "interaction effect" between the agents' actions.

This method requires each agent to know its own reward matrix and the other agent's **current policy**. These are strong assumptions, but they let us analyze the learning dynamics precisely.
`,
      reviewCardIds: ['rc-marl-6.7-1', 'rc-marl-6.7-2'],
      illustrations: [],
    },
    {
      id: 'marl-6.7.2',
      title: 'Infinitesimal Gradient Ascent (IGA)',
      content: `
To understand what happens when two agents simultaneously follow gradient ascent, we take the step size $\\kappa$ to zero, turning the discrete updates into a continuous **dynamical system**. This is called **Infinitesimal Gradient Ascent** (IGA), studied by Singh, Kearns, and Mansour (2000).

The joint policy $(\\alpha, \\beta)$ evolves according to:

$$\\begin{pmatrix} d\\alpha/dt \\\\ d\\beta/dt \\end{pmatrix} = \\begin{pmatrix} 0 & u \\\\ u' & 0 \\end{pmatrix} \\begin{pmatrix} \\alpha \\\\ \\beta \\end{pmatrix} + \\begin{pmatrix} r_{1,2} - r_{2,2} \\\\ c_{2,1} - c_{2,2} \\end{pmatrix}$$

The off-diagonal matrix $F$ with entries $u$ and $u'$ determines everything about the trajectory. The eigenvalues of $F$ satisfy $\\lambda^2 = u \\cdot u'$, leading to three qualitatively different behaviors:

**Case 1: $F$ is not invertible ($u = 0$ or $u' = 0$).** The trajectory diverges along parallel lines. This can occur in zero-sum, common-reward, and general-sum games.

**Case 2: $F$ has purely real eigenvalues ($u \\cdot u' > 0$).** The trajectory diverges away from the center point. This happens in common-reward and some general-sum games, but **never** in zero-sum games (since $u' = -u$ implies $u \\cdot u' \\le 0$).

**Case 3: $F$ has purely imaginary eigenvalues ($u \\cdot u' < 0$).** The trajectory follows **ellipses** around the center point. This is the iconic cycling behavior, occurring in zero-sum and some general-sum games. The center point is $(\\alpha^*, \\beta^*) = ((c_{2,2} - c_{2,1})/u',\\; (r_{2,2} - r_{1,2})/u)$.

The elliptical cycling in Case 3 is the most interesting and problematic. The joint policy $(\\alpha, \\beta)$ orbits forever without converging. This is a concrete illustration of the **non-stationarity** challenge in MARL: each agent's gradient points it in one direction, but the other agent is simultaneously moving, creating a perpetual chase.
`,
      reviewCardIds: ['rc-marl-6.7-3', 'rc-marl-6.7-4'],
      illustrations: [],
    },
    {
      id: 'marl-6.7.3',
      title: 'What IGA Does and Does Not Guarantee',
      content: `
Despite the cycling problem, IGA provides some useful guarantees:

**Average reward convergence.** Even when $(\\alpha, \\beta)$ cycles on an ellipse, Singh, Kearns, and Mansour (2000) proved that the **average rewards** received during learning converge to the expected rewards of some Nash equilibrium. In technical terms, the time-averaged reward converges -- a weaker form of convergence (per Equation 5.8 in the textbook) than having the policies themselves converge.

**If convergence occurs, it is to a Nash equilibrium.** When $(\\alpha, \\beta)$ does converge to a fixed point, that point must be a Nash equilibrium of the game. This follows from the fact that convergence requires the projected gradient to be zero, and zero-gradient points in the constrained system are Nash equilibria.

**Finite step sizes work too.** These results extend to finite (but decreasing) step sizes $\\kappa_k = 1/k^{2/3}$, not just the infinitesimal limit.

However, the crucial limitation remains: **policies may never converge**. In Case 3, the ellipses can be entirely contained within the unit square, causing $(\\alpha, \\beta)$ to orbit indefinitely. The agents receive Nash-equilibrium rewards on average, but at any given moment their policies may be far from equilibrium.

This is analogous to a problem in single-agent optimization: gradient ascent on a saddle point can cycle rather than converge. But in MARL, the problem is more fundamental -- it arises from the simultaneous optimization by multiple agents with intertwined objectives.

To understand why cycling occurs intuitively: when agent $i$ is "ahead" (doing better than equilibrium), it has little incentive to change, so its gradient is small. Meanwhile, agent $j$ is "behind" and changes rapidly. By the time agent $j$ catches up, agent $i$ is now behind, and the roles reverse. The variable learning-rate idea of **WoLF** (next lesson) directly addresses this asymmetry.
`,
      reviewCardIds: ['rc-marl-6.7-5'],
      illustrations: [],
    },
  ],
  summary: `**Key takeaways:**
- Policy-based learning directly optimizes policy parameters via gradient ascent, avoiding the limitations of joint-action Q-values.
- In two-agent, two-action games, the gradient dynamics form a linear dynamical system characterized by the matrix $F$ with interaction terms $u$ and $u'$.
- IGA (Infinitesimal Gradient Ascent) can exhibit three trajectory types: divergent ($F$ not invertible), divergent from center (real eigenvalues), or elliptical cycling (imaginary eigenvalues).
- Even when cycling, the average rewards converge to Nash equilibrium values -- but the policies themselves may never converge.
- The cycling problem motivates variable learning-rate methods like WoLF, which we cover next.`,
};

export default lesson;
